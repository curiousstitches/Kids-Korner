// ===== Buddy 3D =====
// Upgrades every ".buddy-face" (the header house peek + the free-roaming Buddy) from a flat
// CSS circle into a real lit, shaded, spinnable 3D character rendered with Three.js.
//
// Design goals:
//  - Zero edits to the core interaction code in index.html. We hook in by wrapping two
//    already-global functions the same way visuals.js/games.js/space.js do: decorateFace
//    (called every time a face is created or re-skinned) and pokeSpin (the poke trick).
//  - Progressive enhancement: if Three.js or WebGL isn't available, we simply never mount,
//    and the original flat CSS face (already fully functional) stays exactly as it was.
//  - No new WebGL contexts ever leak: a MutationObserver disposes any 3D instance whose
//    face element gets removed from the page (this happens whenever Buddy docks himself).
(function () {
    'use strict';
    if (typeof THREE === 'undefined') return; // graphics library didn't load - CSS fallback stands on its own

    var FALLBACK_SKIN = { colors: { primary: '#667eea', secondary: '#764ba2', accent: '#ffd166' } };

    // face element -> live render instance
    var instances = new WeakMap();
    var activeFaces = []; // parallel list, since WeakMap can't be iterated (needed for resize/frame loop bookkeeping)

    // SAFETY: never animate continuously for kids who need less motion, whether that's an OS-level
    // accessibility setting or the manual "Reduce Buddy's Motion" toggle in Settings.
    function reduceMotion() {
        try {
            if (localStorage.getItem('buddy_reduce_motion') === '1') return true;
        } catch (e) { /* ignore */ }
        return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    function skinFor(key) {
        return (typeof buddySkins !== 'undefined' && buddySkins[key]) || FALLBACK_SKIN;
    }
    function shapeFor(key) {
        return (typeof skinShapes !== 'undefined' && skinShapes[key]) || {};
    }

    // ---- Building a character out of primitives, themed to a skin's colors + accessory list ----
    function makeMat(hex, opts) {
        opts = opts || {};
        return new THREE.MeshPhysicalMaterial(Object.assign({
            color: new THREE.Color(hex), roughness: 0.4, metalness: 0.08,
            clearcoat: 0.55, clearcoatRoughness: 0.3
        }, opts));
    }

    function attachAccessory(group, part, skin) {
        var accent = makeMat(skin.colors.secondary || skin.colors.accent, { roughness: 0.5, clearcoat: 0.2 });
        var m;
        switch (part) {
            case 'b-ears-round':
                [-0.62, 0.62].forEach(function (x) {
                    m = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 20), accent);
                    m.position.set(x, 0.72, 0.05); group.add(m);
                });
                break;
            case 'b-ears-floppy':
                [-0.78, 0.78].forEach(function (x) {
                    m = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), accent);
                    m.scale.set(0.6, 1.5, 0.5);
                    m.position.set(x, 0.15, 0.15); m.rotation.z = x > 0 ? -0.3 : 0.3; group.add(m);
                });
                break;
            case 'b-ears-cat':
                [-0.42, 0.42].forEach(function (x) {
                    m = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.42, 4), accent);
                    m.rotation.y = Math.PI / 4; m.position.set(x, 0.85, 0.15); group.add(m);
                });
                break;
            case 'b-horn':
                m = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.55, 12), makeMat(skin.colors.accent, { roughness: 0.15, metalness: 0.5, clearcoat: 1 }));
                m.position.set(0, 0.95, 0.35); m.rotation.x = -0.35; group.add(m);
                break;
            case 'b-horns':
                [-0.4, 0.4].forEach(function (x) {
                    m = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.4, 10), accent);
                    m.position.set(x, 0.82, 0.05); m.rotation.z = x > 0 ? -0.35 : 0.35; group.add(m);
                });
                break;
            case 'b-spikes':
                for (var i = 0; i < 5; i++) {
                    m = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.28, 8), accent);
                    var t = (i - 2) * 0.28;
                    m.position.set(0, 0.55 - Math.abs(t) * 0.35, -0.55 + t * 0.15);
                    m.rotation.x = 0.9; group.add(m);
                }
                break;
            case 'b-wings':
                [-1, 1].forEach(function (side) {
                    m = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.9, 3), accent);
                    m.scale.set(0.25, 1, 1);
                    m.position.set(side * 0.85, 0.1, -0.35);
                    m.rotation.z = side * 1.15; m.rotation.y = side * 0.4;
                    group.add(m);
                });
                break;
            case 'b-tail':
                m = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.75, 10), accent);
                m.position.set(0, -0.15, -0.85); m.rotation.x = 1.35; group.add(m);
                break;
            case 'b-cape':
                m = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.15), makeMat(skin.colors.secondary || skin.colors.accent, { roughness: 0.6, clearcoat: 0, side: THREE.DoubleSide }));
                m.position.set(0, -0.35, -0.82); m.rotation.x = -0.15; group.add(m);
                break;
            case 'b-halo':
                m = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.045, 10, 24), makeMat(skin.colors.accent, { roughness: 0.1, metalness: 0.7, emissive: new THREE.Color(skin.colors.accent), emissiveIntensity: 0.5 }));
                m.position.set(0, 1.05, 0); m.rotation.x = Math.PI / 2.3; group.add(m);
                break;
            case 'b-bolts':
                [-0.85, 0.85].forEach(function (x) {
                    m = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.14, 10), makeMat('#c0c0c0', { metalness: 0.9, roughness: 0.25 }));
                    m.rotation.z = Math.PI / 2; m.position.set(x, 0.05, 0.1); group.add(m);
                });
                break;
            case 'b-ant':
                m = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), accent);
                m.position.set(0, 1.15, 0); group.add(m);
                m = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), makeMat(skin.colors.accent, { emissive: new THREE.Color(skin.colors.accent), emissiveIntensity: 0.7 }));
                m.position.set(0, 1.42, 0); group.add(m);
                break;
            case 'b-cowhat':
            case 'b-chefhat':
                m = new THREE.Mesh(new THREE.CylinderGeometry(part === 'b-chefhat' ? 0.42 : 0.62, 0.5, 0.1, 20), accent);
                m.position.set(0, 0.98, 0); group.add(m);
                m = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, part === 'b-chefhat' ? 0.55 : 0.32, 20), accent);
                m.position.set(0, part === 'b-chefhat' ? 1.32 : 1.15, 0); group.add(m);
                break;
            case 'b-bandana':
                m = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.09, 8, 20, Math.PI), accent);
                m.position.set(0, 0.55, 0); m.rotation.x = -0.2; group.add(m);
                break;
            case 'b-fin':
                m = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 3), accent);
                m.position.set(0, 0.95, -0.3); m.rotation.x = 0.3; group.add(m);
                break;
            case 'b-tongue':
                m = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.05), makeMat('#ff8fa3', { roughness: 0.5, clearcoat: 0.1 }));
                m.position.set(0, -0.42, 0.92); group.add(m);
                break;
            case 'b-whiskers':
                // subtle - a couple of thin cylinders each side
                [-1, 1].forEach(function (side) {
                    for (var w = 0; w < 2; w++) {
                        m = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 6), makeMat('#f5f5f5', { roughness: 0.3, clearcoat: 0 }));
                        m.rotation.z = Math.PI / 2 + side * (0.25 + w * 0.15);
                        m.position.set(side * 0.55, -0.05 - w * 0.08, 0.85);
                        group.add(m);
                    }
                });
                break;
            case 'b-shell':
                m = new THREE.Mesh(new THREE.SphereGeometry(0.88, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.56), accent);
                m.scale.set(1, 0.82, 0.72);
                m.rotation.x = -Math.PI / 2;
                m.position.set(0, -0.05, -0.7);
                group.add(m);
                break;
            case 'b-tentacles':
                for (var ti = 0; ti < 5; ti++) {
                    m = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.6, 8), accent);
                    var tx = (ti - 2) * 0.24;
                    m.position.set(tx, -0.85, 0.15 - Math.abs(tx) * 0.1);
                    m.rotation.z = Math.PI + tx * 0.5;
                    group.add(m);
                }
                break;
            case 'b-cherry-top':
                m = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.28, 6), makeMat('#4a2f1f', { roughness: 0.7, clearcoat: 0 }));
                m.position.set(0, 1.02, 0.05); group.add(m);
                m = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), makeMat(skin.colors.accent, { roughness: 0.2, clearcoat: 0.8 }));
                m.position.set(0, 1.2, 0.1); group.add(m);
                break;
            case 'b-lava-top':
                m = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.5, 12), makeMat(skin.colors.accent, { roughness: 0.35, emissive: new THREE.Color(skin.colors.accent), emissiveIntensity: 0.85 }));
                m.position.set(0, 0.98, 0); group.add(m);
                break;
            case 'b-mushroom-cap':
                m = new THREE.Mesh(new THREE.SphereGeometry(0.98, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.5), accent);
                m.scale.set(1, 0.62, 1);
                m.position.set(0, 0.55, 0);
                group.add(m);
                break;
        }
    }

    function buildCharacter(skinKey) {
        var skin = skinFor(skinKey);
        var shape = shapeFor(skinKey);
        var group = new THREE.Group();

        var bodyGeo = new THREE.SphereGeometry(1, 48, 40);
        bodyGeo.scale(1, 0.94, 1);
        var body = new THREE.Mesh(bodyGeo, makeMat(skin.colors.primary, { sheen: 1, sheenColor: new THREE.Color(skin.colors.accent) }));
        group.add(body);

        var bellyGeo = new THREE.SphereGeometry(0.64, 32, 24, 0, Math.PI * 2, Math.PI * 0.18, Math.PI * 0.5);
        var belly = new THREE.Mesh(bellyGeo, makeMat(skin.colors.accent, { roughness: 0.5, clearcoat: 0.2 }));
        belly.position.set(0, -0.05, 0.72);
        belly.rotation.x = 0.1;
        group.add(belly);

        var eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.12 });
        var pupilMat = new THREE.MeshStandardMaterial({ color: 0x22232b, roughness: 0.25 });
        [-0.33, 0.33].forEach(function (x) {
            var eye = new THREE.Mesh(new THREE.SphereGeometry(0.165, 18, 18), eyeMat);
            eye.position.set(x, 0.2, 0.86); group.add(eye);
            var pupil = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 14), pupilMat);
            pupil.position.set(x, 0.2, 0.99); group.add(pupil);
        });

        var mouth = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.05, 8, 16, Math.PI), new THREE.MeshStandardMaterial({ color: 0x3a2430, roughness: 0.6 }));
        mouth.position.set(0, -0.3, 0.86);
        mouth.rotation.z = Math.PI;
        group.add(mouth);
        group.userData.mouth = mouth;
        group.userData.mouthBaseY = mouth.position.y;

        (shape.parts || []).forEach(function (p) { attachAccessory(group, p, skin); });

        // Mix-and-match accessory (equipped independently of the skin) - skip if the skin already wears it
        if (typeof ACCESSORY_LIST !== 'undefined' && typeof currentAccessory !== 'undefined') {
            var acc = ACCESSORY_LIST[currentAccessory];
            if (acc && acc.part && (shape.parts || []).indexOf(acc.part) === -1) {
                attachAccessory(group, acc.part, skin);
            }
        }

        return group;
    }

    function disposeGroup(group) {
        group.traverse(function (o) {
            if (o.geometry) o.geometry.dispose();
            if (o.material) {
                if (Array.isArray(o.material)) o.material.forEach(function (m) { m.dispose(); });
                else o.material.dispose();
            }
        });
    }

    // ---- Per-face render instance ----
    function mountFor(face) {
        if (!face || instances.has(face)) { if (face) updateFor(face); return; }
        try {
            var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderer.setClearColor(0x000000, 0);
            if ('outputColorSpace' in renderer) renderer.outputColorSpace = 'srgb';
            else if ('outputEncoding' in renderer) renderer.outputEncoding = THREE.sRGBEncoding;
            if (THREE.ACESFilmicToneMapping) renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.15;
            renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
            face.appendChild(renderer.domElement);

            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 10);
            camera.position.set(0, 0.18, 4.4);
            camera.lookAt(0, 0, 0);

            var key = new THREE.DirectionalLight(0xfff3e0, 1.6); key.position.set(2.2, 3, 4); scene.add(key);
            var rim = new THREE.DirectionalLight(0x8fd3ff, 1.0); rim.position.set(-3, 0.5, -2); scene.add(rim);
            var amb = new THREE.AmbientLight(0xffffff, 0.6); scene.add(amb);
            var fill = new THREE.PointLight(0xffffff, 0.35); fill.position.set(0, -1.5, 2.5); scene.add(fill);

            var skinKey = (typeof currentBuddySkin !== 'undefined' && currentBuddySkin) || 'default';
            var accessoryKey = (typeof currentAccessory !== 'undefined' && currentAccessory) || 'none';
            var char = buildCharacter(skinKey);
            scene.add(char);

            var inst = {
                face: face, renderer: renderer, scene: scene, camera: camera, char: char,
                skinKey: skinKey, accessoryKey: accessoryKey, raf: null, spinT: 0, spinning: false,
                lastW: 0, lastH: 0, lastFrameT: 0
            };
            instances.set(face, inst);
            activeFaces.push(face);
            face.classList.add('buddy-3d-active');
            loop(inst);
        } catch (e) {
            // WebGL unavailable/blocked - the original flat CSS face remains fully visible & functional
        }
    }

    function resize(inst) {
        var r = inst.face.getBoundingClientRect();
        var w = Math.max(0, Math.round(r.width)), h = Math.max(0, Math.round(r.height));
        if (w < 2 || h < 2) return false;
        // Hysteresis: only actually resize the renderer on a REAL size change (>2px), never on
        // sub-pixel layout jitter - resizing every frame is what causes a visible shudder/strobe.
        if (Math.abs(w - inst.lastW) > 2 || Math.abs(h - inst.lastH) > 2) {
            inst.renderer.setSize(w, h, false);
            inst.camera.aspect = w / h;
            inst.camera.updateProjectionMatrix();
            inst.lastW = w; inst.lastH = h;
        }
        return true;
    }

    function loop(inst) {
        inst.raf = requestAnimationFrame(function () { loop(inst); });
        if (document.hidden) return;
        if (inst.face.style.visibility === 'hidden') return; // docked/hidden twin - don't burn a frame

        // Cap to ~30fps - plenty smooth for a small character, and halves any flicker energy vs 60fps.
        var now = performance.now();
        if (inst.lastFrameT && now - inst.lastFrameT < 32) return;
        inst.lastFrameT = now;

        if (!resize(inst)) return; // not laid out yet (e.g. freed Buddy created before he's appended)

        var t = now / 1000;
        var motionOK = !reduceMotion();
        inst.char.position.y = motionOK ? Math.sin(t * 1.6) * 0.055 : 0;

        if (inst.spinning && motionOK) {
            inst.spinT += 0.14;
            inst.char.rotation.y = inst.spinT;
            if (inst.spinT >= Math.PI * 2) { inst.spinning = false; inst.spinT = 0; inst.char.rotation.y = 0; }
        } else {
            // At rest, Buddy holds still facing forward - NO continuous idle rotation/sway.
            // (An earlier version had a slow left-right sway here; removed as a safety precaution.)
            inst.spinning = false;
            inst.char.rotation.y = 0;
        }

        var mouthEl = inst.face.querySelector('.mouth');
        var mouth = inst.char.userData.mouth;
        if (mouth) {
            if (inst.face.classList.contains('buddy-mega') && mouthEl && mouthEl.style.height) {
                var hpx = parseFloat(mouthEl.style.height) || 5;
                var openness = Math.min(1, Math.max(0, (hpx - 5) / 22));
                mouth.scale.y = 0.35 + openness * 1.5;
               