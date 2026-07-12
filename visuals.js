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
.vfx-shard { position:fixed; pointer-events:none; z-index:6200; font-size:1.15rem; animation:vfxShard .95s cubic-bezier(.15,.7,.25,1) forwards; filter:drop-shadow(0 0 5px rgba(255,255,255,0.75)); }
@keyframes vfxShard {
    0% { transform:translate(0,0) scale(0.3) rotate(0); opacity:0; }
    12% { opacity:1; transform:translate(0,0) scale(1.15) rotate(20deg); }
    100% { transform:translate(var(--dx), var(--dy)) scale(0.85) rotate(200deg); opacity:0; }
}
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
.vfx-quest { position:fixed; bottom:58px; left:12px; z-index:2900; background:linear-gradient(135deg,#ff9a3c,#ff6b9d); color:white; padding:7px 13px; border-radius:999px; font-weight:bold; font-size:.78rem; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,.3); font-family:inherit; border:2px solid rgba(255,255,255,.5); transition:transform .15s, opacity .3s; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.vfx-quest:hover { transform:scale(1.06); }
.vfx-quest.vq-done { background:linear-gradient(135deg,#2ecc71,#11998e); }
.vfx-journal { position:fixed; bottom:12px; right:12px; z-index:2900; background:linear-gradient(135deg,#a855f7,#6366f1); color:white; width:44px; height:44px; border-radius:50%; font-size:1.3rem; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,.3); border:2px solid rgba(255,255,255,.5); transition:transform .15s; display:flex; align-items:center; justify-content:center; }
.vfx-journal:hover { transform:scale(1.1) rotate(-6deg); }
.journal-list { max-height:55vh; overflow-y:auto; display:flex; flex-direction:column; gap:10px; }
.journal-entry { display:flex; gap:12px; align-items:flex-start; background:rgba(0,0,0,0.04); border-radius:14px; padding:10px 12px; }
.journal-emoji { font-size:1.6rem; flex-shrink:0; }
.journal-text { font-weight:600; font-size:.92rem; }
.journal-date { font-size:.72rem; color:#888; margin-top:2px; }
.pin-pad { display:grid; grid-template-columns:repeat(3,64px); gap:10px; justify-content:center; margin:18px 0; }
.pin-pad button { width:64px; height:64px; border-radius:50%; border:none; background:rgba(0,0,0,0.06); font-size:1.3rem; font-weight:bold; cursor:pointer; font-family:inherit; }
.pin-pad button:active { transform:scale(0.92); }
.pin-dots { display:flex; justify-content:center; gap:12px; margin:14px 0 4px; }
.pin-dot { width:16px; height:16px; border-radius:50%; border:2px solid #999; transition:background .15s; }
.pin-dot.filled { background:var(--primary,#667eea); border-color:var(--primary,#667eea); }
.dash-stats { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:16px 0; }
.dash-stat { background:rgba(0,0,0,0.04); border-radius:14px; padding:12px; text-align:center; }
.dash-stat .n { font-size:1.4rem; font-weight:bold; display:block; }
.dash-stat .l { font-size:0.72rem; color:#888; }
.vfx-orb { position:fixed; left:0; top:0; z-index:2800; font-size:1.7rem; pointer-events:none; will-change:transform,opacity; transition:transform 55s linear, opacity 80s linear; filter:drop-shadow(0 0 10px rgba(255,255,200,.8)); }
body.sky-off .vfx-orb, body.sky-off .vfx-twinkle, body.sky-off #vfxCity, body.sky-off .vfx-drop2, body.sky-off .vfx-rise, body.sky-off .vfx-shoot { display:none !important; }
#vfxCity { position:fixed; left:0; right:0; bottom:0; height:22vh; pointer-events:none; z-index:-1; opacity:.55; }
.vfx-bldg { position:absolute; bottom:0; border-radius:4px 4px 0 0; background:linear-gradient(#93a0bd,#6d7898); transition:background 8s linear; }
body.vfx-night .vfx-bldg { background:linear-gradient(#2b2f4e,#171a2e); }
.vfx-bldg::after { content:''; position:absolute; inset:10% 16% 4% 16%; background-image:radial-gradient(rgba(255,219,112,.9) 1.3px, transparent 1.8px); background-size:9px 13px; opacity:.1; transition:opacity 8s linear; }
body.vfx-night .vfx-bldg::after { opacity:.8; }
.vfx-twinkle { position:fixed; pointer-events:none; z-index:2800; font-size:.85rem; color:white; will-change:opacity; animation:starBreathe 7s ease-in-out infinite; }
body:not(.vfx-night) .vfx-twinkle { visibility:hidden; }
@keyframes starBreathe { 0%,100% { opacity:.35; } 50% { opacity:.9; } }
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
    if (a) { vfxToast(a.e, a.t, a.s); vfxFireworkAt(window.innerWidth * (0.3 + Math.random() * 0.4), window.innerHeight * 0.4); if (typeof journalAdd === 'function') journalAdd(a.e, a.t + ' ' + a.s); }
    // Some achievements also unlock a house decoration (Buddy's House feature)
    if (typeof HOUSE_DECOR !== 'undefined' && typeof unlockDecor === 'function') {
        Object.entries(HOUSE_DECOR).forEach(([decorId, d]) => {
            if (d.unlockType === 'ach' && d.unlockValue === id) unlockDecor(decorId);
        });
    }
}

// Friendship-Level-gated house decorations - checked every time the level changes
function checkLevelDecor(level) {
    if (typeof HOUSE_DECOR === 'undefined' || typeof unlockDecor !== 'function') return;
    Object.entries(HOUSE_DECOR).forEach(([decorId, d]) => {
        if (d.unlockType === 'level' && level >= d.unlockValue) unlockDecor(decorId);
    });
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
        if (typeof journalAdd === 'function') journalAdd('🎇', 'Reached Friendship Level ' + after + '!');
        if (after >= 5) unlock('level5');
        checkLevelDecor(after);
    }
}
// ---------- Daily Quests ----------
// One small, achievable goal a day, picked deterministically (same quest all day, new one tomorrow),
// tracked off the exact same counters (msgs/draws/games/words) the achievement system already uses.
const QUEST_POOL = [
    { id: 'chat3', type: 'msgs', target: 3, text: 'Chat with Buddy 3 times', emoji: '💬', reward: 8 },
    { id: 'chat5', type: 'msgs', target: 5, text: 'Send Buddy 5 messages', emoji: '💬', reward: 10 },
    { id: 'draw1', type: 'draws', target: 1, text: 'Ask Buddy to draw something', emoji: '🎨', reward: 10 },
    { id: 'game1', type: 'games', target: 1, text: 'Play a game in the arcade', emoji: '🎮', reward: 8 },
    { id: 'word2', type: 'words', target: 2, text: 'Learn 2 new words with Buddy', emoji: '📖', reward: 6 },
    { id: 'chat4draw', type: 'msgs', target: 4, text: 'Chat with Buddy 4 times', emoji: '💬', reward: 9 }
];
function questHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
}
let quest = Object.assign({ date: '', questId: '', progress: 0, done: false }, JSON.parse(localStorage.getItem('buddy_quest') || '{}'));
function questSave() { localStorage.setItem('buddy_quest', JSON.stringify(quest)); }
function ensureQuestForToday() {
    const today = new Date().toISOString().slice(0, 10);
    if (quest.date === today) return;
    const pick = QUEST_POOL[questHash(today) % QUEST_POOL.length];
    quest = { date: today, questId: pick.id, progress: 0, done: false };
    questSave();
}
function currentQuest() { return QUEST_POOL.find(q => q.id === quest.questId) || QUEST_POOL[0]; }
function vfxQuestUI() {
    ensureQuestForToday();
    const q = currentQuest();
    let chip = document.getElementById('vfxQuestChip');
    if (!chip) {
        chip = document.createElement('button');
        chip.id = 'vfxQuestChip';
        chip.className = 'vfx-quest';
        chip.onclick = showQuestDetails;
        document.body.appendChild(chip);
    }
    chip.classList.toggle('vq-done', quest.done);
    chip.textContent = (quest.done ? '✅ ' : q.emoji + ' ') + q.text + (quest.done ? '' : ' (' + Math.min(quest.progress, q.target) + '/' + q.target + ')');
}
function showQuestDetails() {
    const q = currentQuest();
    if (quest.done) vfxToast('✅', "Today's Quest - Done!", q.text + ' - come back tomorrow for a new one!', true);
    else vfxToast(q.emoji, "Today's Quest", q.text + ' (' + Math.min(quest.progress, q.target) + '/' + q.target + ')');
}
function bumpQuest(type, amount) {
    ensureQuestForToday();
    if (quest.done) return;
    const q = currentQuest();
    if (q.type !== type) return;
    quest.progress += amount;
    if (quest.progress >= q.target) {
        quest.done = true;
        questSave();
        addXP(q.reward);
        vfxToast('🌟', 'Quest Complete!', q.text + ' - +' + q.reward + ' XP!', true);
        vfxFireworkAt(window.innerWidth * (0.3 + Math.random() * 0.4), window.innerHeight * 0.4);
        if (typeof journalAdd === 'function') journalAdd('🌟', "Today's Quest done: " + q.text + '!');
    } else {
        questSave();
    }
    vfxQuestUI();
}

// ---------- Buddy's Journal ----------
// A private, auto-saving keepsake of fun moments - milestones, drawings, and achievements -
// captured automatically as they happen, newest first. Capped so localStorage never bloats.
const JOURNAL_MAX = 60;
let journal = JSON.parse(localStorage.getItem('buddy_journal') || '[]');
function journalSave() { localStorage.setItem('buddy_journal', JSON.stringify(journal)); }
function journalAdd(emoji, text) {
    const safeText = typeof escapeHtml === 'function' ? escapeHtml(text) : String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    journal.unshift({ date: new Date().toISOString().slice(0, 10), t: Date.now(), emoji: emoji, text: safeText });
    if (journal.length > JOURNAL_MAX) journal.length = JOURNAL_MAX;
    journalSave();
    const chip = document.getElementById('vfxJournalChip');
    if (chip) { chip.classList.add('vq-done'); setTimeout(() => chip.classList.remove('vq-done'), 1200); }
}
function vfxJournalUI() {
    if (document.getElementById('vfxJournalChip')) return;
    const chip = document.createElement('button');
    chip.id = 'vfxJournalChip';
    chip.className = 'vfx-journal';
    chip.title = "Buddy's Journal";
    chip.textContent = '📔';
    chip.onclick = openJournal;
    document.body.appendChild(chip);
}
function openJournal() {
    let modal = document.getElementById('journalModal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'journalModal';
    modal.className = 'settings-modal active';
    const entriesHtml = journal.length
        ? journal.map(e => '<div class="journal-entry"><span class="journal-emoji">' + e.emoji + '</span><div><div class="journal-text">' + e.text + '</div><div class="journal-date">' + e.date + '</div></div></div>').join('')
        : '<p style="color:#888;text-align:center;padding:20px;">No memories yet — keep playing with Buddy and they\'ll show up here!</p>';
    modal.innerHTML = '<div class="settings-content" style="max-width:480px;"><h2>📔 Buddy\'s Journal</h2><p style="margin-bottom:15px;color:#666;">A little scrapbook of your adventures together!</p><div class="journal-list">' + entriesHtml + '</div><button class="settings-btn" style="position:static;margin-top:20px;width:auto;padding:10px 20px;border-radius:20px;background:var(--primary);color:white;" onclick="document.getElementById(\'journalModal\').remove()">Close</button></div>';
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
}

// ---------- Usage tracking (feeds the Parent Dashboard) ----------
let usageDaily = JSON.parse(localStorage.getItem('buddy_usage_daily') || '{}');
let usageTotal = parseInt(localStorage.getItem('buddy_usage_total') || '0', 10);
let __usageLastTick = Date.now();
function usageTick() {
    const now = Date.now();
    // Cap a single tick so a backgrounded/sleeping tab can't silently rack up fake hours.
    const elapsed = Math.max(0, Math.min(60, Math.round((now - __usageLastTick) / 1000)));
    __usageLastTick = now;
    if (elapsed <= 0) return;
    const today = new Date().toISOString().slice(0, 10);
    usageDaily[today] = (usageDaily[today] || 0) + elapsed;
    usageTotal += elapsed;
    const keys = Object.keys(usageDaily).sort();
    while (keys.length > 14) { delete usageDaily[keys.shift()]; }
    localStorage.setItem('buddy_usage_daily', JSON.stringify(usageDaily));
    localStorage.setItem('buddy_usage_total', String(usageTotal));
}
setInterval(usageTick, 15000);
document.addEventListener('visibilitychange', () => { if (document.hidden) usageTick(); else __usageLastTick = Date.now(); });
window.addEventListener('beforeunload', usageTick);
function usageToday() { return (usageDaily[new Date().toISOString().slice(0, 10)] || 0) + Math.round((Date.now() - __usageLastTick) / 1000); }
function fmtDuration(sec) {
    sec = Math.max(0, Math.round(sec));
    if (sec < 60) return sec + 's';
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
    return h > 0 ? (h + 'h ' + m + 'm') : (m + 'm');
}

// ---------- Parent Dashboard (PIN-gated) ----------
// Client-side only, so this is a deterrent gate (like the parental gates other kids' apps use),
// not real account security - the PIN is stored as a hash, never in plain text.
function pinHash(pin) {
    let h = 0;
    for (let i = 0; i < pin.length; i++) h = (h * 31 + pin.charCodeAt(i)) >>> 0;
    return String(h);
}
let __pinBuffer = '';
function openParentGate() {
    const hasPin = !!localStorage.getItem('buddy_parent_pin');
    renderPinModal(hasPin ? 'enter' : 'create', hasPin ? 'Enter the Parent PIN' : 'Create a 4-digit Parent PIN');
}
function renderPinModal(mode, title, firstPin) {
    __pinBuffer = '';
    let modal = document.getElementById('pinModal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'pinModal';
    modal.className = 'settings-modal active';
    modal.dataset.mode = mode;
    if (firstPin) modal.dataset.firstPin = firstPin;
    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, '✔'];
    const pad = keys.map(k => '<button onclick="pinKey(\'' + k + '\')">' + k + '</button>').join('');
    modal.innerHTML = '<div class="settings-content" style="max-width:340px;text-align:center;"><h2>🔒 ' + title + '</h2>' +
        '<div class="pin-dots" id="pinDots"></div>' +
        '<div class="pin-pad">' + pad + '</div>' +
        '<button class="settings-btn" style="position:static;width:auto;padding:8px 18px;border-radius:16px;background:none;color:#999;box-shadow:none;" onclick="document.getElementById(\'pinModal\').remove()">Cancel</button>' +
        '</div>';
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
    renderPinDots();
}
function renderPinDots() {
    const el = document.getElementById('pinDots');
    if (!el) return;
    el.innerHTML = Array.from({ length: 4 }).map((_, i) => '<span class="pin-dot' + (i < __pinBuffer.length ? ' filled' : '') + '"></span>').join('');
}
function pinKey(k) {
    if (k === '⌫') { __pinBuffer = __pinBuffer.slice(0, -1); renderPinDots(); return; }
    if (k === '✔') { submitPin(); return; }
    if (__pinBuffer.length >= 4) return;
    __pinBuffer += String(k);
    renderPinDots();
    if (__pinBuffer.length === 4) setTimeout(submitPin, 150);
}
function submitPin() {
    const modal = document.getElementById('pinModal');
    if (!modal || __pinBuffer.length !== 4) return;
    const mode = modal.dataset.mode;
    const entered = __pinBuffer;
    if (mode === 'create') {
        modal.remove();
        renderPinModal('confirm', 'Type it again to confirm', entered);
    } else if (mode === 'confirm') {
        modal.remove();
        if (entered === modal.dataset.firstPin) {
            localStorage.setItem('buddy_parent_pin', pinHash(entered));
            openParentDashboard();
        } else {
            vfxToast('❌', "Those didn't match", 'Try setting your PIN again.');
            renderPinModal('create', 'Create a 4-digit Parent PIN');
        }
    } else if (mode === 'enter') {
        if (pinHash(entered) === localStorage.getItem('buddy_parent_pin')) {
            modal.remove();
            openParentDashboard();
        } else {
            vfxToast('❌', 'Wrong PIN', 'Try again.');
            renderPinModal('enter', 'Enter the Parent PIN');
        }
    } else if (mode === 'change-new') {
        modal.remove();
        renderPinModal('change-confirm', 'Type your new PIN again', entered);
    } else if (mode === 'change-confirm') {
        modal.remove();
        if (entered === modal.dataset.firstPin) {
            localStorage.setItem('buddy_parent_pin', pinHash(entered));
            vfxToast('✅', 'PIN updated!', '');
        } else {
            vfxToast('❌', "Those didn't match", 'PIN left unchanged.');
        }
        openParentDashboard();
    }
}
function changeParentPin() { renderPinModal('change-new', 'Type a new PIN'); }

function openParentDashboard() {
    let modal = document.getElementById('parentDashModal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'parentDashModal';
    modal.className = 'settings-modal active';
    const recent = journal.slice(0, 8).map(e => '<div class="journal-entry"><span class="journal-emoji">' + e.emoji + '</span><div><div class="journal-text">' + e.text + '</div><div class="journal-date">' + e.date + '</div></div></div>').join('')
        || '<p style="color:#888;text-align:center;">No activity yet.</p>';
    const achCount = Object.keys(vfx.ach || {}).length;
    modal.innerHTML = '<div class="settings-content" style="max-width:480px;"><h2>👪 Parent Dashboard</h2>' +
        '<div class="dash-stats">' +
        '<div class="dash-stat"><span class="n">' + fmtDuration(usageToday()) + '</span><span class="l">Time today</span></div>' +
        '<div class="dash-stat"><span class="n">' + fmtDuration(usageTotal) + '</span><span class="l">Time all-time</span></div>' +
        '<div class="dash-stat"><span class="n">' + (vfx.msgs || 0) + '</span><span class="l">Messages sent</span></div>' +
        '<div class="dash-stat"><span class="n">' + (vfx.draws || 0) + '</span><span class="l">Drawings made</span></div>' +
        '<div class="dash-stat"><span class="n">' + (vfx.games || 0) + '</span><span class="l">Games played</span></div>' +
        '<div class="dash-stat"><span class="n">' + achCount + '/' + Object.keys(ACH).length + '</span><span class="l">Achievements</span></div>' +
        '<div class="dash-stat"><span class="n">Lv ' + vfxLevel() + '</span><span class="l">Friendship level</span></div>' +
        '<div class="dash-stat"><span class="n">' + (typeof currentAge !== 'undefined' ? currentAge : '?') + '</span><span class="l">Age setting</span></div>' +
        '</div>' +
        '<h2 style="font-size:1.05rem;margin-top:10px;">Recent activity</h2>' +
        '<p style="font-size:0.75rem;color:#888;margin-bottom:10px;">A friendly activity feed - not a word-for-word chat transcript.</p>' +
        '<div class="journal-list" style="max-height:220px;">' + recent + '</div>' +
        '<div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;justify-content:center;">' +
        '<button class="settings-btn" style="position:static;width:auto;padding:10px 16px;border-radius:16px;background:var(--primary);color:white;" onclick="document.getElementById(\'parentDashModal\').remove();if(typeof openSettings===\'function\')openSettings();">⚙️ Open Settings</button>' +
        '<button class="settings-btn" style="position:static;width:auto;padding:10px 16px;border-radius:16px;background:#999;color:white;" onclick="changeParentPin()">🔑 Change PIN</button>' +
        '<button class="settings-btn" style="position:static;width:auto;padding:10px 16px;border-radius:16px;background:none;color:#999;box-shadow:none;" onclick="document.getElementById(\'parentDashModal\').remove()">Close</button>' +
        '</div></div>';
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
}

function vfxRewardCard(unlocked, emoji, title, sub) {
    if (unlocked) {
        return '<div class="buddy-skin-card active" style="cursor:default;"><div class="buddy-skin-preview" style="background:linear-gradient(135deg,var(--primary),var(--secondary));"><span style="font-size:22px;">' + emoji + '</span></div><div class="buddy-skin-name">' + title + '</div>' + (sub ? '<div style="font-size:0.7rem;color:#888;">' + sub + '</div>' : '') + '</div>';
    }
    return '<div class="buddy-skin-card" style="opacity:0.4;cursor:default;"><div class="buddy-skin-preview" style="background:#ccc;"><span style="font-size:22px;">🔒</span></div><div class="buddy-skin-name">???</div></div>';
}

function vfxShowProgress() {
    let modal = document.getElementById('rewardsAlbumModal');
    if (modal) modal.remove();
    const lv = vfxLevel();
    const cur = 12 * Math.pow(lv - 1, 2), next = 12 * Math.pow(lv, 2);
    const pct = Math.min(100, Math.round(((vfx.xp - cur) / Math.max(next - cur, 1)) * 100));

    const badgeCards = Object.entries(ACH).map(([id, a]) => vfxRewardCard(!!vfx.ach[id], a.e, a.t, vfx.ach[id] ? a.s : '')).join('');

    let decorCards = '';
    if (typeof HOUSE_DECOR !== 'undefined' && typeof unlockedHouseDecor !== 'undefined') {
        decorCards = Object.entries(HOUSE_DECOR).map(([id, d]) => vfxRewardCard(unlockedHouseDecor.includes(id), d.emoji, d.label)).join('');
    }

    modal = document.createElement('div');
    modal.id = 'rewardsAlbumModal';
    modal.className = 'settings-modal active';
    modal.innerHTML =
        '<div class="settings-content" style="max-width:560px;">' +
        '<h2>⭐ Friendship Level ' + lv + '</h2>' +
        '<div style="background:#eee;border-radius:8px;height:10px;overflow:hidden;margin-bottom:20px;"><div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,#ffd166,#ff6b9d,#a855f7,#00d4ff);"></div></div>' +
        '<h2 style="margin-bottom:10px;color:#333;">🏅 Badges</h2>' +
        '<div class="buddy-skins">' + badgeCards + '</div>' +
        (decorCards ? '<h2 style="margin-top:25px;margin-bottom:10px;color:#333;">🏡 House Decorations</h2><div class="buddy-skins">' + decorCards + '</div>' : '') +
        '<button class="settings-btn" style="position:static;margin-top:20px;width:auto;padding:10px 20px;border-radius:20px;background:var(--primary);color:white;" onclick="document.getElementById(\'rewardsAlbumModal\').remove()">Done</button>' +
        '</div>';
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
}

// ---------- Fireworks ----------
function vfxBurst(x, y, emojis, count) {
    for (let i = 0; i < (count || 12); i++) {
        const sh = document.createElement('div');
        sh.className = 'vfx-shard';
        sh.textContent = emojis[i % emojis.length];
        sh.style.left = x + 'px';
        sh.style.top = y + 'px';
        sh.style.fontSize = (0.9 + Math.random() * 0.8).toFixed(2) + 'rem';
        const ang = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 140;
        sh.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
        sh.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
        sh.style.animationDelay = (Math.random() * 0.08) + 's';
        document.body.appendChild(sh);
        setTimeout(() => sh.remove(), 1050);
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
    if (document.querySelectorAll('.vfx-drop2, .vfx-rise').length >= 4) return;
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
}, 8000);

// ---------- Living sky: real-time sun/moon arc + rainbow stars + cityscape ----------
(function () {
    // skyline silhouette (paints behind everything, windows light up at night)
    const city = document.createElement('div');
    city.id = 'vfxCity';
    let bldgs = '', x = 0;
    while (x < 108) {
        const w = 4 + Math.random() * 7;
        const h = 5 + Math.random() * 15;
        bldgs += '<div class="vfx-bldg" style="left:' + x.toFixed(1) + 'vw;width:' + w.toFixed(1) + 'vw;height:' + h.toFixed(1) + 'vh;"></div>';
        x += w + 0.7;
    }
    city.innerHTML = bldgs;
    document.body.appendChild(city);

    // rainbow-glow stars (visible at night, glow-only - they never move)
    const starColors = ['#ff8fb3', '#ffd166', '#7be1a8', '#7cc7ff', '#c9a2ff', '#ffb38a'];
    for (let i = 0; i < 6; i++) {
        const st = document.createElement('div');
        st.className = 'vfx-twinkle';
        st.textContent = '✦';
        st.style.left = (Math.random() < 0.5 ? (3 + Math.random() * 24) : (72 + Math.random() * 24)) + '%';
        st.style.top = (2 + Math.random() * 11) + '%';
        st.style.animationDelay = (Math.random() * 7) + 's';
        st.style.color = starColors[i];
        st.style.textShadow = '0 0 7px ' + starColors[i] + ', 0 0 14px ' + starColors[i];
        document.body.appendChild(st);
    }

    // sun + moon travel a slow arc across the top, trading places at dawn and dusk
    const sun = document.createElement('div');
    sun.className = 'vfx-orb';
    sun.textContent = '☀️';
    const moon = document.createElement('div');
    moon.className = 'vfx-orb';
    moon.textContent = '🌙';
    document.body.appendChild(sun);
    document.body.appendChild(moon);
    function clamp01(n) { return Math.max(0, Math.min(1, n)); }
    function placeOrb(el, t) {
        t = clamp01(t);
        const arc = Math.sin(t * Math.PI);
        el.style.transform = 'translate(' + (5 + t * 88) + 'vw, ' + (11 - arc * 8.5) + 'vh)';
    }
    function skyUpdate() {
        const now = new Date();
        const mins = now.getHours() * 60 + now.getMinutes();
        const dayT = (mins - 360) / 840;   // sun: 6:00 -> 20:00
        const nightT = mins >= 1200 ? (mins - 1200) / 600 : (mins + 240) / 600; // moon: 20:00 -> 6:00
        placeOrb(sun, dayT);
        placeOrb(moon, nightT);
        const dayA = clamp01(Math.min((mins - 330) / 60, (1230 - mins) / 60)); // hour-long dawn/dusk crossfades
        sun.style.opacity = dayA;
        moon.style.opacity = 1 - dayA;
        document.body.classList.toggle('vfx-night', dayA < 0.5);
    }
    skyUpdate();
    setInterval(skyUpdate, 60000);
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
            bumpQuest('msgs', 1);
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
            bumpQuest('draws', 1);
            if (typeof journalAdd === 'function' && prompt) journalAdd('🎨', 'Buddy drew: "' + prompt + '"');
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
            bumpQuest('games', 1);
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
            bumpQuest('words', 1);
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
    // "New!" wiggle on the games button - a brief nudge, not a forever-shake.
    // Runs for ~7s after load (about 3 wiggles) then stops on its own, even if the player never taps it.
    const gb = document.getElementById('gamesBtn');
    if (gb && !vfx.ach.firstGame) {
        gb.classList.add('vfx-wiggle');
        setTimeout(() => gb.classList.remove('vfx-wiggle'), 7000);
    }

    vfxLevelUI();
    // Retroactively unlock any level-gated house decorations for returning friends who
    // were already past the threshold before Buddy's House feature existed.
    if (typeof checkLevelDecor === 'function') checkLevelDecor(vfxLevel());
    vfxQuestUI();
    vfxJournalUI();
})();
