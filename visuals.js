// ============================================================
// ✨ BUDDY VISUALS PACK — 25+ living effects, popups & rewards
// Loads after index.html + games.js and decorates everything.
// ============================================================

// ---------- Styles ----------
(function () {
    const s = document.createElement('style');
    s.textContent = `
.vfx-drop2 { position:fixed; top:-6vh; z-index:3400; font-size:1.3rem; background:none; border:none; cursor:pointer; padding:2px; animation:vfxFall linear forwards; }
.vfx-rise { position:fixed; bottom:-6vh; z-index:3400; font-size:1.3rem; background:none; border:none; cursor:pointer; padding:2px; animation:vfxRise linear forwards; }
@keyframes vfxFall { to { transform: translate(var(--sw, 0px), 115vh) rotate(50deg); } }
@keyframes vfxRise { to { transform: translate(var(--sw, 0px), -115vh) rotate(-30deg); } }
.vfx-spark { position:fixed; pointer-events:none; z-index:6000; font-size:0.8rem; animation:vfxSparkFade .8s ease-out forwards; }
@keyframes vfxSparkFade { from { opacity:1; transform:scale(1); } to { opacity:0; transform:scale(0.2) translateY(-16px); } }
.vfx-ripple { position:fixed; border:3px solid var(--primary, #667eea); border-radius:50%; width:14px; height:14px; pointer-events:none; z-index:6000; animation:vfxRipple .55s ease-out forwards; }
@keyframes vfxRipple { from { opacity:0.75; transform:translate(-50%,-50%) scale(1); } to { opacity:0; transform:translate(-50%,-50%) scale(6.5); } }
.vfx-shard { position:fixed; pointer-events:none; z-index:6200; font-size:1.15rem; animation:vfxShard .95s ease-out forwards; }
@keyframes vfxShard { to { transform:translate(var(--dx), var(--dy)) rotate(200deg); opacity:0; } }
.vfx-rocket { position:fixed; pointer-events:none; z-index:6200; font-size:1.6rem; transition:top .7s ease-out; }
.vfx-heart { position:fixed; bottom:-40px; pointer-events:none; z-index:6000; font-size:1.7rem; animation:vfxHeart 2.6s ease-in forwards; }
@keyframes vfxHeart { 0% { transform:translateY(0) scale(.6); opacity:0; } 15% { opacity:1; } 100% { transform:translateY(-105vh) scale(1.4) rotate(14deg); opacity:0; } }
.vfx-balloon { position:fixed; bottom:-70px; pointer-events:none; z-index:6000; font-size:2.4rem; animation:vfxBalloon 4.5s ease-in forwards; }
@keyframes vfxBalloon { 0% { transform:translateY(0); } 50% { transform:translateY(-55vh) translateX(18px); } 100% { transform:translateY(-115vh) translateX(-12px); } }
.vfx-toast { position:fixed; right:14px; background:white; border:3px solid gold; border-radius:16px; padding:10px 16px; z-index:7000; box-shadow:0 8px 24px rgba(0,0,0,.28); display:flex; gap:10px; align-items:center; animation:vfxToastIn .5s cubic-bezier(.2,.9,.3,1.3); font-family:inherit; color:#333; max-width:290px; }
.vfx-toast .vt-e { font-size:1.7rem; }
.vfx-toast .vt-t { font-size:.85rem; font-weight:bold; }
.vfx-toast .vt-s { font-size:.72rem; color:#777; display:block; font-weight:normal; }
.vfx-toast.vt-pink { border-color:#ff6b9d; }
@keyframes vfxToastIn { from { transform:translateX(120%); } to { transform:translateX(0); } }
.vfx-toast.vt-out { transition:transform .4s, opacity .4s; transform:translateX(130%); opacity:0; }
.vfx-banner { position:fixed; top:0; left:50%; z-index:7200; background:white; color:#333; border-radius:0 0 18px 18px; padding:12px 28px; font-weight:bold; font-size:1rem; box-shadow:0 8px 22px rgba(0,0,0,.3); animation:vfxBanner 4.6s ease forwards; font-family:inherit; white-space:nowrap; }
@keyframes vfxBanner { 0% { transform:translate(-50%,-120%); } 12% { transform:translate(-50%,0); } 84% { transform:translate(-50%,0); } 100% { transform:translate(-50%,-130%); } }
.vfx-xpbar { position:fixed; top:0; left:0; height:4px; width:0%; z-index:7500; background:linear-gradient(90deg,#ffd166,#ff6b9d,#a855f7,#00d4ff); transition:width .6s ease; border-radius:0 4px 4px 0; }
.vfx-level { position:fixed; bottom:12px; left:12px; z-index:2900; background:linear-gradient(135deg,var(--primary,#667eea),var(--secondary,#764ba2)); color:white; padding:8px 14px; border-radius:999px; font-weight:bold; font-size:.85rem; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,.3); font-family:inherit; border:2px solid rgba(255,255,255,.5); transition:transform .15s; }
.vfx-level:hover { transform:scale(1.08); }
.vfx-sky { position:fixed; top:8px; left:10px; z-index:2800; font-size:1.5rem; pointer-events:none; animation:vfxSkyBob 5s ease-in-out infinite; filter:drop-shadow(0 0 8px rgba(255,255,200,.7)); }
@keyframes vfxSkyBob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-5px); } }
.vfx-twinkle { position:fixed; pointer-events:none; z-index:2800; font-size:.8rem; animation:vfxTwinkle 2.4s ease-in-out infinite; }
@keyframes vfxTwinkle { 0%,100% { opacity:.15; } 50% { opacity:.9; } }
.vfx-shoot { position:fixed; z-index:3450; font-size:1.4rem; pointer-events:none; transition:transform 1.2s linear, opacity 1.2s; }
.vfx-glow { box-shadow:0 0 22px var(--accent, gold) !important; transition:box-shadow 1.6s; }
.vfx-speaking { animation:vfxTalkPulse 0.6s ease-in-out infinite !important; }
@keyframes vfxTalkPulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.06); } }
.vfx-wiggle { animation:vfxWiggle 2.2s ease-in-out infinite !important; }
@keyframes vfxWiggle { 0%,86%,100% { transform:rotate(0); } 88% { transform:rotate(-14deg) scale(1.15); } 92% { transform:rotate(12deg) scale(1.15); } 96% { transform:rotate(-8deg); } }
.vfx-flash { position:fixed; inset:0; background:white; z-index:6500; pointer-events:none; animation:vfxFlash .35s ease-out forwards; }
@keyframes vfxFlash { from { opacity:.75; } to { opacity:0; } }
.vfx-rainbow { position:fixed; bottom:-10px; left:50%; transform:translateX(-50%) scale(.2); font-size:7rem; z-index:6100; pointer-events:none; animation:vfxRainbow 2.4s ease forwards; }
@keyframes vfxRainbow { 0% { opacity:0; transform:translateX(-50%) scale(.2); } 30% { opacity:1; transform:translateX(-50%) scale(1.25); } 75% { opacity:1; transform:translateX(-50%) scale(1.1); } 100% { opacity:0; transform:translateX(-50%) scale(1.2) translateY(-30px); } }
.vfx-wave { position:fixed; border-radius:50%; z-index:6400; pointer-events:none; left:50%; top:50%; width:20px; height:20px; transform:translate(-50%,-50%) scale(0); animation:vfxWave .9s ease-out forwards; opacity:.35; }
@keyframes vfxWave { to { transform:translate(-50%,-50%) scale(160); opacity:0; } }
.vfx-inputglow { box-shadow:0 0 16px var(--accent, gold) !important; }
`;
    document.head.appendChild(s);
})();

// ---------- State ----------
let vfx = Object.assign({ xp: 0, msgs: 0, draws: 0, games: 0, words: 0, streak: 1, lastVisit: '', ach: {} },
    JSON.parse(localStorage.getItem('buddy_vfx') || '{}'));
function vfxSave() { localStorage.setItem('buddy_vfx', JSON.stringify(vfx)); }
function vRnd(n) { return Math.floor(Math.random() * n); }
function sndOK() { return typeof popSound === 'function'; }

// ---------- Toast system (achievements, tips, compliments) ----------
function vfxToast(emoji, title, sub, pink) {
    const t = document.createElement('div');
    t.className = 'vfx-toast' + (pink ? ' vt-pink' : '');
    t.innerHTML = '<span class="vt-e">' + emoji + '</span><span class="vt-t">' + title + (sub ? '<span class="vt-s">' + sub + '</span>' : '') + '</span>';
    const existing = document.querySelectorAll('.vfx-toast').length;
    t.style.top = (14 + existing * 74) + 'px';
    document.body.appendChild(t);
    if (sndOK()) { popSound(700); setTimeout(() => popSound(950), 120); }
    setTimeout(() => { t.classList.add('vt-out'); setTimeout(() => t.remove(), 450); }, 3600);
}

// ---------- Achievements ----------
const ACH = {
    firstChat: { e: '💬', t: 'First Words!', s: 'You sent your first message!' },
    chat10: { e: '🗨️', t: 'Chatterbox!', s: '10 messages with Buddy!' },
    chat50: { e: '🏆', t: 'Best Friends!', s: '50 messages! Wow!' },
    firstDraw: { e: '🎨', t: 'First Masterpiece!', s: 'You asked Buddy to draw!' },
    draw5: { e: '🖼️', t: 'Art Collector!', s: '5 drawings made!' },
    firstGame: { e: '🎮', t: 'Game On!', s: 'You opened the arcade!' },
    wordWizard: { e: '📖', t: 'Word Wizard!', s: 'You learned a word spelling!' },
    named: { e: '🏷️', t: 'Name Buddies!', s: 'You and Buddy know each other now!' },
    streak3: { e: '🔥', t: 'On Fire!', s: '3 days visiting in a row!' },
    level5: { e: '🌟', t: 'Super Star!', s: 'Friendship level 5!' }
};
function unlock(id) {
    if (vfx.ach[id]) return;
    vfx.ach[id] = true;
    vfxSave();
    const a = ACH[id];
    if (a) { vfxToast(a.e, a.t, a.s); vfxFireworkAt(window.innerWidth * (0.3 + Math.random() * 0.4), window.innerHeight * 0.4); }
}

// ---------- XP / Friendship Level ----------
function vfxLevel() { return Math.floor(Math.sqrt(vfx.xp / 12)) + 1; }
function vfxLevelUI() {
    let bar = document.getElementById('vfxXpBar');
    if (!bar) { bar = document.createElement('div'); bar.id = 'vfxXpBar'; bar.className = 'vfx-xpbar'; document.body.appendChild(bar); }
    let chip = document.getElementById('vfxLevelChip');
    if (!chip) {
        chip = document.createElement('button');
        chip.id = 'vfxLevelChip';
        chip.className = 'vfx-level';
        chip.onclick = vfxShowProgress;
        document.body.appendChild(chip);
    }
    const lv = vfxLevel();
    const cur = 12 * Math.pow(lv - 1, 2), next = 12 * Math.pow(lv, 2);
    const pct = Math.min(100, Math.round(((vfx.xp - cur) / Math.max(next - cur, 1)) * 100));
    bar.style.width = pct + '%';
    chip.textContent = '⭐ Friend Lv ' + lv;
}
function addXP(n) {
    const before = vfxLevel();
    vfx.xp += n;
    vfxSave();
    const after = vfxLevel();
    vfxLevelUI();
    if (after > before) {
        vfxToast('🎇', 'LEVEL UP! Friendship Lv ' + after, 'You and Buddy are closer than ever!');
        vfxFireworkShow(3);
        if (after >= 5) unlock('level5');
    }
}
function vfxShowProgress() {
    const lv = vfxLevel();
    const earned = Object.keys(vfx.ach).filter(k => vfx.ach[k]).map(k => (ACH[k] || {}).e || '🏅').join(' ');
    vfxToast('⭐', 'Friendship Level ' + lv, (earned ? 'Badges: ' + earned : 'Chat, draw, and play to earn badges!'));
}

// ---------- Fireworks ----------
function vfxBurst(x, y, emojis, count) {
    for (let i = 0; i < (count || 12); i++) {
        const sh = document.createElement('div');
        sh.className = 'vfx-shard';
        sh.textContent = emojis[i % emojis.length];
        sh.style.left = x + 'px';
        sh.style.top = y + 'px';
        const ang = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 120;
        sh.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
        sh.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
        document.body.appendChild(sh);
        setTimeout(() => sh.remove(), 1000);
    }
}
function vfxFireworkAt(x, y) {
    const r = document.createElement('div');
    r.className = 'vfx-rocket';
    r.textContent = '🎆';
    r.style.left = x + 'px';
    r.style.top = window.innerHeight + 'px';
    document.body.appendChild(r);
    requestAnimationFrame(() => { r.style.top = y + 'px'; });
    setTimeout(() => {
        r.remove();
        vfxBurst(x, y, ['✨', '⭐', '💥', '🌟'], 14);
        if (sndOK()) { popSound(200); setTimeout(() => popSound(900), 80); }
    }, 720);
}
function vfxFireworkShow(n) {
    for (let i = 0; i < n; i++) {
        setTimeout(() => vfxFireworkAt(60 + Math.random() * (window.innerWidth - 120), 80 + Math.random() * (window.innerHeight * 0.5)), i * 450);
    }
}
function vfxCannons() {
    [[0, window.innerHeight], [window.innerWidth, window.innerHeight]].forEach(p => {
        vfxBurst(p[0], p[1], ['🎊', '🎉', '✨', '⭐'], 10);
    });
}
function vfxRainbowArc() {
    const r = document.createElement('div');
    r.className = 'vfx-rainbow';
    r.textContent = '🌈';
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 2500);
}

// ---------- Hearts & Balloons ----------
function vfxHearts() {
    const set = ['❤️', '💛', '💕', '💖'];
    for (let i = 0; i < 10; i++) {
        const h = document.createElement('div');
        h.className = 'vfx-heart';
        h.textContent = set[i % set.length];
        h.style.left = (10 + Math.random() * 80) + '%';
        h.style.animationDelay = (Math.random() * 0.9) + 's';
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 3800);
    }
}
function vfxBirthday() {
    for (let i = 0; i < 8; i++) {
        const b = document.createElement('div');
        b.className = 'vfx-balloon';
        b.textContent = ['🎈', '🎈', '🎁', '🎈'][i % 4];
        b.style.left = (8 + Math.random() * 84) + '%';
        b.style.animationDelay = (Math.random() * 1.2) + 's';
        document.body.appendChild(b);
        setTimeout(() => b.remove(), 6000);
    }
    vfxToast('🎂', 'HAPPY BIRTHDAY!!', 'Buddy is throwing you a party!', true);
    vfxFireworkShow(4);
    if (typeof SFX === 'object' && SFX.tada) SFX.tada();
}

// ---------- Ambient particles (seasonal + time of day) ----------
function vfxAmbientConfig() {
    const m = new Date().getMonth(), h = new Date().getHours();
    const night = h >= 19 || h < 6;
    let pool, rise = false;
    if (m === 11 || m <= 1) pool = ['❄️', '❄️', '🌨️'];
    else if (m <= 4) pool = ['🌸', '🌷', '🦋'];
    else if (m <= 7) { pool = night ? ['✨', '🌟'] : ['🫧', '🫧', '🐝']; rise = !night; }
    else pool = ['🍂', '🍁'];
    if (night) pool = pool.concat(['⭐']);
    return { pool: pool, rise: rise, night: night };
}
setInterval(function () {
    if (document.hidden) return;
    if (document.querySelectorAll('.vfx-drop2, .vfx-rise').length >= 9) return;
    const cfg = vfxAmbientConfig();
    const p = document.createElement('button');
    p.className = cfg.rise ? 'vfx-rise' : 'vfx-drop2';
    p.textContent = cfg.pool[vRnd(cfg.pool.length)];
    p.style.left = (Math.random() < 0.5 ? (2 + Math.random() * 32) : (64 + Math.random() * 33)) + '%';
    p.style.setProperty('--sw', (Math.random() * 120 - 60) + 'px');
    p.style.animationDuration = (9 + Math.random() * 8) + 's';
    p.onclick = function () {
        vfxBurst(parseFloat(p.getBoundingClientRect().left), p.getBoundingClientRect().top, ['✨', '💫'], 6);
        if (sndOK()) popSound(750);
        p.remove();
    };
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 18000);
}, 3500);

// ---------- Sky fixture: sun or moon + twinkling stars ----------
(function () {
    const cfg = vfxAmbientConfig();
    const sky = document.createElement('div');
    sky.className = 'vfx-sky';
    sky.textContent = cfg.night ? '🌙' : '☀️';
    document.body.appendChild(sky);
    if (cfg.night) {
        for (let i = 0; i < 4; i++) {
            const st = document.createElement('div');
            st.className = 'vfx-twinkle';
            st.textContent = '✦';
            st.style.color = 'white';
            st.style.left = (Math.random() < 0.5 ? (3 + Math.random() * 22) : (74 + Math.random() * 22)) + '%';
            st.style.top = (2 + Math.random() * 10) + '%';
            st.style.animationDelay = (Math.random() * 2) + 's';
            document.body.appendChild(st);
        }
    }
})();

// ---------- Shooting stars (and meteor showers) ----------
function vfxShootingStar() {
    const s = document.createElement('div');
    s.className = 'vfx-shoot';
    s.textContent = '🌠';
    const x = Math.random() * window.innerWidth * 0.6;
    s.style.left = x + 'px';
    s.style.top = '-30px';
    document.body.appendChild(s);
    requestAnimationFrame(() => {
        s.style.transform = 'translate(' + (240 + Math.random() * 200) + 'px, ' + (window.innerHeight * 0.6) + 'px)';
        s.style.opacity = '0';
    });
    setTimeout(() => s.remove(), 1400);
}
setInterval(function () { if (!document.hidden && Math.random() < 0.6) vfxShootingStar(); }, 110000);
function vfxMeteorShower() { for (let i = 0; i < 12; i++) setTimeout(vfxShootingStar, i * 260); }

// ---------- Pointer trail + click ripples + typing sparks ----------
let lastSpark = 0;
document.addEventListener('pointermove', function (e) {
    const now = Date.now();
    if (now - lastSpark < 90 || Math.random() < 0.55) return;
    lastSpark = now;
    const sp = document.createElement('div');
    sp.className = 'vfx-spark';
    sp.textContent = ['✨', '⭐', '💫'][vRnd(3)];
    sp.style.left = (e.clientX + 6) + 'px';
    sp.style.top = (e.clientY + 8) + 'px';
    document.body.appendChild(sp);
    setTimeout(() => sp.remove(), 850);
});
document.addEventListener('pointerdown', function (e) {
    const r = document.createElement('div');
    r.className = 'vfx-ripple';
    r.style.left = e.clientX + 'px';
    r.style.top = e.clientY + 'px';
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 600);
});
(function () {
    const inp = document.getElementById('messageInput');
    if (!inp) return;
    inp.addEventListener('input', function () {
        if (Math.random() < 0.5) return;
        const rect = inp.getBoundingClientRect();
        const sp = document.createElement('div');
        sp.className = 'vfx-spark';
        sp.textContent = ['✨', '🔤', '💭'][vRnd(3)];
        sp.style.left = (rect.left + 12 + Math.random() * (rect.width - 30)) + 'px';
        sp.style.top = (rect.top - 6) + 'px';
        document.body.appendChild(sp);
        setTimeout(() => sp.remove(), 850);
    });
    inp.addEventListener('focus', function () { inp.classList.add('vfx-inputglow'); });
    inp.addEventListener('blur', function () { inp.classList.remove('vfx-inputglow'); });
})();

// ---------- Speaking pulse: Buddy visibly "talks" ----------
setInterval(function () {
    const talking = ('speechSynthesis' in window) && window.speechSynthesis.speaking;
    const face = document.querySelector('.buddy-face');
    const msgs = document.querySelectorAll('.ai-message');
    const last = msgs[msgs.length - 1];
    // (face pulse retired - the lip-sync mega-grow in index.html owns the face now)
    if (last) last.classList.toggle('vfx-glow', talking);
}, 350);

// ---------- Idle antics ----------
let idleTimer = null;
function resetIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
        if (document.hidden) { resetIdle(); return; }
        const antics = [
            ['😴', 'Zzz... anybody home?', 'Buddy dozed off waiting!'],
            ['🤹', 'Juggling practice!', 'Buddy is entertaining himself...'],
            ['👀', 'Still there, friend?', 'Buddy misses you already!'],
            ['🎪', 'Buddy did a backflip!', 'You missed it. It was amazing.'],
            ['🍪', 'Buddy found a cookie!', 'He is saving half for you.'],
            ['🐌', 'Buddy is racing a snail...', 'It is closer than you would think.'],
            ['🎨', 'Buddy painted your portrait!', 'It is mostly circles. Beautiful circles.'],
            ['🧦', 'Buddy lost a sock!', 'How? He does not even wear socks.']
        ];
        const a = antics[vRnd(antics.length)];
        vfxToast(a[0], a[1], a[2], true);
        resetIdle();
    }, 75000);
}
['pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, resetIdle));
resetIdle();

// ---------- Welcome banner + daily streak ----------
(function () {
    const today = new Date().toDateString();
    if (vfx.lastVisit !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        vfx.streak = (vfx.lastVisit === yesterday) ? (vfx.streak || 0) + 1 : 1;
        vfx.lastVisit = today;
        vfxSave();
        const h = new Date().getHours();
        const greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
        const who = (typeof userName === 'string' && userName) ? ', ' + userName : '';
        setTimeout(function () {
            const b = document.createElement('div');
            b.className = 'vfx-banner';
            b.textContent = (h < 18 ? '☀️ ' : '🌙 ') + greet + who + '! Buddy missed you!';
            document.body.appendChild(b);
            setTimeout(() => b.remove(), 4800);
        }, 700);
        if (vfx.streak >= 2) {
            setTimeout(() => vfxToast('🔥', vfx.streak + ' days in a row!', 'Your friendship streak is growing!'), 5600);
        }
        if (vfx.streak >= 3) unlock('streak3');
    }
})();

// ---------- Compliment cards ----------
const COMPLIMENTS = [
    ['💛', 'You ask GREAT questions!'], ['🌟', 'You have an amazing imagination!'],
    ['🧠', 'Your brain is growing so fast!'], ['🎨', 'You think like an artist!'],
    ['🚀', 'You are curious like a scientist!'], ['🤗', 'Buddy is lucky to know you!'],
    ['⚡', 'You learn things super fast!'], ['🏆', 'You never give up. Amazing!'],
    ['🌈', 'Talking to you is the best part of the day!'], ['🦁', 'You are braver than you know!'],
    ['🎯', 'You notice things other people miss!'], ['🌻', 'You make people around you happier!'],
    ['🧩', 'You are a great problem solver!'], ['✨', 'There is only one YOU in the whole universe!'],
    ['📚', 'Your questions are smarter than most answers!'], ['💪', 'Trying counts double. And you always try!']
];

// ---------- Hook into the app (gentle monkey-patches) ----------
(function () {
    // sendMessage: bursts, XP, milestones, keyword magic
    if (typeof window.sendMessage === 'function') {
        const _send = window.sendMessage;
        window.sendMessage = function () {
            const inp = document.getElementById('messageInput');
            const before = inp ? inp.value : '';
            _send();
            const sent = before.trim() && inp && inp.value === '';
            if (!sent) return;
            vfx.msgs++;
            addXP(2);
            vfxSave();
            const btn = document.querySelector('.input-container button');
            if (btn) {
                const r = btn.getBoundingClientRect();
                vfxBurst(r.left + r.width / 2, r.top, ['✨', '💬'], 5);
            }
            if (typeof SFX === 'object' && SFX.swoosh && Math.random() < 0.35) SFX.swoosh();
            if (vfx.msgs === 1) unlock('firstChat');
            if (vfx.msgs === 10) unlock('chat10');
            if (vfx.msgs === 50) { unlock('chat50'); vfxMeteorShower(); }
            if (vfx.msgs % 6 === 0) {
                const c = COMPLIMENTS[vRnd(COMPLIMENTS.length)];
                setTimeout(() => vfxToast(c[0], c[1], '', true), 2500);
            }
            if (/\bi\s+love\b|\blove\s+you\b/i.test(before)) vfxHearts();
            if (/\bbirthday\b/i.test(before)) vfxBirthday();
        };
    }
    // Drawing: camera flash + art achievements
    if (typeof window.showImageResponse === 'function') {
        const _img = window.showImageResponse;
        window.showImageResponse = function (prompt, tutorial) {
            const f = document.createElement('div');
            f.className = 'vfx-flash';
            document.body.appendChild(f);
            setTimeout(() => f.remove(), 400);
            _img(prompt, tutorial);
            vfx.draws++;
            addXP(5);
            vfxSave();
            if (vfx.draws === 1) unlock('firstDraw');
            if (vfx.draws === 5) unlock('draw5');
        };
    }
    // Arcade: achievement + stop the "new!" wiggle
    if (typeof window.showGameMenu === 'function') {
        const _menu = window.showGameMenu;
        window.showGameMenu = function () {
            _menu();
            vfx.games++;
            addXP(3);
            vfxSave();
            unlock('firstGame');
            const gb = document.getElementById('gamesBtn');
            if (gb) gb.classList.remove('vfx-wiggle');
        };
    }
    // Word lessons
    if (typeof window.readWord === 'function') {
        const _rw = window.readWord;
        window.readWord = function (w) {
            _rw(w);
            vfx.words++;
            addXP(1);
            vfxSave();
            unlock('wordWizard');
        };
    }
    // Names saved
    if (typeof window.saveNames === 'function') {
        const _sn = window.saveNames;
        window.saveNames = function () { _sn(); unlock('named'); };
    }
    // Theme switch: color wave sweep
    if (typeof window.applyTheme === 'function') {
        const _th = window.applyTheme;
        window.applyTheme = function (name) {
            _th(name);
            const w = document.createElement('div');
            w.className = 'vfx-wave';
            w.style.background = 'radial-gradient(circle, var(--primary), transparent 70%)';
            document.body.appendChild(w);
            setTimeout(() => w.remove(), 950);
        };
    }
    // Confetti moments get rainbows + corner cannons sometimes
    if (typeof window.burstConfetti === 'function') {
        const _bc = window.burstConfetti;
        window.burstConfetti = function () {
            _bc();
            vfxCannons();
            if (Math.random() < 0.35) vfxRainbowArc();
        };
    }
    // "New!" wiggle on the games button until first arcade visit
    const gb = document.getElementById('gamesBtn');
    if (gb && !vfx.ach.firstGame) gb.classList.add('vfx-wiggle');

    vfxLevelUI();
})();
