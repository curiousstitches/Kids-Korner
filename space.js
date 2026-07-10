// ============================================================
// 🕹️ BUDDY GAMESPACE — 22 full-screen games in their own world
// Loads last; takes over the arcade menu with a big clear UI.
// ============================================================

(function () {
    const s = document.createElement('style');
    s.textContent = `
#gsRoot { position:fixed; inset:0; z-index:8000; display:flex; flex-direction:column; background:linear-gradient(160deg,#2b1e66,#6a3ba0,#1f4f8f); animation:gsIn .3s ease; font-family:inherit; }
@keyframes gsIn { from { opacity:0; transform:scale(1.04);} to { opacity:1; transform:scale(1);} }
.gs-head { display:flex; align-items:center; gap:12px; padding:12px 18px; color:white; }
.gs-head h2 { font-size:1.25rem; text-shadow:1px 2px 3px rgba(0,0,0,.4); margin-right:auto; }
.gs-head .gs-score { font-weight:bold; font-size:1.05rem; background:rgba(255,255,255,.16); padding:6px 16px; border-radius:999px; }
.gs-x { background:#ff5252; color:white; border:none; width:44px; height:44px; border-radius:50%; font-size:1.25rem; cursor:pointer; font-weight:bold; box-shadow:0 4px 10px rgba(0,0,0,.3); }
.gs-x:hover { transform:scale(1.1); }
.gs-stage { flex:1; overflow:auto; display:flex; align-items:center; justify-content:center; padding:10px; position:relative; }
.gs-card { background:rgba(255,255,255,.97); border-radius:22px; padding:18px; box-shadow:0 16px 50px rgba(0,0,0,.45); max-width:96%; max-height:100%; overflow:auto; text-align:center; color:#333; }
.gs-hint { color:rgba(255,255,255,.9); text-align:center; padding:8px 14px 14px; font-size:.85rem; }
.gs-btn { background:linear-gradient(135deg,#ff6b9d,#a855f7); color:white; border:none; padding:12px 22px; border-radius:16px; font-family:inherit; font-size:1rem; font-weight:bold; cursor:pointer; margin:4px; box-shadow:0 4px 10px rgba(0,0,0,.25); }
.gs-btn:hover { transform:scale(1.06); }
.gs-btn.gs-sec { background:#e9e4f8; color:#4a3f75; }
.gs-input { padding:12px 14px; border:3px solid #a855f7; border-radius:14px; font-family:inherit; font-size:1rem; width:min(340px,70vw); outline:none; }
.gs-grid { display:grid; gap:6px; justify-content:center; margin:10px auto; }
.gs-cell { border:none; border-radius:10px; cursor:pointer; font-family:inherit; display:flex; align-items:center; justify-content:center; }
.gs-swatch { width:44px; height:44px; border-radius:12px; border:3px solid white; box-shadow:0 3px 8px rgba(0,0,0,.3); cursor:pointer; position:relative; font-weight:bold; color:white; text-shadow:1px 1px 2px rgba(0,0,0,.6); font-size:1rem; }
.gs-swatch.gs-on { outline:4px solid #333; transform:scale(1.12); }
.gs-pal { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin:10px 0; }
.gs-key { background:white; border:2px solid #a855f7; border-radius:10px; width:38px; height:44px; font-size:1.05rem; font-weight:bold; cursor:pointer; color:#333; }
.gs-key:disabled { opacity:.25; }
.gs-kb { display:flex; flex-wrap:wrap; gap:5px; justify-content:center; max-width:460px; margin:10px auto; }
.gs-dpad { display:grid; grid-template-columns:repeat(3,56px); gap:6px; justify-content:center; margin-top:10px; }
.gs-dpad button { height:52px; font-size:1.3rem; border:none; border-radius:12px; background:#e9e4f8; cursor:pointer; }
.gs-menu-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:12px; width:min(920px,94vw); margin:8px auto; }
.gs-mcard { background:rgba(255,255,255,.97); border:none; border-radius:18px; padding:14px 8px; cursor:pointer; font-family:inherit; transition:transform .15s; box-shadow:0 6px 16px rgba(0,0,0,.3); }
.gs-mcard:hover { transform:scale(1.07) rotate(-1deg); }
.gs-mcard .me { font-size:2.3rem; display:block; }
.gs-mcard .mn { font-weight:bold; font-size:.9rem; color:#333; display:block; margin-top:4px; }
.gs-mcard .md { font-size:.7rem; color:#777; display:block; margin-top:2px; }
.gs-sect { color:white; font-size:1.05rem; font-weight:bold; margin:16px auto 6px; width:min(920px,94vw); text-shadow:1px 1px 3px rgba(0,0,0,.4); }
.gs-mini { background:rgba(255,255,255,.85); }
.gs-mini .me { font-size:1.5rem; }
.gs-note { position:absolute; font-size:1.3rem; pointer-events:none; }
.gs-lane-btn { flex:1; height:64px; font-size:1.7rem; border:none; border-radius:14px 14px 0 0; background:rgba(255,255,255,.9); cursor:pointer; }
.gs-fall { position:absolute; transition:top linear; font-size:1.6rem; }
canvas.gs-cv { border-radius:16px; box-shadow:0 8px 24px rgba(0,0,0,.4); background:white; touch-action:none; max-width:100%; }
`;
    document.head.appendChild(s);
})();

// ---------- engine ----------
const GS = { timers: [], alive: false, onclose: null };
function gsT(fn, ms) { const t = setTimeout(fn, ms); GS.timers.push(t); return t; }
function gsI(fn, ms) { const t = setInterval(fn, ms); GS.timers.push(t); return t; }
function gsSnd(f) { if (typeof popSound === 'function') popSound(f); }
function gsChime(a) { a.forEach((f, i) => gsT(() => gsSnd(f), i * 110)); }
function gsRand(n) { return Math.floor(Math.random() * n); }
function gsAge() { return typeof getAgeGroup === 'function' ? getAgeGroup(typeof currentAge !== 'undefined' ? currentAge : '6') : '6'; }
function gsSpeak(t) { if (typeof speak === 'function') speak(t, 'excited'); }

function closeSpace() {
    GS.timers.forEach(t => { clearTimeout(t); clearInterval(t); });
    GS.timers = [];
    GS.alive = false;
    if (GS.onclose) { try { GS.onclose(); } catch (e) {} GS.onclose = null; }
    const r = document.getElementById('gsRoot');
    if (r) r.remove();
}

function openSpace(title, hint) {
    closeSpace();
    GS.alive = true;
    const root = document.createElement('div');
    root.id = 'gsRoot';
    root.innerHTML = '<div class="gs-head"><h2>' + title + '</h2><span class="gs-score" id="gsScore"></span>' +
        '<button class="gs-btn gs-sec" onclick="showGameMenu()">🎮 Games</button><button class="gs-btn" onclick="closeSpace()">💬 Back to Chat</button><button class="gs-x" onclick="closeSpace()" title="Back to chat">✕</button></div>' +
        '<div class="gs-stage" id="gsStage"></div>' +
        (hint ? '<div class="gs-hint">' + hint + '</div>' : '');
    document.body.appendChild(root);
    return {
        stage: root.querySelector('#gsStage'),
        score: (txt) => { root.querySelector('#gsScore').textContent = txt; }
    };
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && GS.alive) closeSpace(); });

function gsWin(msg, replayFn) {
    if (typeof burstConfetti === 'function') burstConfetti();
    gsChime([523, 659, 784, 1046]);
    const st = document.getElementById('gsStage');
    if (!st) return;
    const d = document.createElement('div');
    d.className = 'gs-card';
    d.style.cssText = 'position:absolute; z-index:5; animation:gsIn .3s ease;';
    d.innerHTML = '<h2 style="font-size:1.6rem;">' + msg + '</h2>';
    const again = document.createElement('button');
    again.className = 'gs-btn';
    again.textContent = '🔁 Play again';
    again.onclick = replayFn;
    const menu = document.createElement('button');
    menu.className = 'gs-btn gs-sec';
    menu.textContent = '🎮 All games';
    menu.onclick = showGameMenu;
    d.appendChild(again); d.appendChild(menu);
    st.appendChild(d);
    gsSpeak(msg.replace(/[^\w !?']/g, ' '));
}

// crayon palette shared by art games
const GS_PAL = ['#ffffff', '#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#a855f7', '#8b5e3c', '#333333'];

// AI image with guaranteed pixel access (falls back to a procedural surprise critter)
function gsAIPixels(prompt, styleSuffix, cb) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    let done = false;
    const fallback = () => { if (!done) { done = true; cb(null); } };
    img.onload = () => {
        try {
            const c = document.createElement('canvas');
            c.width = 64; c.height = 64;
            const x = c.getContext('2d');
            x.drawImage(img, 0, 0, 64, 64);
            x.getImageData(0, 0, 1, 1);
            if (!done) { done = true; cb(img); }
        } catch (e) { fallback(); }
    };
    img.onerror = fallback;
    gsT(fallback, 14000);
    img.src = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt + styleSuffix) +
        '?width=512&height=512&nologo=true&safe=true&seed=' + gsRand(1000000);
}
function gsCritter(N) {
    const g = [];
    const half = Math.ceil(N / 2);
    for (let y = 0; y < N; y++) {
        const row = [];
        for (let x = 0; x < half; x++) row.push(Math.random() < 0.42 ? 1 + gsRand(GS_PAL.length - 2) : 0);
        g.push(row.concat(row.slice(0, Math.floor(N / 2)).reverse()));
    }
    return g;
}
function gsNearest(r, g, b) {
    let best = 0, bd2 = 1e9;
    for (let i = 0; i < GS_PAL.length; i++) {
        const h = GS_PAL[i];
        const pr = parseInt(h.substr(1, 2), 16), pg = parseInt(h.substr(3, 2), 16), pb = parseInt(h.substr(5, 2), 16);
        const d2 = (r - pr) * (r - pr) + (g - pg) * (g - pg) + (b - pb) * (b - pb);
        if (d2 < bd2) { bd2 = d2; best = i; }
    }
    return best;
}
function gsPromptCard(stage, title, placeholder, onGo) {
    const card = document.createElement('div');
    card.className = 'gs-card';
    card.innerHTML = '<h3 style="margin-bottom:10px;">' + title + '</h3>';
    const inp = document.createElement('input');
    inp.className = 'gs-input';
    inp.placeholder = placeholder;
    const go = document.createElement('button');
    go.className = 'gs-btn';
    go.textContent = '✨ GO!';
    const fire = () => { const v = inp.value.trim() || placeholder; card.innerHTML = '<h3>🎨 Making your picture...</h3><div style="font-size:2.4rem;animation:spin 2s linear infinite;display:inline-block;">🎨</div>'; onGo(v, card); };
    go.onclick = fire;
    inp.onkeypress = (e) => { if (e.key === 'Enter') fire(); };
    card.appendChild(inp); card.appendChild(go);
    stage.appendChild(card);
    setTimeout(() => inp.focus(), 100);
}

// ============ 1. PAINT BY NUMBERS ============
function spPaintNum() {
    const ui = openSpace('🎨 Paint by Numbers', 'Pick a numbered color, then tap every square with that number!');
    gsPromptCard(ui.stage, 'What should we paint today?', 'a happy dinosaur', (want, card) => {
        gsAIPixels(want, ', cute simple art, bold colors, plain background', (img) => {
            if (!GS.alive) return;
            const N = 18;
            let grid;
            if (img) {
                const c = document.createElement('canvas');
                c.width = N; c.height = N;
                const x = c.getContext('2d');
                x.drawImage(img, 0, 0, N, N);
                const d = x.getImageData(0, 0, N, N).data;
                grid = [];
                for (let y = 0; y < N; y++) { const row = []; for (let xx = 0; xx < N; xx++) { const k = (y * N + xx) * 4; row.push(gsNearest(d[k], d[k + 1], d[k + 2])); } grid.push(row); }
            } else {
                grid = gsCritter(N);
            }
            paintNumBoard(ui, card, grid, N);
        });
    });
}
function paintNumBoard(ui, card, grid, N) {
    card.innerHTML = '<h3 style="margin-bottom:6px;">Match the numbers to the colors!</h3>';
    let cur = 1, left = 0;
    const counts = {};
    grid.flat().forEach(v => { counts[v] = (counts[v] || 0) + 1; if (v !== 0) left++; });
    const pal = document.createElement('div');
    pal.className = 'gs-pal';
    const swatches = {};
    GS_PAL.forEach((col, i) => {
        if (i === 0 || !counts[i]) return;
        const b = document.createElement('button');
        b.className = 'gs-swatch' + (i === cur ? ' gs-on' : '');
        b.style.background = col;
        b.textContent = i;
        b.onclick = () => { cur = i; Object.values(swatches).forEach(x => x.classList.remove('gs-on')); b.classList.add('gs-on'); gsSnd(600); };
        swatches[i] = b;
        pal.appendChild(b);
    });
    const firstIdx = Object.keys(swatches)[0];
    if (firstIdx && !swatches[cur]) { cur = parseInt(firstIdx, 10); swatches[cur].classList.add('gs-on'); }
    card.appendChild(pal);
    const cell = Math.max(18, Math.min(30, Math.floor(Math.min(window.innerWidth * 0.86, 560) / N)));
    const g = document.createElement('div');
    g.className = 'gs-grid';
    g.style.gridTemplateColumns = 'repeat(' + N + ',' + cell + 'px)';
    grid.forEach((row, y) => row.forEach((v, x) => {
        const c = document.createElement('button');
        c.className = 'gs-cell';
        c.style.cssText = 'width:' + cell + 'px;height:' + cell + 'px;font-size:' + Math.max(9, cell - 12) + 'px;';
        if (v === 0) { c.style.background = '#fff'; c.disabled = true; }
        else {
            c.style.background = '#f3eefc';
            c.textContent = v;
            c.onclick = () => {
                if (c.dataset.done) return;
                if (parseInt(c.textContent, 10) === cur) {
                    c.style.background = GS_PAL[v];
                    c.textContent = '';
                    c.dataset.done = '1';
                    left--;
                    gsSnd(500 + v * 40);
                    ui.score('🖌️ ' + left + ' squares left');
                    if (left === 0) gsWin('🖼️ MASTERPIECE COMPLETE!', spPaintNum);
                } else { gsSnd(200); c.style.outline = '2px solid #ef4444'; gsT(() => { c.style.outline = ''; }, 300); }
            };
        }
        g.appendChild(c);
    }));
    card.appendChild(g);
    ui.score('🖌️ ' + left + ' squares left');
}

// ============ 2. COLORING BOOK (tap to fill) ============
function spColoring() {
    const ui = openSpace('🖍️ Coloring Book', 'Pick a color, then tap a white area to fill it in!');
    gsPromptCard(ui.stage, 'What coloring page should I draw?', 'a friendly dragon', (want, card) => {
        gsAIPixels(want, ', coloring book page, clean black line art, white background, thick outlines', (img) => {
            if (!GS.alive) return;
            card.innerHTML = '<h3 style="margin-bottom:6px;">Tap to fill with color!</h3>';
            const size = Math.min(window.innerWidth * 0.86, window.innerHeight * 0.55, 460);
            const cv = document.createElement('canvas');
            cv.className = 'gs-cv';
            cv.width = 320; cv.height = 320;
            cv.style.width = size + 'px';
            const x = cv.getContext('2d');
            if (img) { x.drawImage(img, 0, 0, 320, 320); }
            else {
                x.fillStyle = '#fff'; x.fillRect(0, 0, 320, 320);
                x.strokeStyle = '#111'; x.lineWidth = 5;
                x.strokeRect(60, 150, 200, 120); // house
                x.beginPath(); x.moveTo(40, 150); x.lineTo(160, 60); x.lineTo(280, 150); x.closePath(); x.stroke();
                x.strokeRect(140, 200, 44, 70);
                x.beginPath(); x.arc(255, 60, 32, 0, Math.PI * 2); x.stroke();
            }
            // darken lines for clean fills
            const idata = x.getImageData(0, 0, 320, 320);
            const dd = idata.data;
            for (let i = 0; i < dd.length; i += 4) {
                const lum = 0.299 * dd[i] + 0.587 * dd[i + 1] + 0.114 * dd[i + 2];
                if (lum < 128) { dd[i] = 0; dd[i + 1] = 0; dd[i + 2] = 0; }
                else if (lum > 200) { dd[i] = 255; dd[i + 1] = 255; dd[i + 2] = 255; }
            }
            x.putImageData(idata, 0, 0);
            let cur = '#ef4444';
            const pal = document.createElement('div');
            pal.className = 'gs-pal';
            GS_PAL.slice(1).forEach(col => {
                const b = document.createElement('button');
                b.className = 'gs-swatch' + (col === cur ? ' gs-on' : '');
                b.style.background = col;
                b.onclick = () => { cur = col; pal.querySelectorAll('.gs-swatch').forEach(s => s.classList.remove('gs-on')); b.classList.add('gs-on'); gsSnd(620); };
                pal.appendChild(b);
            });
            card.appendChild(pal);
            card.appendChild(cv);
            cv.addEventListener('pointerdown', (e) => {
                const r = cv.getBoundingClientRect();
                const px = Math.floor((e.clientX - r.left) / r.width * 320);
                const py = Math.floor((e.clientY - r.top) / r.height * 320);
                floodFill(x, px, py, cur);
                gsSnd(700);
            });
        });
    });
}
function floodFill(ctx, sx, sy, hex) {
    const W = 320, H = 320;
    const id = ctx.getImageData(0, 0, W, H);
    const d = id.data;
    const k0 = (sy * W + sx) * 4;
    const tr = d[k0], tg = d[k0 + 1], tb = d[k0 + 2];
    if (tr < 60 && tg < 60 && tb < 60) return; // clicked a line
    const fr = parseInt(hex.substr(1, 2), 16), fg = parseInt(hex.substr(3, 2), 16), fb = parseInt(hex.substr(5, 2), 16);
    if (Math.abs(tr - fr) + Math.abs(tg - fg) + Math.abs(tb - fb) < 12) return;
    const stack = [[sx, sy]];
    const match = (k) => Math.abs(d[k] - tr) < 42 && Math.abs(d[k + 1] - tg) < 42 && Math.abs(d[k + 2] - tb) < 42;
    let guard = 0;
    while (stack.length && guard++ < 140000) {
        const [cx, cy] = stack.pop();
        if (cx < 0 || cy < 0 || cx >= W || cy >= H) continue;
        const k = (cy * W + cx) * 4;
        if (!match(k)) continue;
        d[k] = fr; d[k + 1] = fg; d[k + 2] = fb; d[k + 3] = 255;
        stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
    ctx.putImageData(id, 0, 0);
}

// ============ 3. PAINT STUDIO ============
function spStudio() {
    const ui = openSpace('🖌️ Paint Studio', 'Draw anything! Tap a stamp then tap the paper to stamp it.');
    const card = document.createElement('div');
    card.className = 'gs-card';
    const size = Math.min(window.innerWidth * 0.88, window.innerHeight * 0.55, 520);
    card.innerHTML = '';
    const pal = document.createElement('div');
    pal.className = 'gs-pal';
    let cur = '#ef4444', brush = 8, stamp = null;
    GS_PAL.slice(1).concat(['rainbow']).forEach(col => {
        const b = document.createElement('button');
        b.className = 'gs-swatch';
        b.style.background = col === 'rainbow' ? 'linear-gradient(90deg,red,orange,yellow,green,blue,purple)' : col;
        b.onclick = () => { cur = col; stamp = null; gsSnd(620); };
        pal.appendChild(b);
    });
    ['🌟', '❤️', '🌸', '🦋', '🚀'].forEach(e => {
        const b = document.createElement('button');
        b.className = 'gs-swatch';
        b.style.background = 'white';
        b.textContent = e;
        b.onclick = () => { stamp = e; gsSnd(700); };
        pal.appendChild(b);
    });
    card.appendChild(pal);
    const cv = document.createElement('canvas');
    cv.className = 'gs-cv';
    cv.width = 640; cv.height = 640;
    cv.style.width = size + 'px';
    const x = cv.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, 640, 640);
    card.appendChild(cv);
    const row = document.createElement('div');
    [['✏️ Thin', 5], ['🖌️ Med', 12], ['🖍️ Fat', 26]].forEach(([l, w]) => {
        const b = document.createElement('button'); b.className = 'gs-btn gs-sec'; b.textContent = l;
        b.onclick = () => { brush = w; stamp = null; };
        row.appendChild(b);
    });
    const er = document.createElement('button'); er.className = 'gs-btn gs-sec'; er.textContent = '🧽 Eraser';
    er.onclick = () => { cur = '#ffffff'; stamp = null; brush = 30; };
    row.appendChild(er);
    const cl = document.createElement('button'); cl.className = 'gs-btn gs-sec'; cl.textContent = '🗑️ Clear';
    cl.onclick = () => { x.fillStyle = '#fff'; x.fillRect(0, 0, 640, 640); gsSnd(300); };
    row.appendChild(cl);
    const sv = document.createElement('button'); sv.className = 'gs-btn'; sv.textContent = '💾 Save';
    sv.onclick = () => { const a = document.createElement('a'); a.download = 'my-masterpiece.png'; a.href = cv.toDataURL(); a.click(); gsChime([600, 800]); };
    row.appendChild(sv);
    card.appendChild(row);
    ui.stage.appendChild(card);
    let drawing = false, hue = 0;
    const pos = (e) => { const r = cv.getBoundingClientRect(); return [ (e.clientX - r.left) / r.width * 640, (e.clientY - r.top) / r.height * 640 ]; };
    cv.addEventListener('pointerdown', (e) => {
        cv.setPointerCapture(e.pointerId);
        const [px, py] = pos(e);
        if (stamp) { x.font = '48px serif'; x.textAlign = 'center'; x.fillText(stamp, px, py + 16); gsSnd(750); return; }
        drawing = true;
        x.beginPath(); x.moveTo(px, py);
    });
    cv.addEventListener('pointermove', (e) => {
        if (!drawing) return;
        const [px, py] = pos(e);
        hue = (hue + 6) % 360;
        x.strokeStyle = cur === 'rainbow' ? 'hsl(' + hue + ',90%,55%)' : cur;
        x.lineWidth = brush; x.lineCap = 'round';
        x.lineTo(px, py); x.stroke();
    });
    cv.addEventListener('pointerup', () => { drawing = false; });
}

// ============ 4. BALLOON HANGMAN ============
const HANG_WORDS = {
    '3': [['CAT', 'a pet that says meow'], ['DOG', 'a pet that says woof'], ['SUN', 'bright in the sky'], ['BALL', 'you can bounce it']],
    '6': [['APPLE', 'a red fruit'], ['TIGER', 'a big stripey cat'], ['CLOUD', 'fluffy in the sky'], ['ROBOT', 'beep boop!']],
    '12': [['PLANET', 'Earth is one'], ['CASTLE', 'where a king lives'], ['JUNGLE', 'wild and green'], ['WIZARD', 'casts spells']],
    '15': [['GALAXY', 'billions of stars'], ['VOLCANO', 'it erupts!'], ['MYSTERY', 'a puzzle to solve'], ['CHAMPION', 'the winner']],
    'adult': [['ADVENTURE', 'an exciting journey'], ['SYMPHONY', 'an orchestra plays it'], ['HORIZON', 'where sky meets land'], ['CURIOSITY', 'the best trait']]
};
function spHangman() {
    const ui = openSpace('🎈 Balloon Rescue', 'Guess letters! Every wrong guess, Buddy floats higher — save him before he flies away!');
    const list = HANG_WORDS[gsAge()] || HANG_WORDS['6'];
    const [word, hintTxt] = list[gsRand(list.length)];
    let wrong = 0;
    const found = new Set();
    const card = document.createElement('div');
    card.className = 'gs-card';
    card.innerHTML = '<div style="height:150px;position:relative;overflow:hidden;background:linear-gradient(#bfe6ff,#e8f7ff);border-radius:14px;">' +
        '<div id="hgBuddy" style="position:absolute;left:50%;transform:translateX(-50%);bottom:8px;font-size:2.6rem;transition:bottom .5s ease;">🎈🙂</div></div>' +
        '<p style="margin:8px 0;color:#777;">Hint: ' + hintTxt + '</p>' +
        '<div id="hgWord" style="font-size:1.9rem;letter-spacing:10px;font-weight:bold;margin:8px 0;"></div><div class="gs-kb" id="hgKb"></div>';
    ui.stage.appendChild(card);
    const wordEl = card.querySelector('#hgWord');
    const draw = () => { wordEl.textContent = word.split('').map(ch => found.has(ch) ? ch : '_').join(' '); };
    draw();
    ui.score('🎈 6 balloons of safety');
    const kb = card.querySelector('#hgKb');
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(L => {
        const k = document.createElement('button');
        k.className = 'gs-key';
        k.textContent = L;
        k.onclick = () => {
            k.disabled = true;
            if (word.includes(L)) {
                found.add(L); draw(); gsChime([650, 820]);
                if (word.split('').every(ch => found.has(ch))) {
                    card.querySelector('#hgBuddy').textContent = '🙂🎉';
                    gsWin('You saved Buddy! The word was ' + word + '!', spHangman);
                }
            } else {
                wrong++;
                gsSnd(240);
                const b = card.querySelector('#hgBuddy');
                b.style.bottom = (8 + wrong * 18) + 'px';
                b.textContent = '🎈'.repeat(Math.max(1, 3 - Math.floor(wrong / 2))) + '😨';
                ui.score('🎈 ' + (6 - wrong) + ' chances left');
                if (wrong >= 6) {
                    b.style.bottom = '160px';
                    gsWin('Whoosh! Buddy floated off! The word was ' + word + '. Rescue mission #2?', spHangman);
                }
            }
        };
        kb.appendChild(k);
    });
}

// ============ 5. MAZE ============
function spMaze() {
    const ui = openSpace('🌀 Maze Runner', 'Get Buddy 🙂 to the treasure 💎! Use arrow keys or the buttons.');
    const W = 13, H = 11;
    const walls = [];
    for (let y = 0; y < H; y++) { walls.push([]); for (let x = 0; x < W; x++) walls[y].push(15); } // NESW bits
    const seen = Array.from({ length: H }, () => Array(W).fill(false));
    (function carve(x, y) {
        seen[y][x] = true;
        const dirs = [[0, -1, 1, 4], [1, 0, 2, 8], [0, 1, 4, 1], [-1, 0, 8, 2]].sort(() => Math.random() - 0.5);
        dirs.forEach(([dx, dy, bit, obit]) => {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < W && ny < H && !seen[ny][nx]) {
                walls[y][x] &= ~bit;
                walls[ny][nx] &= ~obit;
                carve(nx, ny);
            }
        });
    })(0, 0);
    let px = 0, py = 0, steps = 0;
    const card = document.createElement('div');
    card.className = 'gs-card';
    const cell = Math.max(24, Math.min(38, Math.floor(Math.min(window.innerWidth * 0.86, 520) / W)));
    const cv = document.createElement('canvas');
    cv.className = 'gs-cv';
    cv.width = W * cell + 4; cv.height = H * cell + 4;
    card.appendChild(cv);
    const dpad = document.createElement('div');
    dpad.className = 'gs-dpad';
    dpad.innerHTML = '<span></span><button data-d="0">⬆️</button><span></span><button data-d="3">⬅️</button><button data-d="2">⬇️</button><button data-d="1">➡️</button>';
    card.appendChild(dpad);
    ui.stage.appendChild(card);
    const x2 = cv.getContext('2d');
    function render() {
        x2.fillStyle = '#fff'; x2.fillRect(0, 0, cv.width, cv.height);
        x2.strokeStyle = '#5b3fa8'; x2.lineWidth = 3; x2.lineCap = 'round';
        for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) {
            const w = walls[y][xx], X = xx * cell + 2, Y = y * cell + 2;
            x2.beginPath();
            if (w & 1) { x2.moveTo(X, Y); x2.lineTo(X + cell, Y); }
            if (w & 2) { x2.moveTo(X + cell, Y); x2.lineTo(X + cell, Y + cell); }
            if (w & 4) { x2.moveTo(X, Y + cell); x2.lineTo(X + cell, Y + cell); }
            if (w & 8) { x2.moveTo(X, Y); x2.lineTo(X, Y + cell); }
            x2.stroke();
        }
        x2.font = (cell - 8) + 'px serif'; x2.textAlign = 'center'; x2.textBaseline = 'middle';
        x2.fillText('💎', (W - 1) * cell + cell / 2 + 2, (H - 1) * cell + cell / 2 + 2);
        x2.fillText('🙂', px * cell + cell / 2 + 2, py * cell + cell / 2 + 2);
    }
    function move(d) {
        const bit = [1, 2, 4, 8][d];
        if (walls[py][px] & bit) { gsSnd(200); return; }
        px += [0, 1, 0, -1][d]; py += [-1, 0, 1, 0][d];
        steps++; gsSnd(500 + (d * 40)); render();
        ui.score('👣 ' + steps + ' steps');
        if (px === W - 1 && py === H - 1) gsWin('💎 TREASURE in ' + steps + ' steps!', spMaze);
    }
    dpad.querySelectorAll('button').forEach(b => b.onclick = () => move(parseInt(b.dataset.d, 10)));
    const keyH = (e) => {
        const map = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 };
        if (map[e.key] !== undefined && GS.alive) { e.preventDefault(); move(map[e.key]); }
    };
    document.addEventListener('keydown', keyH);
    GS.onclose = () => document.removeEventListener('keydown', keyH);
    render();
    ui.score('👣 0 steps');
}

// ============ 6. SNAKE ============
function spSnake() {
    const ui = openSpace('🐍 Snake Snack', 'Eat the apples, don\'t bite yourself! Arrows or buttons to steer.');
    const N = 15;
    const card = document.createElement('div');
    card.className = 'gs-card';
    const cell = Math.max(18, Math.min(28, Math.floor(Math.min(window.innerWidth * 0.8, 440) / N)));
    const cv = document.createElement('canvas');
    cv.className = 'gs-cv';
    cv.width = N * cell; cv.height = N * cell;
    card.appendChild(cv);
    const dpad = document.createElement('div');
    dpad.className = 'gs-dpad';
    dpad.innerHTML = '<span></span><button data-d="0">⬆️</button><span></span><button data-d="3">⬅️</button><button data-d="2">⬇️</button><button data-d="1">➡️</button>';
    card.appendChild(dpad);
    ui.stage.appendChild(card);
    const x = cv.getContext('2d');
    let snake = [[7, 7], [6, 7]], dir = 1, food = [10, 7], score = 0, dead = false, pending = 1;
    function step() {
        if (dead) return;
        dir = pending;
        const h = [snake[0][0] + [0, 1, 0, -1][dir], snake[0][1] + [-1, 0, 1, 0][dir]];
        if (h[0] < 0 || h[1] < 0 || h[0] >= N || h[1] >= N || snake.some(s => s[0] === h[0] && s[1] === h[1])) {
            dead = true;
            gsWin('🐍 Snake nap! You munched ' + score + ' apples!', spSnake);
            return;
        }
        snake.unshift(h);
        if (h[0] === food[0] && h[1] === food[1]) {
            score++; gsChime([600, 800]);
            ui.score('🍎 ' + score);
            do { food = [gsRand(N), gsRand(N)]; } while (snake.some(s => s[0] === food[0] && s[1] === food[1]));
        } else snake.pop();
        x.fillStyle = '#eafbe7'; x.fillRect(0, 0, cv.width, cv.height);
        x.font = (cell - 2) + 'px serif'; x.textBaseline = 'top';
        x.fillText('🍎', food[0] * cell, food[1] * cell);
        snake.forEach((s, i) => {
            x.fillStyle = i === 0 ? '#15803d' : 'rgba(34,197,94,' + Math.max(0.35, 1 - i * 0.05) + ')';
            x.beginPath();
            x.arc(s[0] * cell + cell / 2, s[1] * cell + cell / 2, cell / 2 - 1, 0, Math.PI * 2);
            x.fill();
        });
    }
    const setDir = (d) => { if (Math.abs(d - dir) !== 2) pending = d; };
    dpad.querySelectorAll('button').forEach(b => b.onclick = () => setDir(parseInt(b.dataset.d, 10)));
    const keyH = (e) => {
        const map = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 };
        if (map[e.key] !== undefined && GS.alive) { e.preventDefault(); setDir(map[e.key]); }
    };
    document.addEventListener('keydown', keyH);
    GS.onclose = () => document.removeEventListener('keydown', keyH);
    gsI(step, 230);
    ui.score('🍎 0');
}

// ============ 7. CONNECT FOUR ============
function spConnect() {
    const ui = openSpace('🔴 Connect Four', 'Drop your discs — four in a row wins! You are red.');
    const C = 7, R = 6;
    const board = Array.from({ length: R }, () => Array(C).fill(0));
    const card = document.createElement('div');
    card.className = 'gs-card';
    const cell = Math.max(34, Math.min(54, Math.floor(Math.min(window.innerWidth * 0.86, 480) / C)));
    const g = document.createElement('div');
    g.className = 'gs-grid';
    g.style.cssText = 'grid-template-columns:repeat(' + C + ',' + cell + 'px);background:#2563eb;padding:8px;border-radius:14px;';
    const cells = [];
    for (let y = 0; y < R; y++) { cells.push([]); for (let xx = 0; xx < C; xx++) {
        const c = document.createElement('button');
        c.className = 'gs-cell';
        c.style.cssText = 'width:' + cell + 'px;height:' + cell + 'px;border-radius:50%;background:white;font-size:' + (cell - 12) + 'px;transition:transform .1s;';
        c.onclick = () => drop(xx);
        g.appendChild(c);
        cells[y].push(c);
    }}
    card.appendChild(g);
    ui.stage.appendChild(card);
    let over = false, busy = false;
    function landRow(col) { for (let y = R - 1; y >= 0; y--) if (!board[y][col]) return y; return -1; }
    function win4(p) {
        for (let y = 0; y < R; y++) for (let xx = 0; xx < C; xx++)
            for (const [dx, dy] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
                let k = 0;
                while (k < 4 && xx + dx * k < C && yOK(y + dy * k) && board[y + dy * k][xx + dx * k] === p) k++;
                if (k === 4) return true;
            }
        return false;
        function yOK(v) { return v >= 0 && v < R; }
    }
    function paint() {
        for (let y = 0; y < R; y++) for (let xx = 0; xx < C; xx++)
            cells[y][xx].textContent = board[y][xx] === 1 ? '🔴' : board[y][xx] === 2 ? '🟡' : '';
    }
    function drop(col) {
        if (over || busy) return;
        const y = landRow(col);
        if (y < 0) { gsSnd(200); return; }
        board[y][col] = 1; paint(); gsSnd(600);
        if (win4(1)) { over = true; gsWin('🔴 FOUR IN A ROW! You win!', spConnect); return; }
        busy = true;
        gsT(() => {
            let choice = -1;
            for (const p of [2, 1]) { // win, then block
                for (let cc = 0; cc < C; cc++) {
                    const yy = landRow(cc);
                    if (yy < 0) continue;
                    board[yy][cc] = p;
                    const w = win4(p);
                    board[yy][cc] = 0;
                    if (w) { choice = cc; break; }
                }
                if (choice >= 0) break;
            }
            if (choice < 0) { const pref = [3, 2, 4, 1, 5, 0, 6].filter(cc => landRow(cc) >= 0); choice = pref[gsRand(Math.min(3, pref.length))]; }
            const yy = landRow(choice);
            if (yy >= 0) board[yy][choice] = 2;
            paint(); gsSnd(420);
            if (win4(2)) { over = true; gsWin('🟡 Buddy sneaked four in a row! Rematch?', spConnect); }
            busy = false;
        }, 450);
    }
    ui.score('You: 🔴  Buddy: 🟡');
}

// ============ 8. TREASURE BATTLESHIP ============
function spShips() {
    const ui = openSpace('🚢 Treasure Hunt at Sea', 'Four treasure chests hide in the sea. Find them all before your cannonballs run out!');
    const N = 6;
    let shots = 15, found = 0;
    const chests = new Set();
    while (chests.size < 4) chests.add(gsRand(N * N));
    const card = document.createElement('div');
    card.className = 'gs-card';
    card.innerHTML = '<h3 style="margin-bottom:8px;">💣 Fire the cannon by tapping a wave!</h3>';
    const cell = Math.max(38, Math.min(56, Math.floor(Math.min(window.innerWidth * 0.86, 420) / N)));
    const g = document.createElement('div');
    g.className = 'gs-grid';
    g.style.gridTemplateColumns = 'repeat(' + N + ',' + cell + 'px)';
    for (let i = 0; i < N * N; i++) {
        const c = document.createElement('button');
        c.className = 'gs-cell';
        c.style.cssText = 'width:' + cell + 'px;height:' + cell + 'px;font-size:' + (cell - 16) + 'px;background:#7dd3fc;';
        c.textContent = '🌊';
        c.onclick = () => {
            if (c.dataset.hit || shots <= 0) return;
            c.dataset.hit = '1';
            shots--;
            if (chests.has(i)) {
                found++; c.textContent = '💰'; c.style.background = '#fde68a';
                gsChime([600, 800, 1000]);
                if (found === 4) { gsWin('🏴‍☠️ ALL TREASURE FOUND with ' + shots + ' cannonballs to spare!', spShips); return; }
            } else { c.textContent = '💦'; c.style.background = '#bae6fd'; gsSnd(300); }
            ui.score('💣 ' + shots + ' | 💰 ' + found + '/4');
            if (shots === 0 && found < 4) gsWin('Out of cannonballs! You found ' + found + ' of 4. Sail again?', spShips);
        };
        g.appendChild(c);
    }
    card.appendChild(g);
    ui.stage.appendChild(card);
    ui.score('💣 15 | 💰 0/4');
}

// ============ 9. MEMORY XL ============
function spMemoryXL() {
    const ui = openSpace('🃏 Memory Palace', 'Find all 10 pairs! Fewer flips = bigger brain crown.');
    const set = ['🐶','🦄','🍕','🚀','🌈','⚽','🐸','🎩','🍩','🐙'];
    const deck = set.concat(set).sort(() => Math.random() - 0.5);
    let open = [], done = 0, moves = 0, lock = false;
    const card = document.createElement('div');
    card.className = 'gs-card';
    const cell = Math.max(44, Math.min(72, Math.floor(Math.min(window.innerWidth * 0.88, 520) / 5)));
    const g = document.createElement('div');
    g.className = 'gs-grid';
    g.style.gridTemplateColumns = 'repeat(5,' + cell + 'px)';
    deck.forEach((e, i) => {
        const c = document.createElement('button');
        c.className = 'gs-cell';
        c.style.cssText = 'width:' + cell + 'px;height:' + cell + 'px;font-size:' + (cell - 22) + 'px;background:linear-gradient(135deg,#a855f7,#6366f1);color:white;';
        c.textContent = '❓';
        c.onclick = () => {
            if (lock || c.dataset.done || open.find(o => o.i === i)) return;
            c.textContent = e; c.style.background = 'white'; gsSnd(560);
            open.push({ i, c, e });
            if (open.length === 2) {
                moves++;
                ui.score('🧠 ' + moves + ' flips | ' + done + '/10 pairs');
                const [a, b] = open;
                if (a.e === b.e) {
                    a.c.dataset.done = b.c.dataset.done = '1';
                    a.c.style.background = b.c.style.background = '#bbf7d0';
                    open = []; done++;
                    gsChime([650, 850]);
                    if (done === 10) gsWin('🧠 ALL 10 PAIRS in ' + moves + ' flips!', spMemoryXL);
                } else {
                    lock = true;
                    gsT(() => { [a, b].forEach(o => { o.c.textContent = '❓'; o.c.style.background = 'linear-gradient(135deg,#a855f7,#6366f1)'; }); open = []; lock = false; }, 700);
                }
            }
        };
        g.appendChild(c);
    });
    card.appendChild(g);
    ui.stage.appendChild(card);
    ui.score('🧠 0 flips | 0/10 pairs');
}

// ============ 10. SIMON XL ============
function spSimonXL() {
    const ui = openSpace('🚦 Light Symphony', 'Watch the giant lights, then replay the pattern! 10 rounds to glory.');
    const pads = [
        { e: '🔴', c: '#ef4444', f: 392 }, { e: '🟡', c: '#facc15', f: 494 },
        { e: '🟢', c: '#22c55e', f: 587 }, { e: '🔵', c: '#3b82f6', f: 698 }
    ];
    const card = document.createElement('div');
    card.className = 'gs-card';
    const size = Math.max(90, Math.min(150, Math.floor(Math.min(window.innerWidth, 560) / 2 - 40)));
    const g = document.createElement('div');
    g.className = 'gs-grid';
    g.style.gridTemplateColumns = 'repeat(2,' + size + 'px)';
    const btns = pads.map((p, i) => {
        const b = document.createElement('button');
        b.className = 'gs-cell';
        b.style.cssText = 'width:' + size + 'px;height:' + size + 'px;font-size:' + (size / 2.4) + 'px;background:' + p.c + ';opacity:.45;border-radius:22px;transition:all .12s;';
        b.textContent = p.e;
        b.onclick = () => press(i);
        g.appendChild(b);
        return b;
    });
    card.appendChild(g);
    const status = document.createElement('h3');
    status.style.marginTop = '10px';
    card.appendChild(status);
    ui.stage.appendChild(card);
    let seq = [], pos = 0, playing = true;
    function flash(i, ms) { btns[i].style.opacity = '1'; btns[i].style.transform = 'scale(1.08)'; gsSnd(pads[i].f); gsT(() => { btns[i].style.opacity = '.45'; btns[i].style.transform = 'scale(1)'; }, ms || 340); }
    function next() {
        seq.push(gsRand(4)); pos = 0; playing = true;
        status.textContent = '👀 Watch... round ' + seq.length + ' of 10';
        seq.forEach((v, i) => gsT(() => flash(v), 620 * i + 500));
        gsT(() => { playing = false; status.textContent = '🫵 Your turn!'; }, 620 * seq.length + 550);
    }
    function press(i) {
        if (playing) return;
        flash(i, 200);
        if (i === seq[pos]) {
            pos++;
            if (pos === seq.length) {
                ui.score('🏅 Round ' + seq.length);
                if (seq.length >= 10) { gsWin('🏆 10 ROUNDS! Legendary memory!', spSimonXL); return; }
                playing = true; status.textContent = '✨ YES! Next round...';
                gsChime([650, 850]);
                gsT(next, 900);
            }
        } else {
            gsChime([300, 200]);
            gsWin('Oops! You reached round ' + seq.length + '!', spSimonXL);
        }
    }
    gsT(next, 800);
}

// ============ 11. MOLE MANIA XL ============
function spMoleXL() {
    const ui = openSpace('🐹 Mole Mania', '30 seconds, 16 holes, bonk everything furry! Golden moles = 3 points!');
    let score = 0, time = 30, speed = 800;
    const card = document.createElement('div');
    card.className = 'gs-card';
    const cell = Math.max(52, Math.min(78, Math.floor(Math.min(window.innerWidth * 0.88, 480) / 4)));
    const g = document.createElement('div');
    g.className = 'gs-grid';
    g.style.gridTemplateColumns = 'repeat(4,' + cell + 'px)';
    const holes = [];
    for (let i = 0; i < 16; i++) {
        const h = document.createElement('button');
        h.className = 'gs-cell';
        h.style.cssText = 'width:' + cell + 'px;height:' + cell + 'px;font-size:' + (cell - 22) + 'px;background:#ede9fe;';
        h.textContent = '🕳️';
        h.onclick = () => {
            if (h.dataset.m === '1') { score++; whack(h, '💥'); }
            else if (h.dataset.m === '2') { score += 3; whack(h, '✨'); }
        };
        g.appendChild(h);
        holes.push(h);
    }
    function whack(h, fx) { h.dataset.m = '0'; h.textContent = fx; gsSnd(800); gsT(() => { h.textContent = '🕳️'; }, 220); ui.score('💥 ' + score + ' | ⏰ ' + time); }
    card.appendChild(g);
    ui.stage.appendChild(card);
    function popMole() {
        if (!GS.alive) return;
        const h = holes[gsRand(16)];
        if (h.dataset.m === '0' || !h.dataset.m) {
            const gold = Math.random() < 0.15;
            h.dataset.m = gold ? '2' : '1';
            h.textContent = gold ? '🐹✨' : '🐹';
            gsT(() => { if (h.dataset.m !== '0') { h.dataset.m = '0'; h.textContent = '🕳️'; } }, 680);
        }
        speed = Math.max(380, speed - 12);
        gsT(popMole, speed);
    }
    popMole();
    gsI(() => {
        time--;
        ui.score('💥 ' + score + ' | ⏰ ' + time);
        if (time <= 0) gsWin('⏰ ' + score + ' points!' + (score >= 20 ? ' MOLE LEGEND!' : ' Great bonking!'), spMoleXL);
    }, 1000);
    ui.score('💥 0 | ⏰ 30');
}

// ============ 12. BUBBLE POP FRENZY ============
function spBubbles() {
    const ui = openSpace('🫧 Bubble Pop Frenzy', 'Pop bubbles for points! Gold = 5. Don\'t pop the grumpy clouds!');
    let score = 0, time = 30;
    const field = document.createElement('div');
    field.style.cssText = 'position:relative;width:min(94vw,700px);height:100%;min-height:300px;overflow:hidden;background:rgba(255,255,255,.12);border-radius:20px;';
    ui.stage.appendChild(field);
    gsI(() => {
        if (!GS.alive) return;
        const kind = Math.random();
        const b = document.createElement('button');
        const gold = kind > 0.85, bad = kind < 0.15;
        b.textContent = bad ? '🌩️' : gold ? '🟡' : '🫧';
        b.style.cssText = 'position:absolute;bottom:-60px;left:' + (5 + Math.random() * 85) + '%;font-size:' + (1.6 + Math.random() * 1.2) + 'rem;background:none;border:none;cursor:pointer;transition:bottom ' + (3 + Math.random() * 2) + 's linear;';
        b.onclick = () => {
            if (b.dataset.p) return;
            b.dataset.p = '1';
            if (bad) { score = Math.max(0, score - 3); gsSnd(180); b.textContent = '⚡'; }
            else { score += gold ? 5 : 1; gsSnd(gold ? 950 : 700); b.textContent = '💥'; }
            ui.score('🫧 ' + score + ' | ⏰ ' + time);
            gsT(() => b.remove(), 180);
        };
        field.appendChild(b);
        requestAnimationFrame(() => { b.style.bottom = '110%'; });
        gsT(() => b.remove(), 5600);
    }, 480);
    gsI(() => {
        time--;
        ui.score('🫧 ' + score + ' | ⏰ ' + time);
        if (time <= 0) gsWin('🫧 ' + score + ' points of pure popping!', spBubbles);
    }, 1000);
    ui.score('🫧 0 | ⏰ 30');
}

// ============ 13. STAR CATCHER ============
function spStars() {
    const ui = openSpace('🧺 Star Catcher', 'Slide the basket to catch stars ⭐ — dodge the stinky socks 🧦!');
    let score = 0, time = 40;
    const card = document.createElement('div');
    card.className = 'gs-card';
    const Wc = Math.min(window.innerWidth * 0.88, 560), Hc = Math.min(window.innerHeight * 0.55, 420);
    const cv = document.createElement('canvas');
    cv.className = 'gs-cv';
    cv.width = Wc; cv.height = Hc;
    card.appendChild(cv);
    ui.stage.appendChild(card);
    const x = cv.getContext('2d');
    let bx = Wc / 2;
    const items = [];
    cv.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); bx = (e.clientX - r.left) / r.width * Wc; });
    cv.addEventListener('pointerdown', (e) => { const r = cv.getBoundingClientRect(); bx = (e.clientX - r.left) / r.width * Wc; });
    gsI(() => { items.push({ x: 20 + Math.random() * (Wc - 40), y: -20, v: 2 + Math.random() * 2.5, star: Math.random() > 0.3 }); }, 600);
    function loop() {
        if (!GS.alive) return;
        x.fillStyle = '#0f1b3d'; x.fillRect(0, 0, Wc, Hc);
        x.font = '22px serif';
        items.forEach(it => { it.y += it.v; x.fillText(it.star ? '⭐' : '🧦', it.x - 11, it.y); });
        for (let i = items.length - 1; i >= 0; i--) {
            const it = items[i];
            if (it.y > Hc - 34 && Math.abs(it.x - bx) < 42) {
                if (it.star) { score++; gsSnd(750); } else { score = Math.max(0, score - 2); gsSnd(200); }
                items.splice(i, 1);
                ui.score('⭐ ' + score + ' | ⏰ ' + time);
            } else if (it.y > Hc + 20) items.splice(i, 1);
        }
        x.font = '34px serif';
        x.fillText('🧺', bx - 17, Hc - 8);
        requestAnimationFrame(loop);
    }
    loop();
    gsI(() => {
        time--;
        ui.score('⭐ ' + score + ' | ⏰ ' + time);
        if (time <= 0) gsWin('🧺 You caught ' + score + ' stars!', spStars);
    }, 1000);
    ui.score('⭐ 0 | ⏰ 40');
}

// ============ 14. PONG ============
function spPong() {
    const ui = openSpace('🏓 Paddle Battle', 'First to 5! Move your paddle with your finger or mouse.');
    const card = document.createElement('div');
    card.className = 'gs-card';
    const Wc = Math.min(window.innerWidth * 0.88, 560), Hc = Math.min(window.innerHeight * 0.55, 400);
    const cv = document.createElement('canvas');
    cv.className = 'gs-cv';
    cv.width = Wc; cv.height = Hc;
    card.appendChild(cv);
    ui.stage.appendChild(card);
    const x = cv.getContext('2d');
    let py = Hc / 2, by = Hc / 2, ball = { x: Wc / 2, y: Hc / 2, vx: 4, vy: 2.4 }, ps = 0, bs = 0, over = false;
    const PW = 10, PH = 70;
    cv.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); py = (e.clientY - r.top) / r.height * Hc; });
    function reset(dir) { ball = { x: Wc / 2, y: Hc / 2, vx: 4 * dir, vy: (Math.random() * 4 - 2) }; }
    function loop() {
        if (!GS.alive || over) return;
        ball.x += ball.vx; ball.y += ball.vy;
        if (ball.y < 8 || ball.y > Hc - 8) ball.vy *= -1;
        by += (ball.y - by) * 0.075;
        if (ball.x < 26 && Math.abs(ball.y - py) < PH / 2 + 8 && ball.vx < 0) { ball.vx = -ball.vx * 1.04; ball.vy += (ball.y - py) * 0.09; gsSnd(650); }
        if (ball.x > Wc - 26 && Math.abs(ball.y - by) < PH / 2 + 8 && ball.vx > 0) { ball.vx = -ball.vx; ball.vy += (ball.y - by) * 0.05; gsSnd(430); }
        if (ball.x < -12) { bs++; gsSnd(240); reset(1); }
        if (ball.x > Wc + 12) { ps++; gsChime([700, 900]); reset(-1); }
        ui.score('You ' + ps + ' - ' + bs + ' Buddy');
        if (ps >= 5 || bs >= 5) { over = true; gsWin(ps >= 5 ? '🏓 CHAMPION! 5-' + bs + '!' : '🏓 Buddy takes it ' + bs + '-' + ps + '! Rematch?', spPong); return; }
        x.fillStyle = '#123c2e'; x.fillRect(0, 0, Wc, Hc);
        x.strokeStyle = 'rgba(255,255,255,.35)'; x.setLineDash([8, 10]);
        x.beginPath(); x.moveTo(Wc / 2, 0); x.lineTo(Wc / 2, Hc); x.stroke(); x.setLineDash([]);
        x.fillStyle = '#fff';
        x.fillRect(12, py - PH / 2, PW, PH);
        x.fillRect(Wc - 22, by - PH / 2, PW, PH);
        x.font = '20px serif'; x.fillText('🟠', ball.x - 10, ball.y + 7);
        requestAnimationFrame(loop);
    }
    loop();
    ui.score('You 0 - 0 Buddy');
}

// ============ 15. BRICK BREAKER ============
function spBricks() {
    const ui = openSpace('🧱 Brick Blaster', 'Bounce the ball, smash every brick! 3 lives.');
    const card = document.createElement('div');
    card.className = 'gs-card';
    const Wc = Math.min(window.innerWidth * 0.88, 520), Hc = Math.min(window.innerHeight * 0.55, 420);
    const cv = document.createElement('canvas');
    cv.className = 'gs-cv';
    cv.width = Wc; cv.height = Hc;
    card.appendChild(cv);
    ui.stage.appendChild(card);
    const x = cv.getContext('2d');
    const cols = 8, rows = 5, bw = Wc / cols, bh = 22;
    let bricks = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) bricks.push({ x: c * bw, y: 40 + r * (bh + 4), c: GS_PAL[1 + (r % 6)] });
    let px2 = Wc / 2, ball = { x: Wc / 2, y: Hc - 60, vx: 3.4, vy: -4 }, lives = 3, over = false;
    cv.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); px2 = (e.clientX - r.left) / r.width * Wc; });
    function loop() {
        if (!GS.alive || over) return;
        ball.x += ball.vx; ball.y += ball.vy;
        if (ball.x < 8 || ball.x > Wc - 8) ball.vx *= -1;
        if (ball.y < 8) ball.vy *= -1;
        if (ball.y > Hc - 26 && Math.abs(ball.x - px2) < 46 && ball.vy > 0) { ball.vy = -Math.abs(ball.vy); ball.vx += (ball.x - px2) * 0.06; gsSnd(600); }
        if (ball.y > Hc + 14) {
            lives--; gsSnd(220);
            if (lives <= 0) { over = true; gsWin('🧱 ' + (40 - bricks.length) + ' bricks smashed! Again?', spBricks); return; }
            ball = { x: Wc / 2, y: Hc - 60, vx: 3.4, vy: -4 };
        }
        for (let i = bricks.length - 1; i >= 0; i--) {
            const b = bricks[i];
            if (ball.x > b.x && ball.x < b.x + bw && ball.y > b.y && ball.y < b.y + bh) {
                bricks.splice(i, 1); ball.vy *= -1; gsSnd(500 + gsRand(300));
                break;
            }
        }
        ui.score('🧱 ' + bricks.length + ' left | ❤️ ' + lives);
        if (!bricks.length) { over = true; gsWin('🏆 EVERY BRICK SMASHED!', spBricks); return; }
        x.fillStyle = '#1e1b4b'; x.fillRect(0, 0, Wc, Hc);
        bricks.forEach(b => { x.fillStyle = b.c; x.fillRect(b.x + 2, b.y, bw - 4, bh); });
        x.fillStyle = '#fff'; x.fillRect(px2 - 44, Hc - 18, 88, 10);
        x.beginPath(); x.arc(ball.x, ball.y, 8, 0, Math.PI * 2); x.fillStyle = '#facc15'; x.fill();
        requestAnimationFrame(loop);
    }
    loop();
    ui.score('🧱 40 left | ❤️ 3');
}

// ============ 16. WORD BUILDER ============
const WB_WORDS = {
    '3': ['CAT', 'DOG', 'SUN', 'BEE', 'HAT'],
    '6': ['FROG', 'STAR', 'CAKE', 'FISH', 'MOON'],
    '12': ['PLANET', 'CASTLE', 'FRIEND', 'ROCKET', 'GARDEN'],
    '15': ['MYSTERY', 'RAINBOW', 'JOURNEY', 'CAPTAIN', 'THUNDER'],
    'adult': ['ADVENTURE', 'CHOCOLATE', 'BUTTERFLY', 'TELESCOPE', 'SYMPHONY']
};
function spWords() {
    const ui = openSpace('🔤 Word Builder', 'Unscramble the letters — tap tiles in the right order! 5 words to win.');
    const list = (WB_WORDS[gsAge()] || WB_WORDS['6']).slice().sort(() => Math.random() - 0.5);
    let round = 0, card;
    function play() {
        if (card) card.remove();
        const word = list[round];
        let picked = '';
        card = document.createElement('div');
        card.className = 'gs-card';
        card.innerHTML = '<h3>Word ' + (round + 1) + ' of 5</h3><div id="wbSlots" style="font-size:1.8rem;letter-spacing:8px;font-weight:bold;min-height:2.4rem;margin:10px 0;color:#a855f7;"></div>';
        const tiles = document.createElement('div');
        tiles.className = 'gs-kb';
        const slots = card.querySelector('#wbSlots');
        const upd = () => { slots.textContent = picked + '_'.repeat(word.length - picked.length); };
        upd();
        word.split('').map((L, i) => ({ L, r: Math.random() })).sort((a, b) => a.r - b.r).forEach(({ L }) => {
            const t = document.createElement('button');
            t.className = 'gs-key';
            t.style.cssText = 'width:52px;height:56px;font-size:1.4rem;';
            t.textContent = L;
            t.onclick = () => {
                if (t.disabled) return;
                t.disabled = true;
                picked += L;
                gsSnd(560 + picked.length * 50);
                upd();
                if (picked.length === word.length) {
                    if (picked === word) {
                        gsChime([650, 850, 1050]);
                        round++;
                        ui.score('📚 ' + round + '/5');
                        if (round >= 5) gsWin('📚 WORD WIZARD! All 5 unscrambled!', spWords);
                        else gsT(play, 700);
                    } else {
                        gsSnd(220);
                        picked = '';
                        tiles.querySelectorAll('button').forEach(b => b.disabled = false);
                        upd();
                        slots.style.color = '#ef4444';
                        gsT(() => { slots.style.color = '#a855f7'; }, 400);
                    }
                }
            };
            tiles.appendChild(t);
        });
        card.appendChild(tiles);
        const undo = document.createElement('button');
        undo.className = 'gs-btn gs-sec';
        undo.textContent = '↩️ Start word over';
        undo.onclick = () => { picked = ''; tiles.querySelectorAll('button').forEach(b => b.disabled = false); upd(); };
        card.appendChild(undo);
        ui.stage.appendChild(card);
    }
    play();
    ui.score('📚 0/5');
}

// ============ 17. MATH ASTEROIDS ============
function spMathAst() {
    const ui = openSpace('☄️ Math Asteroids', 'Blast the asteroid by tapping the right answer before it lands!');
    let wave = 0, lives = 3, fallMs = 9000;
    const field = document.createElement('div');
    field.style.cssText = 'position:relative;width:min(94vw,640px);height:100%;min-height:320px;overflow:hidden;background:#0b1026;border-radius:20px;display:flex;flex-direction:column;';
    const sky = document.createElement('div');
    sky.style.cssText = 'flex:1;position:relative;overflow:hidden;';
    const padRow = document.createElement('div');
    padRow.style.cssText = 'display:flex;gap:8px;padding:10px;';
    field.appendChild(sky); field.appendChild(padRow);
    ui.stage.appendChild(field);
    function makeQ() {
        const g = gsAge();
        let a, b, q, ans;
        if (g === '3' || g === '6') { a = 1 + gsRand(6); b = 1 + gsRand(4); q = a + ' + ' + b; ans = a + b; }
        else if (g === '12') { a = 5 + gsRand(20); b = 2 + gsRand(15); if (Math.random() < 0.5) { q = a + ' + ' + b; ans = a + b; } else { q = (a + b) + ' - ' + b; ans = a; } }
        else { a = 3 + gsRand(9); b = 2 + gsRand(9); q = a + ' × ' + b; ans = a * b; }
        return { q, ans };
    }
    function wave1() {
        if (!GS.alive) return;
        wave++;
        const { q, ans } = makeQ();
        const ast = document.createElement('div');
        ast.style.cssText = 'position:absolute;top:-70px;left:' + (12 + Math.random() * 60) + '%;font-size:1rem;color:white;text-align:center;transition:top ' + fallMs + 'ms linear;z-index:2;';
        ast.innerHTML = '<div style="font-size:2.4rem;">☄️</div><b style="background:rgba(0,0,0,.5);padding:2px 10px;border-radius:8px;font-size:1.2rem;">' + q + '</b>';
        sky.appendChild(ast);
        requestAnimationFrame(() => { ast.style.top = '86%'; });
        const opts = [ans];
        while (opts.length < 4) { const w = ans + gsRand(9) - 4; if (w !== ans && w >= 0 && opts.indexOf(w) < 0) opts.push(w); }
        opts.sort(() => Math.random() - 0.5);
        padRow.innerHTML = '';
        let solved = false;
        const crash = gsT(() => {
            if (solved) return;
            solved = true;
            lives--; gsSnd(180);
            ast.innerHTML = '<div style="font-size:2.6rem;">💥</div>';
            ui.score('🚀 wave ' + wave + ' | ❤️ ' + lives);
            gsT(() => ast.remove(), 500);
            if (lives <= 0) gsWin('☄️ You survived ' + wave + ' waves of asteroids!', spMathAst);
            else gsT(wave1, 900);
        }, fallMs);
        opts.forEach(v => {
            const p = document.createElement('button');
            p.className = 'gs-btn';
            p.style.flex = '1';
            p.textContent = v;
            p.onclick = () => {
                if (solved) return;
                if (v === ans) {
                    solved = true;
                    clearTimeout(crash);
                    gsChime([700, 950]);
                    ast.innerHTML = '<div style="font-size:2.6rem;">🎇</div>';
                    gsT(() => ast.remove(), 400);
                    fallMs = Math.max(4200, fallMs - 350);
                    ui.score('🚀 wave ' + wave + ' | ❤️ ' + lives);
                    if (wave >= 12) gsWin('🏆 12 WAVES CLEARED! Space genius!', spMathAst);
                    else gsT(wave1, 800);
                } else { p.disabled = true; gsSnd(240); }
            };
            padRow.appendChild(p);
        });
    }
    wave1();
    ui.score('🚀 wave 1 | ❤️ 3');
}

// ============ 18. RHYTHM TAP ============
function spRhythm() {
    const ui = openSpace('🎵 Rhythm Rockstar', 'Tap the lane button (or D, F, J, K keys) right when the note hits the line!');
    const lanes = ['💜', '💙', '💚', '💛'];
    const keys = ['d', 'f', 'j', 'k'];
    const freqs = [392, 494, 587, 698];
    let score = 0, combo = 0;
    const field = document.createElement('div');
    field.style.cssText = 'position:relative;width:min(92vw,480px);height:100%;min-height:340px;display:flex;flex-direction:column;background:#17123a;border-radius:20px;overflow:hidden;';
    const sky = document.createElement('div');
    sky.style.cssText = 'flex:1;position:relative;';
    const line = document.createElement('div');
    line.style.cssText = 'height:4px;background:gold;box-shadow:0 0 12px gold;';
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:6px;padding:8px;';
    field.appendChild(sky); field.appendChild(line); field.appendChild(row);
    ui.stage.appendChild(field);
    const active = [[], [], [], []];
    lanes.forEach((e, i) => {
        const b = document.createElement('button');
        b.className = 'gs-lane-btn';
        b.textContent = e + ' ' + keys[i].toUpperCase();
        b.onclick = () => hit(i);
        row.appendChild(b);
    });
    const keyH = (e) => { const i = keys.indexOf(e.key.toLowerCase()); if (i >= 0 && GS.alive) hit(i); };
    document.addEventListener('keydown', keyH);
    GS.onclose = () => document.removeEventListener('keydown', keyH);
    function hit(i) {
        const H = sky.clientHeight;
        const good = active[i].find(n => { const t = parseFloat(getComputedStyle(n).top); return t > H - 84 && t < H + 10; });
        if (good) {
            good.remove();
            active[i] = active[i].filter(n => n !== good);
            combo++;
            score += 10 + Math.min(combo, 10);
            gsSnd(freqs[i]);
        } else { combo = 0; gsSnd(180); }
        ui.score('🎵 ' + score + ' | 🔥 combo ' + combo);
    }
    let spawned = 0;
    const spawner = gsI(() => {
        if (spawned >= 36) { clearInterval(spawner); gsT(() => gsWin('🎸 FINAL SCORE: ' + score + '!' + (score > 320 ? ' ROCKSTAR!' : ''), spRhythm), 3500); return; }
        spawned++;
        const i = gsRand(4);
        const n = document.createElement('div');
        n.className = 'gs-fall';
        n.textContent = lanes[i];
        n.style.cssText += 'left:' + (i * 25 + 8) + '%;top:-40px;transition:top 2.6s linear;';
        sky.appendChild(n);
        active[i].push(n);
        requestAnimationFrame(() => { n.style.top = (sky.clientHeight + 30) + 'px'; });
        gsT(() => { if (n.parentNode) { n.remove(); active[i] = active[i].filter(v => v !== n); combo = 0; } }, 2800);
    }, 700);
    ui.score('🎵 0 | 🔥 combo 0');
}

// ============ 19. FISHING POND ============
function spFishing() {
    const ui = openSpace('🎣 Fishing Pond', 'Tap the water to drop your hook where a fish will swim! Gold fish = 5 points!');
    let score = 0, time = 40;
    const card = document.createElement('div');
    card.className = 'gs-card';
    const Wc = Math.min(window.innerWidth * 0.88, 560), Hc = Math.min(window.innerHeight * 0.55, 400);
    const cv = document.createElement('canvas');
    cv.className = 'gs-cv';
    cv.width = Wc; cv.height = Hc;
    card.appendChild(cv);
    ui.stage.appendChild(card);
    const x = cv.getContext('2d');
    const fish = [];
    let hook = null;
    gsI(() => { if (fish.length < 7) fish.push({ x: Math.random() < 0.5 ? -30 : Wc + 30, y: 90 + Math.random() * (Hc - 130), v: (1 + Math.random() * 1.6) * (Math.random() < 0.5 ? 1 : -1), gold: Math.random() < 0.18 }); }, 900);
    cv.addEventListener('pointerdown', (e) => {
        if (hook) return;
        const r = cv.getBoundingClientRect();
        hook = { x: (e.clientX - r.left) / r.width * Wc, y: 40, vy: 5 };
        gsSnd(500);
    });
    function loop() {
        if (!GS.alive) return;
        x.fillStyle = '#7dd3fc'; x.fillRect(0, 0, Wc, 60);
        x.fillStyle = '#0e7490'; x.fillRect(0, 60, Wc, Hc);
        x.font = '26px serif';
        x.fillText('⛵', Wc / 2 - 15, 44);
        fish.forEach(f => { f.x += f.v; x.save(); x.translate(f.x, f.y); if (f.v > 0) x.scale(-1, 1); x.fillText(f.gold ? '🟡🐠' : '🐟', -14, 8); x.restore(); });
        for (let i = fish.length - 1; i >= 0; i--) if (fish[i].x < -60 || fish[i].x > Wc + 60) fish.splice(i, 1);
        if (hook) {
            hook.y += hook.vy;
            x.strokeStyle = '#fff'; x.beginPath(); x.moveTo(hook.x, 48); x.lineTo(hook.x, hook.y); x.stroke();
            x.fillText('🪝', hook.x - 12, hook.y + 10);
            for (let i = fish.length - 1; i >= 0; i--) {
                const f = fish[i];
                if (Math.abs(f.x - hook.x) < 26 && Math.abs(f.y - hook.y) < 22) {
                    score += f.gold ? 5 : 1;
                    gsChime(f.gold ? [700, 900, 1100] : [700, 900]);
                    fish.splice(i, 1);
                    hook = null;
                    ui.score('🐟 ' + score + ' | ⏰ ' + time);
                    break;
                }
            }
            if (hook && hook.y > Hc - 10) hook.vy = -6;
            if (hook && hook.vy < 0 && hook.y < 50) hook = null;
        }
        requestAnimationFrame(loop);
    }
    loop();
    gsI(() => {
        time--;
        ui.score('🐟 ' + score + ' | ⏰ ' + time);
        if (time <= 0) gsWin('🎣 You caught ' + score + ' points of fish!', spFishing);
    }, 1000);
    ui.score('🐟 0 | ⏰ 40');
}

// ============ 20. JIGSAW PUZZLE ============
function spJigsaw() {
    const ui = openSpace('🧩 Jigsaw Studio', 'Tap two tiles to swap them until the picture is perfect!');
    gsPromptCard(ui.stage, 'What picture should the puzzle be?', 'a rainbow castle', (want, card) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        const N = (gsAge() === '3' || gsAge() === '6') ? 3 : 4;
        img.onload = () => { if (GS.alive) build(); };
        img.onerror = () => { if (GS.alive) build(); };
        const url = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(want + ', bright colorful kids illustration') + '?width=512&height=512&nologo=true&safe=true&seed=' + gsRand(1000000);
        img.src = url;
        function build() {
            card.innerHTML = '<h3 style="margin-bottom:8px;">Swap tiles to fix the picture!</h3>';
            const size = Math.min(window.innerWidth * 0.86, window.innerHeight * 0.55, 440);
            const tile = Math.floor(size / N);
            let order = Array.from({ length: N * N }, (_, i) => i);
            do { order.sort(() => Math.random() - 0.5); } while (order.every((v, i) => v === i));
            let sel = null, moves = 0;
            const g = document.createElement('div');
            g.className = 'gs-grid';
            g.style.gridTemplateColumns = 'repeat(' + N + ',' + tile + 'px)';
            const cellEls = [];
            function paint() {
                order.forEach((v, i) => {
                    const c = cellEls[i];
                    c.style.backgroundImage = 'url(' + url + ')';
                    c.style.backgroundSize = size + 'px ' + size + 'px';
                    c.style.backgroundPosition = '-' + (v % N) * tile + 'px -' + Math.floor(v / N) * tile + 'px';
                    c.style.outline = sel === i ? '4px solid gold' : '1px solid rgba(255,255,255,.6)';
                });
            }
            for (let i = 0; i < N * N; i++) {
                const c = document.createElement('button');
                c.className = 'gs-cell';
                c.style.cssText = 'width:' + tile + 'px;height:' + tile + 'px;border-radius:4px;';
                c.onclick = () => {
                    if (sel === null) { sel = i; gsSnd(600); }
                    else if (sel === i) { sel = null; }
                    else {
                        const t = order[sel]; order[sel] = order[i]; order[i] = t;
                        sel = null; moves++; gsSnd(700);
                        ui.score('🧩 ' + moves + ' swaps');
                        paint();
                        if (order.every((v, k) => v === k)) gsWin('🧩 PUZZLE PERFECT in ' + moves + ' swaps!', spJigsaw);
                        return;
                    }
                    paint();
                };
                g.appendChild(c);
                cellEls.push(c);
            }
            card.appendChild(g);
            paint();
            ui.score('🧩 0 swaps');
        }
    });
}

// ============ 21. TIC-TAC-TOE XL ============
function spTTTXL() {
    const ui = openSpace('⭕ Tic-Tac-Toe Stadium', 'Giant board, big moves. Get three in a row!');
    const cellsState = Array(9).fill(null);
    let over = false;
    const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    const chk = (p) => WINS.find(w => w.every(i => cellsState[i] === p));
    const card = document.createElement('div');
    card.className = 'gs-card';
    const cell = Math.max(70, Math.min(120, Math.floor(Math.min(window.innerWidth * 0.85, window.innerHeight * 0.55) / 3)));
    const g = document.createElement('div');
    g.className = 'gs-grid';
    g.style.gridTemplateColumns = 'repeat(3,' + cell + 'px)';
    const els = [];
    for (let i = 0; i < 9; i++) {
        const c = document.createElement('button');
        c.className = 'gs-cell';
        c.style.cssText = 'width:' + cell + 'px;height:' + cell + 'px;font-size:' + (cell - 34) + 'px;background:#f4efff;border:3px solid #a855f7;';
        c.onclick = () => {
            if (over || cellsState[i]) return;
            cellsState[i] = 'X'; c.textContent = '❌'; c.style.transform = 'scale(1.06)'; gsSnd(640);
            let w = chk('X');
            if (w) { over = true; w.forEach(k => els[k].style.background = '#ffe28a'); gsWin('🏆 THREE IN A ROW!', spTTTXL); return; }
            if (cellsState.every(v => v)) { over = true; gsWin('🤝 A perfect tie!', spTTTXL); return; }
            gsT(() => {
                const empt = cellsState.map((v, k) => v ? -1 : k).filter(k => k >= 0);
                let mv = empt.find(k => { cellsState[k] = 'O'; const ok = chk('O'); cellsState[k] = null; return ok; });
                if (mv === undefined) mv = empt.find(k => { cellsState[k] = 'X'; const ok = chk('X'); cellsState[k] = null; return ok; });
                if (mv === undefined) mv = [4, 0, 2, 6, 8].find(k => empt.indexOf(k) >= 0);
                if (mv === undefined) mv = empt[gsRand(empt.length)];
                cellsState[mv] = 'O'; els[mv].textContent = '⭕'; gsSnd(430);
                const w2 = chk('O');
                if (w2) { over = true; w2.forEach(k => els[k].style.background = '#fecaca'); gsWin('Buddy got three! Rematch?', spTTTXL); }
                else if (cellsState.every(v => v)) { over = true; gsWin('🤝 A perfect tie!', spTTTXL); }
            }, 420);
        };
        g.appendChild(c);
        els.push(c);
    }
    card.appendChild(g);
    ui.stage.appendChild(card);
    ui.score('You: ❌  Buddy: ⭕');
}

// ============ 22. SPEED TYPER ============
function spTyper() {
    const ui = openSpace('⌨️ Speed Typer', 'Type each word before it reaches the lava! (Great for big kids)');
    const bank = (WB_WORDS[gsAge()] || WB_WORDS['12']).concat(WB_WORDS['12']).map(w => w.toLowerCase());
    let score = 0, lives = 3;
    const field = document.createElement('div');
    field.style.cssText = 'position:relative;width:min(94vw,600px);height:100%;min-height:300px;display:flex;flex-direction:column;background:#12224a;border-radius:20px;overflow:hidden;';
    const sky = document.createElement('div');
    sky.style.cssText = 'flex:1;position:relative;border-bottom:8px solid #f97316;';
    const inp = document.createElement('input');
    inp.className = 'gs-input';
    inp.style.cssText += 'margin:10px auto;display:block;text-align:center;';
    inp.placeholder = 'type here!';
    field.appendChild(sky); field.appendChild(inp);
    ui.stage.appendChild(field);
    setTimeout(() => inp.focus(), 150);
    const words = [];
    gsI(() => {
        if (words.length >= 4) return;
        const w = { t: bank[gsRand(bank.length)], el: document.createElement('div') };
        w.el.className = 'gs-fall';
        w.el.style.cssText += 'left:' + (8 + Math.random() * 60) + '%;top:-30px;color:white;font-weight:bold;font-size:1.2rem;transition:top 7s linear;';
        w.el.textContent = w.t;
        sky.appendChild(w.el);
        words.push(w);
        requestAnimationFrame(() => { w.el.style.top = (sky.clientHeight - 20) + 'px'; });
        gsT(() => {
            const k = words.indexOf(w);
            if (k >= 0) {
                words.splice(k, 1);
                w.el.textContent = '🔥';
                gsT(() => w.el.remove(), 300);
                lives--; gsSnd(200);
                ui.score('⌨️ ' + score + ' | ❤️ ' + lives);
                if (lives <= 0) gsWin('⌨️ You typed ' + score + ' words at lightning speed!', spTyper);
            }
        }, 7100);
    }, 1800);
    inp.addEventListener('input', () => {
        const v = inp.value.trim().toLowerCase();
        const k = words.findIndex(w => w.t === v);
        if (k >= 0) {
            const w = words[k];
            words.splice(k, 1);
            w.el.textContent = '💥';
            gsT(() => w.el.remove(), 250);
            score++; gsChime([700, 900]);
            inp.value = '';
            ui.score('⌨️ ' + score + ' | ❤️ ' + lives);
            if (score >= 15) gsWin('🏆 15 WORDS! Keyboard wizard!', spTyper);
        }
    });
    ui.score('⌨️ 0 | ❤️ 3');
}

// ---------- THE BIG ARCADE MENU ----------
const BIG_GAMES = [
    { f: 'spPaintNum', e: '🎨', n: 'Paint by Numbers', d: 'AI draws it, you paint it!' },
    { f: 'spColoring', e: '🖍️', n: 'Coloring Book', d: 'Tap-to-fill AI coloring pages' },
    { f: 'spStudio', e: '🖌️', n: 'Paint Studio', d: 'Free drawing + stamps + save' },
    { f: 'spHangman', e: '🎈', n: 'Balloon Rescue', d: 'Word guessing, save Buddy!' },
    { f: 'spMaze', e: '🌀', n: 'Maze Runner', d: 'Find the treasure' },
    { f: 'spSnake', e: '🐍', n: 'Snake Snack', d: 'Classic apple muncher' },
    { f: 'spConnect', e: '🔴', n: 'Connect Four', d: 'Beat Buddy, 4 in a row' },
    { f: 'spShips', e: '🚢', n: 'Treasure at Sea', d: 'Cannonball battleship' },
    { f: 'spMemoryXL', e: '🃏', n: 'Memory Palace', d: '10 pairs, big board' },
    { f: 'spSimonXL', e: '🚦', n: 'Light Symphony', d: 'Giant pattern copying' },
    { f: 'spMoleXL', e: '🐹', n: 'Mole Mania', d: '16 holes, golden moles' },
    { f: 'spBubbles', e: '🫧', n: 'Bubble Frenzy', d: 'Pop pop pop!' },
    { f: 'spStars', e: '🧺', n: 'Star Catcher', d: 'Catch stars, dodge socks' },
    { f: 'spPong', e: '🏓', n: 'Paddle Battle', d: 'Pong vs Buddy' },
    { f: 'spBricks', e: '🧱', n: 'Brick Blaster', d: 'Smash every brick' },
    { f: 'spWords', e: '🔤', n: 'Word Builder', d: 'Unscramble the tiles' },
    { f: 'spMathAst', e: '☄️', n: 'Math Asteroids', d: 'Blast with right answers' },
    { f: 'spRhythm', e: '🎵', n: 'Rhythm Rockstar', d: 'Tap notes to the beat' },
    { f: 'spFishing', e: '🎣', n: 'Fishing Pond', d: 'Hook the golden fish' },
    { f: 'spJigsaw', e: '🧩', n: 'Jigsaw Studio', d: 'AI picture puzzles' },
    { f: 'spTTTXL', e: '⭕', n: 'Tic-Tac Stadium', d: 'Giant 3-in-a-row' },
    { f: 'spTyper', e: '⌨️', n: 'Speed Typer', d: 'Type before the lava!' }
];

function showGameMenu() {
    const ui = openSpace('🎮 BUDDY\'S ARCADE', 'Tap any game to play! Big games open their own screen — quick games play right in the chat.');
    const wrap = document.createElement('div');
    wrap.style.cssText = 'width:100%;height:100%;overflow-y:auto;';
    let html = '<div class="gs-sect">🌟 BIG GAMES — full screen adventures</div><div class="gs-menu-grid">';
    BIG_GAMES.forEach(g => {
        html += '<button class="gs-mcard" onclick="' + g.f + '()"><span class="me">' + g.e + '</span><span class="mn">' + g.n + '</span><span class="md">' + g.d + '</span></button>';
    });
    html += '</div>';
    if (typeof ARCADE !== 'undefined') {
        html += '<div class="gs-sect">💬 QUICK GAMES — play right in the chat</div><div class="gs-menu-grid">';
        ARCADE.forEach(g => {
            html += '<button class="gs-mcard gs-mini" onclick="closeSpace();' + g.f + '()"><span class="me">' + g.e + '</span><span class="mn">' + g.n + '</span></button>';
        });
        html += '</div><div style="height:20px;"></div>';
    }
    wrap.innerHTML = html;
    ui.stage.style.alignItems = 'flex-start';
    ui.stage.appendChild(wrap);
    ui.score((BIG_GAMES.length + (typeof ARCADE !== 'undefined' ? ARCADE.length : 0)) + ' games!');
    if (typeof addXP === 'function') addXP(3);
    if (typeof unlock === 'function') unlock('firstGame');
    const gb = document.getElementById('gamesBtn');
    if (gb) gb.classList.remove('vfx-wiggle');
    gsSpeak('Welcome to the arcade! Pick any game!');
}
