// ============================================================
// 🎮 THE BUDDY ARCADE v2 — 24 interactive games with effects
// Loads after index.html's main script; uses its global helpers
// (speak, popSound, escapeHtml, getAgeGroup, burstConfetti-style CSS)
// ============================================================

// ---------- Arcade styles ----------
(function () {
    const s = document.createElement('style');
    s.textContent = `
.game-menu-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(105px, 1fr)); gap:8px; margin-top:10px; max-width:470px; }
.game-card { display:flex; flex-direction:column; align-items:center; gap:4px; background:white; border:2px solid var(--primary); border-radius:14px; padding:10px 6px; cursor:pointer; font-family:inherit; font-size:0.72rem; font-weight:bold; color:#333; transition:transform .15s; }
.game-card:hover { transform:scale(1.08); }
.gc-e { font-size:1.6rem; }
.fx-center { position:fixed; top:40%; left:50%; font-size:3rem; font-weight:bold; color:white; text-shadow:0 0 14px rgba(0,0,0,0.55), 2px 2px 0 var(--primary); z-index:5000; animation:fxPopIn .6s ease forwards; pointer-events:none; font-family:inherit; white-space:nowrap; }
@keyframes fxPopIn { 0%{transform:translate(-50%,-50%) scale(0.3);opacity:0;} 40%{transform:translate(-50%,-50%) scale(1.25);opacity:1;} 100%{transform:translate(-50%,-50%) scale(1);opacity:0.95;} }
.fx-fly { position:fixed; font-size:3.4rem; z-index:4500; transition:left .8s cubic-bezier(.2,.8,.3,1), transform .8s ease; pointer-events:none; }
.fx-snip { position:fixed; left:-70px; font-size:3rem; z-index:4500; pointer-events:none; transition:transform .08s; }
.fx-cutbit { position:fixed; font-size:1.2rem; z-index:4400; pointer-events:none; animation:cutFade .7s forwards; }
@keyframes cutFade { to { opacity:0; transform:translateY(18px); } }
.fx-float { position:fixed; top:-60px; font-size:3rem; z-index:4500; pointer-events:none; animation:floatDrop 2.4s ease-in forwards; }
@keyframes floatDrop { 0%{top:-60px;transform:rotate(-14deg);} 25%{transform:rotate(14deg);} 50%{transform:rotate(-14deg);} 75%{transform:rotate(10deg);} 100%{top:95vh;transform:rotate(-6deg);} }
.fx-drop { position:fixed; top:-40px; z-index:4400; font-size:1.5rem; pointer-events:none; animation:dropFall 1.9s linear forwards; }
@keyframes dropFall { to { top:102vh; transform:rotate(300deg); } }
.fx-shake { animation:bodyShake .45s; }
@keyframes bodyShake { 0%,100%{transform:translate(0)} 20%{transform:translate(-8px,4px)} 40%{transform:translate(8px,-4px)} 60%{transform:translate(-6px,-3px)} 80%{transform:translate(6px,3px)} }
.ttt-grid { display:grid; grid-template-columns:repeat(3,64px); gap:6px; margin-top:10px; }
.ttt-cell { width:64px; height:64px; font-size:1.8rem; background:white; border:2px solid var(--primary); border-radius:12px; cursor:pointer; }
.ttt-win { background:#ffe28a !important; animation:pulse 0.6s infinite; }
.mem-grid { display:grid; grid-template-columns:repeat(4,58px); gap:6px; margin-top:10px; }
.mem-card { width:58px; height:58px; font-size:1.5rem; background:linear-gradient(135deg,var(--primary),var(--secondary)); border:none; border-radius:10px; cursor:pointer; transition:transform .25s; }
.mem-open { background:white; border:2px solid var(--primary); }
.mem-done { background:#d7ffd9 !important; border:2px solid #4caf50 !important; transform:scale(1.05); }
.simon-row { display:flex; gap:10px; margin-top:10px; }
.simon-btn { font-size:2rem; background:white; border:3px solid var(--primary); border-radius:50%; width:64px; height:64px; cursor:pointer; opacity:0.5; transition:all .12s; }
.simon-lit { opacity:1; transform:scale(1.2); box-shadow:0 0 18px gold; }
.mole-grid { display:grid; grid-template-columns:repeat(3,64px); gap:6px; margin-top:10px; }
.mole-hole { width:64px; height:64px; font-size:1.9rem; background:#e8f3ff; border:2px dashed var(--secondary); border-radius:14px; cursor:pointer; }
.odd-grid { display:grid; grid-template-columns:repeat(4,52px); gap:5px; margin-top:10px; }
.odd-cell { width:52px; height:52px; font-size:1.4rem; background:white; border:2px solid var(--primary); border-radius:10px; cursor:pointer; }
.play-field { position:relative; height:250px; overflow:hidden; background:linear-gradient(180deg,#e0f7ff,#fff6e0); border-radius:14px; margin-top:10px; border:2px solid var(--primary); min-width:270px; }
.fall-item { position:absolute; top:-44px; font-size:1.9rem; background:none; border:none; cursor:pointer; transition:top 3.4s linear; padding:2px; z-index:2; }
.g-status { margin-top:10px; font-weight:bold; color:var(--secondary); }
.dice-row { font-size:3rem; margin:10px 0; display:flex; align-items:center; gap:14px; }
.big-card { display:inline-block; background:white; border:3px solid var(--primary); border-radius:14px; padding:14px 22px; font-size:2rem; font-weight:bold; margin:10px 0; box-shadow:0 4px 10px rgba(0,0,0,0.15); }
.tap-btn { font-size:1.3rem !important; padding:16px 30px !important; }
.light-circle { font-size:3.4rem; margin-top:10px; }
.quiz-btns button.q-right { background:#4caf50 !important; }
.quiz-btns button.q-wrong { background:#9e9e9e !important; opacity:0.6; }
`;
    document.head.appendChild(s);
})();

// ---------- Shared state & helpers ----------
let gameState = { type: null, awaitingInput: false, data: {} };
let gameTimers = [];
function rnd(n) { return Math.floor(Math.random() * n); }
function gTimeout(fn, ms) { const t = setTimeout(fn, ms); gameTimers.push(t); return t; }
function gInterval(fn, ms) { const t = setInterval(fn, ms); gameTimers.push(t); return t; }
function resetGame() {
    gameTimers.forEach(function (t) { clearTimeout(t); clearInterval(t); });
    gameTimers = [];
    gameState = { type: null, awaitingInput: false, data: {} };
}

function gameBubble(html) {
    const chatContainer = document.getElementById('chatContainer');
    const div = document.createElement('div');
    div.className = 'message ai-message game-bubble';
    div.innerHTML = '<span class="ai-avatar"></span><div class="game-body">' + html + '</div>';
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return div.querySelector('.game-body');
}

function endBtns(startFn) {
    return '<div class="game-btns"><button onclick="' + startFn + '()">🔁 Play again</button><button onclick="showGameMenu()">🎲 All games</button></div>';
}

function burstConfetti() {
    const emo = ['🎉', '✨', '🌟', '🎊', '⭐', '💛'];
    for (let i = 0; i < 14; i++) {
        const sp = document.createElement('div');
        sp.className = 'confetti';
        sp.textContent = emo[i % emo.length];
        sp.style.left = (20 + Math.random() * 60) + '%';
        sp.style.top = (30 + Math.random() * 30) + '%';
        sp.style.setProperty('--dx', (Math.random() * 240 - 120) + 'px');
        sp.style.setProperty('--dy', (-80 - Math.random() * 160) + 'px');
        sp.style.animationDelay = (Math.random() * 0.2) + 's';
        document.body.appendChild(sp);
        gTimeout(function () { sp.remove(); }, 1900);
    }
    chime([500, 700, 900]);
}

function chime(freqs, gap) {
    freqs.forEach(function (f, i) { gTimeout(function () { popSound(f); }, i * (gap || 110)); });
}

// ---------- FX toolkit ----------
function fxLayer() {
    let l = document.getElementById('fxLayer');
    if (!l) {
        l = document.createElement('div');
        l.id = 'fxLayer';
        l.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:4000;overflow:hidden;';
        document.body.appendChild(l);
    }
    return l;
}

function fxCenter(text, dur) {
    const el = document.createElement('div');
    el.className = 'fx-center';
    el.textContent = text;
    fxLayer().appendChild(el);
    gTimeout(function () { el.remove(); }, dur || 750);
}

function fxCountdown(words, beat) {
    return new Promise(function (res) {
        words.forEach(function (w, i) {
            gTimeout(function () {
                fxCenter(w, beat + 120);
                popSound(i === words.length - 1 ? 900 : 480 + i * 60);
            }, i * beat);
        });
        gTimeout(res, words.length * beat + 160);
    });
}

function fxFly(emoji, from) {
    return new Promise(function (res) {
        const el = document.createElement('div');
        el.className = 'fx-fly';
        el.textContent = emoji;
        el.style.top = (window.innerHeight * (0.32 + Math.random() * 0.2)) + 'px';
        el.style.left = from === 'left' ? '-80px' : (window.innerWidth + 80) + 'px';
        fxLayer().appendChild(el);
        requestAnimationFrame(function () {
            el.style.left = (window.innerWidth / 2 + (from === 'left' ? -95 : 25)) + 'px';
            el.style.transform = 'rotate(' + (from === 'left' ? 720 : -720) + 'deg)';
        });
        gTimeout(function () { el.remove(); res(); }, 950);
    });
}

function fxFloatDown(emoji) {
    const el = document.createElement('div');
    el.className = 'fx-float';
    el.textContent = emoji;
    el.style.left = (window.innerWidth * (0.25 + Math.random() * 0.5)) + 'px';
    fxLayer().appendChild(el);
    gTimeout(function () { el.remove(); }, 2600);
}

function fxSnip() {
    const el = document.createElement('div');
    el.className = 'fx-snip';
    el.textContent = '✂️';
    el.style.top = (window.innerHeight * 0.45) + 'px';
    fxLayer().appendChild(el);
    let x = -60, open = false;
    const iv = gInterval(function () {
        x += 36;
        open = !open;
        el.style.left = x + 'px';
        el.style.transform = 'rotate(' + (open ? -25 : 15) + 'deg)';
        if (open) popSound(680);
        if (Math.random() < 0.45) {
            const c = document.createElement('div');
            c.className = 'fx-cutbit';
            c.textContent = '✁';
            c.style.left = x + 'px';
            c.style.top = el.style.top;
            fxLayer().appendChild(c);
            gTimeout(function () { c.remove(); }, 700);
        }
        if (x > window.innerWidth + 60) { clearInterval(iv); el.remove(); }
    }, 85);
}

function fxShake() {
    document.body.classList.remove('fx-shake');
    void document.body.offsetWidth;
    document.body.classList.add('fx-shake');
    gTimeout(function () { document.body.classList.remove('fx-shake'); }, 500);
}

function fxRain(emojis, n) {
    for (let i = 0; i < (n || 12); i++) {
        const el = document.createElement('div');
        el.className = 'fx-drop';
        el.textContent = emojis[i % emojis.length];
        el.style.left = (Math.random() * 92 + 2) + '%';
        el.style.animationDelay = (Math.random() * 0.5) + 's';
        fxLayer().appendChild(el);
        gTimeout(function () { el.remove(); }, 2700);
    }
}

// ---------- Game menu ----------
const ARCADE = [
    { n: 'Rock Paper Scissors', e: '✊', f: 'startRPS' },
    { n: 'Tic-Tac-Toe', e: '⭕', f: 'startTTT' },
    { n: 'Memory Match', e: '🃏', f: 'startMemory' },
    { n: 'Copy My Pattern', e: '🚦', f: 'startSimon' },
    { n: 'Whack-a-Mole', e: '🐹', f: 'startMole' },
    { n: 'Fruit Catch', e: '🍎', f: 'startCatch' },
    { n: 'Coin Flip Battle', e: '🪙', f: 'startCoin' },
    { n: 'Dice Race', e: '🎲', f: 'startDice' },
    { n: 'Odd One Out', e: '🕵️', f: 'startOdd' },
    { n: 'Treasure Hunt', e: '💎', f: 'startTreasure' },
    { n: 'Animal Sounds', e: '🐮', f: 'startSounds' },
    { n: 'Rhyme Time', e: '🎵', f: 'startRhyme' },
    { n: 'Math Rocket', e: '🚀', f: 'startMath' },
    { n: 'Spelling Bee', e: '🐝', f: 'startSpell' },
    { n: 'Color Mixer', e: '🎨', f: 'startMix' },
    { n: 'Emoji Riddles', e: '🧩', f: 'startRiddle' },
    { n: 'Fast Tap', e: '👆', f: 'startTap' },
    { n: 'Red Light Green Light', e: '🚥', f: 'startLight' },
    { n: 'Rocket Reflex', e: '🛸', f: 'startReact' },
    { n: 'Higher or Lower', e: '🎴', f: 'startCards' },
    { n: 'Guess My Color', e: '🌈', f: 'startColorGame' },
    { n: 'Guess My Number', e: '🔢', f: 'startNumberGame' },
    { n: 'Silly Story', e: '📖', f: 'startMadLibs' },
    { n: 'Story Builder', e: '✍️', f: 'startStory' }
];

function showGameMenu() {
    resetGame();
    gameBubble('<b>🎮 The Buddy Arcade — 24 games! Pick one:</b><div class="game-menu-grid">' +
        ARCADE.map(function (g) {
            return '<button class="game-card" onclick="' + g.f + '()"><span class="gc-e">' + g.e + '</span><span>' + g.n + '</span></button>';
        }).join('') + '</div>');
    speak('Welcome to the arcade! Pick a game!', 'excited');
}

// ---------- 1. Rock Paper Scissors (cinematic) ----------
const RPS_EMO = ['🪨', '📄', '✂️'], RPS_NAMES = ['Rock', 'Paper', 'Scissors'];
function startRPS() {
    resetGame();
    gameState.type = 'rps';
    gameState.data = { you: 0, buddy: 0, busy: false };
    rpsRound('First to 3 wins! Pick your throw:');
    speak('Rock paper scissors! First to three! Pick your throw!', 'excited');
}
function rpsRound(msg) {
    const d = gameState.data;
    const body = gameBubble('<b>✊ Rock, Paper, Scissors</b><br>' + msg + '<div class="game-btns"></div><div class="rps-score">You ' + d.you + ' - ' + d.buddy + ' ' + escapeHtml(buddyName) + '</div>');
    const btns = body.querySelector('.game-btns');
    ['✊ Rock', '✋ Paper', '✌️ Scissors'].forEach(function (l, v) {
        const b = document.createElement('button');
        b.textContent = l;
        b.onclick = function () { playRPS(v); };
        btns.appendChild(b);
    });
}
async function playRPS(you) {
    const d = gameState.data;
    if (gameState.type !== 'rps' || d.busy) return;
    d.busy = true;
    await fxCountdown(['Rock...', 'Paper...', 'Scissors...', 'SHOOT! 💥'], 520);
    const b = rnd(3);
    fxFly(RPS_EMO[you], 'left');
    await fxFly(RPS_EMO[b], 'right');
    let line;
    if (you === b) { fxCenter('🤝 TIE!'); line = 'Tie! Go again!'; }
    else if ((you - b + 3) % 3 === 1) { d.you++; line = 'Your ' + RPS_NAMES[you] + ' beats my ' + RPS_NAMES[b] + '! 🎉'; rpsWinFX(you); }
    else { d.buddy++; line = 'My ' + RPS_NAMES[b] + ' beats your ' + RPS_NAMES[you] + '! 😄'; rpsWinFX(b); }
    d.busy = false;
    if (d.you >= 3 || d.buddy >= 3) {
        const won = d.you >= 3;
        gameBubble('<b>' + line + '</b><br><b>' + (won ? '🏆 YOU WIN THE WHOLE GAME ' : '🏆 ' + escapeHtml(buddyName) + ' wins ') + d.you + '-' + d.buddy + '!</b>' + endBtns('startRPS'));
        if (won) burstConfetti(); else chime([400, 300, 250]);
        speak(won ? 'You win the whole game! Champion!' : 'I win this time! Rematch?', won ? 'excited' : 'playful');
        gameState.type = null;
    } else {
        rpsRound(line + ' Pick again:');
        speak(line.replace(/[^\w !?']/g, ' '), 'playful');
    }
}
function rpsWinFX(winnerThrow) {
    if (winnerThrow === 0) { fxShake(); fxCenter('💥 SMASH!'); chime([180, 140]); }
    else if (winnerThrow === 1) { fxFloatDown('📄'); fxFloatDown('📄'); fxCenter('📄 WRAPPED!'); chime([520, 480]); }
    else { fxSnip(); fxCenter('✂️ SNIP SNIP!'); }
}

// ---------- 2. Tic-Tac-Toe ----------
const TTT_WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function tttCheck(cells, sym) { return TTT_WINS.find(function (w) { return w.every(function (i) { return cells[i] === sym; }); }); }
function startTTT() {
    resetGame();
    gameState.type = 'ttt';
    const d = gameState.data = { cells: Array(9).fill(null), over: false };
    const body = gameBubble('<b>⭕ Tic-Tac-Toe!</b> You are ❌ — get 3 in a row!<div class="ttt-grid"></div><div class="g-status"></div>');
    d.grid = body.querySelector('.ttt-grid');
    d.status = body.querySelector('.g-status');
    for (let i = 0; i < 9; i++) {
        (function (i) {
            const c = document.createElement('button');
            c.className = 'ttt-cell';
            c.onclick = function () { tttPlay(i, c); };
            d.grid.appendChild(c);
        })(i);
    }
    speak('Tic tac toe! You are X. Your move!', 'playful');
}
function tttPlay(i, btn) {
    const d = gameState.data;
    if (gameState.type !== 'ttt' || d.over || d.cells[i]) return;
    d.cells[i] = 'X'; btn.textContent = '❌'; popSound(600);
    let w = tttCheck(d.cells, 'X');
    if (w) return tttEnd('win', w);
    if (d.cells.every(function (c) { return c; })) return tttEnd('draw');
    const empt = d.cells.map(function (c, j) { return c ? -1 : j; }).filter(function (j) { return j >= 0; });
    let move = empt.find(function (j) { d.cells[j] = 'O'; const ok = tttCheck(d.cells, 'O'); d.cells[j] = null; return ok; });
    if (move === undefined) move = empt.find(function (j) { d.cells[j] = 'X'; const ok = tttCheck(d.cells, 'X'); d.cells[j] = null; return ok; });
    if (move === undefined) move = [4, 0, 2, 6, 8].find(function (j) { return empt.indexOf(j) >= 0; });
    if (move === undefined) move = empt[rnd(empt.length)];
    d.cells[move] = 'O';
    gTimeout(function () {
        d.grid.children[move].textContent = '⭕'; popSound(420);
        w = tttCheck(d.cells, 'O');
        if (w) return tttEnd('lose', w);
        if (d.cells.every(function (c) { return c; })) return tttEnd('draw');
    }, 350);
}
function tttEnd(r, w) {
    const d = gameState.data;
    d.over = true;
    if (w) w.forEach(function (i) { d.grid.children[i].classList.add('ttt-win'); });
    const msg = r === 'win' ? '🏆 YOU WIN! Three in a row!' : r === 'lose' ? escapeHtml(buddyName) + ' got three in a row! Rematch?' : '🤝 A tie! Great minds!';
    d.status.innerHTML = '<b>' + msg + '</b>' + endBtns('startTTT');
    if (r === 'win') burstConfetti(); else chime([400, 300]);
    speak(msg.replace(/[^\w !?']/g, ' '), r === 'win' ? 'excited' : 'playful');
}

// ---------- 3. Memory Match ----------
function startMemory() {
    resetGame();
    gameState.type = 'memory';
    const set = ['🐶', '🦄', '🍕', '🚀', '🌈', '⚽'];
    const deck = set.concat(set).sort(function () { return Math.random() - 0.5; });
    const d = gameState.data = { deck: deck, open: [], done: 0, moves: 0, lock: false };
    const body = gameBubble('<b>🃏 Memory Match!</b> Find all 6 pairs!<div class="mem-grid"></div><div class="g-status">Moves: 0</div>');
    d.status = body.querySelector('.g-status');
    const grid = body.querySelector('.mem-grid');
    deck.forEach(function (e, i) {
        const c = document.createElement('button');
        c.className = 'mem-card';
        c.textContent = '❓';
        c.onclick = function () { memFlip(i, c); };
        grid.appendChild(c);
    });
    speak('Memory match! Find the pairs!', 'playful');
}
function memFlip(i, c) {
    const d = gameState.data;
    if (gameState.type !== 'memory' || d.lock || c.classList.contains('mem-done') || d.open.some(function (o) { return o.i === i; })) return;
    c.textContent = d.deck[i]; c.classList.add('mem-open'); popSound(550);
    d.open.push({ i: i, c: c });
    if (d.open.length === 2) {
        d.moves++; d.status.textContent = 'Moves: ' + d.moves;
        const a = d.open[0], b = d.open[1];
        if (d.deck[a.i] === d.deck[b.i]) {
            a.c.classList.add('mem-done'); b.c.classList.add('mem-done');
            d.open = []; d.done++;
            chime([600, 800]);
            if (d.done === 6) {
                d.status.innerHTML = '<b>🏆 ALL PAIRS in ' + d.moves + ' moves!</b>' + endBtns('startMemory');
                burstConfetti();
                speak('You found all the pairs! Amazing memory!', 'excited');
                gameState.type = null;
            }
        } else {
            d.lock = true;
            gTimeout(function () {
                a.c.textContent = '❓'; b.c.textContent = '❓';
                a.c.classList.remove('mem-open'); b.c.classList.remove('mem-open');
                d.open = []; d.lock = false;
            }, 750);
        }
    }
}

// ---------- 4. Copy My Pattern (Simon) ----------
const SIMON_COLORS = [{ e: '🔴', f: 400 }, { e: '🟡', f: 520 }, { e: '🟢', f: 640 }, { e: '🔵', f: 780 }];
function startSimon() {
    resetGame();
    gameState.type = 'simon';
    const d = gameState.data = { seq: [], pos: 0, playing: true, btns: [] };
    const body = gameBubble('<b>🚦 Copy My Pattern!</b> Watch the lights flash, then repeat them in order! Survive 8 rounds!<div class="simon-row"></div><div class="g-status"></div>');
    d.status = body.querySelector('.g-status');
    const row = body.querySelector('.simon-row');
    SIMON_COLORS.forEach(function (c, i) {
        const b = document.createElement('button');
        b.className = 'simon-btn';
        b.textContent = c.e;
        b.onclick = function () { simonPress(i); };
        row.appendChild(b);
        d.btns.push(b);
    });
    gTimeout(simonNext, 900);
    speak('Copy my pattern! Watch closely!', 'playful');
}
function simonFlash(i, ms) {
    const d = gameState.data;
    d.btns[i].classList.add('simon-lit');
    popSound(SIMON_COLORS[i].f);
    gTimeout(function () { d.btns[i].classList.remove('simon-lit'); }, ms || 320);
}
function simonNext() {
    const d = gameState.data;
    if (gameState.type !== 'simon') return;
    d.seq.push(rnd(4)); d.pos = 0; d.playing = true;
    d.status.textContent = 'Watch... (round ' + d.seq.length + ' of 8)';
    d.seq.forEach(function (s, i) { gTimeout(function () { simonFlash(s); }, 600 * i + 400); });
    gTimeout(function () { d.playing = false; d.status.textContent = 'Your turn! Repeat it!'; }, 600 * d.seq.length + 500);
}
function simonPress(i) {
    const d = gameState.data;
    if (gameState.type !== 'simon' || d.playing) return;
    simonFlash(i, 200);
    if (i === d.seq[d.pos]) {
        d.pos++;
        if (d.pos === d.seq.length) {
            if (d.seq.length >= 8) {
                d.status.innerHTML = '<b>🏆 8 ROUNDS! Perfect memory!</b>' + endBtns('startSimon');
                burstConfetti();
                speak('Eight rounds! Incredible memory!', 'excited');
                gameState.type = null;
            } else {
                d.playing = true;
                d.status.textContent = 'YES! Get ready...';
                chime([600, 800]);
                gTimeout(simonNext, 900);
            }
        }
    } else {
        d.status.innerHTML = '<b>Oops! You made it to round ' + d.seq.length + '!</b>' + endBtns('startSimon');
        chime([300, 200]);
        speak('Oops! Good try! Round ' + d.seq.length + '!', 'caring');
        gameState.type = null;
    }
}

// ---------- 5. Whack-a-Mole ----------
function startMole() {
    resetGame();
    gameState.type = 'mole';
    const d = gameState.data = { score: 0, time: 20, holes: [] };
    const body = gameBubble('<b>🐹 Whack-a-Mole!</b> Bonk every mole that pops up! 20 seconds!<div class="mole-grid"></div><div class="g-status">Score: 0 | ⏰ 20s</div>');
    d.status = body.querySelector('.g-status');
    const grid = body.querySelector('.mole-grid');
    function upd() { d.status.textContent = 'Score: ' + d.score + ' | ⏰ ' + d.time + 's'; }
    for (let i = 0; i < 9; i++) {
        const h = document.createElement('button');
        h.className = 'mole-hole';
        h.textContent = '🕳️';
        h.onclick = function () {
            if (gameState.type !== 'mole') return;
            if (h.dataset.mole === '1') {
                d.score++; h.dataset.mole = '0'; h.textContent = '💥'; popSound(800);
                gTimeout(function () { h.textContent = '🕳️'; }, 250);
                upd();
            }
        };
        grid.appendChild(h);
        d.holes.push(h);
    }
    gInterval(function () {
        const h = d.holes[rnd(9)];
        if (h.dataset.mole === '1') return;
        h.dataset.mole = '1'; h.textContent = '🐹'; popSound(440);
        gTimeout(function () { if (h.dataset.mole === '1') { h.dataset.mole = '0'; h.textContent = '🕳️'; } }, 700);
    }, 750);
    gInterval(function () {
        d.time--; upd();
        if (d.time <= 0) {
            const score = d.score;
            resetGame();
            d.status.innerHTML = '<b>⏰ Time! You bonked ' + score + ' moles!' + (score >= 12 ? ' 🏆 MOLE CHAMPION!' : score >= 7 ? ' Great bonking!' : ' Good try!') + '</b>' + endBtns('startMole');
            if (score >= 12) burstConfetti();
            speak('Time! You bonked ' + score + ' moles!', 'excited');
        }
    }, 1000);
    speak('Whack a mole! Bonk them all!', 'excited');
}

// ---------- 6. Fruit Catch ----------
function startCatch() {
    resetGame();
    gameState.type = 'catch';
    const d = gameState.data = { score: 0, time: 20 };
    const body = gameBubble('<b>🍎 Fruit Catch!</b> Tap ONLY the apples — not the junk! 20 seconds!<div class="play-field"></div><div class="g-status">Score: 0 | ⏰ 20s</div>');
    d.status = body.querySelector('.g-status');
    const field = body.querySelector('.play-field');
    const junk = ['🧦', '🪨', '📎', '🥾'];
    function upd() { d.status.textContent = 'Score: ' + d.score + ' | ⏰ ' + d.time + 's'; }
    gInterval(function () {
        const isApple = Math.random() < 0.55;
        const e = document.createElement('button');
        e.className = 'fall-item';
        e.textContent = isApple ? '🍎' : junk[rnd(junk.length)];
        e.style.left = (5 + Math.random() * 82) + '%';
        e.onclick = function () {
            if (gameState.type !== 'catch') return;
            if (isApple) { d.score++; popSound(750); e.textContent = '✨'; }
            else { d.score = Math.max(0, d.score - 1); popSound(220); e.textContent = '❌'; }
            upd();
            gTimeout(function () { e.remove(); }, 200);
        };
        field.appendChild(e);
        requestAnimationFrame(function () { e.style.top = '105%'; });
        gTimeout(function () { e.remove(); }, 3700);
    }, 620);
    gInterval(function () {
        d.time--; upd();
        if (d.time <= 0) {
            const score = d.score;
            resetGame();
            d.status.innerHTML = '<b>⏰ You caught ' + score + ' apples!' + (score >= 10 ? ' 🏆 FRUIT MASTER!' : ' Tasty!') + '</b>' + endBtns('startCatch');
            if (score >= 10) burstConfetti();
            speak('You caught ' + score + ' apples!', 'excited');
        }
    }, 1000);
    speak('Fruit catch! Tap only the apples!', 'excited');
}

// ---------- 7. Coin Flip Battle ----------
function startCoin() {
    resetGame();
    gameState.type = 'coin';
    gameState.data = { you: 0, buddy: 0, round: 1, busy: false };
    coinRound();
    speak('Coin flip battle! Heads or tails? Best of five!', 'excited');
}
function coinRound() {
    const d = gameState.data;
    const body = gameBubble('<b>🪙 Coin Flip Battle — round ' + d.round + ' of 5</b><br>Call it in the air!<div class="game-btns"></div><div class="rps-score">You ' + d.you + ' - ' + d.buddy + ' ' + escapeHtml(buddyName) + '</div>');
    const btns = body.querySelector('.game-btns');
    [['🙂 Heads', 'H'], ['⭐ Tails', 'T']].forEach(function (p) {
        const b = document.createElement('button');
        b.textContent = p[0];
        b.onclick = function () { coinFlip(p[1]); };
        btns.appendChild(b);
    });
}
async function coinFlip(call) {
    const d = gameState.data;
    if (gameState.type !== 'coin' || d.busy) return;
    d.busy = true;
    await fxCountdown(['3...', '2...', '1...', 'FLIP! 🪙'], 460);
    await fxFly('🪙', Math.random() < 0.5 ? 'left' : 'right');
    const res = Math.random() < 0.5 ? 'H' : 'T';
    fxCenter(res === 'H' ? '🙂 HEADS!' : '⭐ TAILS!', 900);
    const hit = res === call;
    chime(hit ? [600, 850] : [350, 250]);
    if (hit) d.you++; else d.buddy++;
    d.busy = false;
    if (d.round >= 5 || d.you >= 3 || d.buddy >= 3) {
        const won = d.you > d.buddy;
        gameBubble('<b>' + (won ? '🏆 YOU WIN the coin battle ' : '🏆 ' + escapeHtml(buddyName) + ' wins the coin battle ') + d.you + '-' + d.buddy + '!</b>' + endBtns('startCoin'));
        if (won) burstConfetti();
        speak(won ? 'You win the coin battle!' : 'I win this time! Flip again?', won ? 'excited' : 'playful');
        gameState.type = null;
    } else {
        d.round++;
        coinRound();
    }
}

// ---------- 8. Dice Race ----------
const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
function raceBar(v) {
    const n = Math.max(0, Math.min(10, Math.round(v / 2)));
    let out = '';
    for (let i = 0; i < 10; i++) out += i < n ? '🟩' : '⬜';
    return out;
}
function startDice() {
    resetGame();
    gameState.type = 'dice';
    gameState.data = { you: 0, buddy: 0, busy: false };
    diceRound('Race to 20! Hit ROLL!');
    speak('Dice race! First to twenty wins!', 'excited');
}
function diceRound(msg) {
    const d = gameState.data;
    const body = gameBubble('<b>🎲 Dice Race to 20!</b><br>' + msg +
        '<div class="dice-row"><span class="die-you">🎲</span> vs <span class="die-bud">🎲</span></div>' +
        'You: ' + raceBar(d.you) + ' ' + d.you + '<br>' + escapeHtml(buddyName) + ': ' + raceBar(d.buddy) + ' ' + d.buddy +
        '<div class="game-btns"></div>');
    const b = document.createElement('button');
    b.textContent = '🎲 ROLL!';
    b.onclick = function () { diceRoll(body, b); };
    body.querySelector('.game-btns').appendChild(b);
}
function diceRoll(body, btn) {
    const d = gameState.data;
    if (gameState.type !== 'dice' || d.busy) return;
    d.busy = true; btn.disabled = true;
    const yEl = body.querySelector('.die-you'), bEl = body.querySelector('.die-bud');
    let n = 0;
    const shuffle = gInterval(function () {
        yEl.textContent = DICE_FACES[rnd(6)];
        bEl.textContent = DICE_FACES[rnd(6)];
        if (n % 2 === 0) popSound(480 + n * 25);
        n++;
    }, 90);
    gTimeout(function () {
        clearInterval(shuffle);
        const y = 1 + rnd(6), bu = 1 + rnd(6);
        yEl.textContent = DICE_FACES[y - 1];
        bEl.textContent = DICE_FACES[bu - 1];
        d.you += y; d.buddy += bu; d.busy = false;
        chime([500, 650]);
        if (d.you >= 20 || d.buddy >= 20) {
            const won = d.you >= d.buddy;
            gameBubble('<b>' + (won ? '🏆 YOU WIN the race ' : '🏆 ' + escapeHtml(buddyName) + ' wins the race ') + d.you + ' to ' + d.buddy + '!</b>' + endBtns('startDice'));
            if (won) burstConfetti(); else chime([350, 250]);
            speak(won ? 'You win the dice race!' : 'I win the race! Again?', 'excited');
            gameState.type = null;
        } else {
            diceRound('You rolled ' + y + ', I rolled ' + bu + '! Roll again!');
        }
    }, 900);
}

// ---------- 9. Odd One Out ----------
const ODD_SETS = [['🐶','🐱'],['😀','😎'],['🍎','🍅'],['⭐','🌟'],['🐸','🦎'],['🧁','🍰'],['🌸','🌺'],['⚽','🏀']];
function startOdd() {
    resetGame();
    gameState.type = 'odd';
    gameState.data = { round: 1 };
    oddRound();
    speak('Odd one out! One is different. Find it!', 'playful');
}
function oddRound() {
    const d = gameState.data;
    const pair = ODD_SETS[rnd(ODD_SETS.length)];
    const a = pair[0], b = pair[1];
    const n = 16, odd = rnd(n);
    const body = gameBubble('<b>🕵️ Odd One Out — round ' + d.round + ' of 5</b><br>One of these is different... tap it!<div class="odd-grid"></div>');
    const grid = body.querySelector('.odd-grid');
    for (let i = 0; i < n; i++) {
        (function (i) {
            const c = document.createElement('button');
            c.className = 'odd-cell';
            c.textContent = i === odd ? b : a;
            c.onclick = function () {
                if (gameState.type !== 'odd') return;
                if (i === odd) {
                    c.classList.add('mem-done');
                    chime([650, 880]);
                    if (d.round >= 5) {
                        gameBubble('<b>🏆 Eagle eyes! You found all 5!</b>' + endBtns('startOdd'));
                        burstConfetti();
                        speak('Eagle eyes! You found them all!', 'excited');
                        gameState.type = null;
                    } else { d.round++; oddRound(); }
                } else {
                    c.textContent = '❌'; popSound(240);
                    gTimeout(function () { c.textContent = a; }, 400);
                }
            };
            grid.appendChild(c);
        })(i);
    }
}

// ---------- 10. Treasure Hunt ----------
function startTreasure() {
    resetGame();
    gameState.type = 'treasure';
    const N = 4;
    const d = gameState.data = { gx: rnd(N), gy: rnd(N), digs: 0 };
    const body = gameBubble('<b>💎 Treasure Hunt!</b> My gem is buried under one square. Dig, and I\'ll say hot or cold!<div class="odd-grid"></div><div class="g-status"></div>');
    d.status = body.querySelector('.g-status');
    const grid = body.querySelector('.odd-grid');
    for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
            (function (x, y) {
                const c = document.createElement('button');
                c.className = 'odd-cell';
                c.textContent = '❓';
                c.onclick = function () {
                    if (gameState.type !== 'treasure' || c.dataset.dug) return;
                    c.dataset.dug = '1'; d.digs++;
                    const dist = Math.abs(x - d.gx) + Math.abs(y - d.gy);
                    if (dist === 0) {
                        c.textContent = '💎'; c.classList.add('mem-done');
                        d.status.innerHTML = '<b>💎 TREASURE! Found in ' + d.digs + ' digs!</b>' + endBtns('startTreasure');
                        burstConfetti(); chime([500, 700, 900, 1100]);
                        speak('Treasure! You found my gem in ' + d.digs + ' digs!', 'excited');
                        gameState.type = null;
                    } else {
                        c.textContent = dist === 1 ? '🔥' : dist === 2 ? '♨️' : '❄️';
                        popSound(dist === 1 ? 700 : dist === 2 ? 500 : 320);
                        d.status.textContent = dist === 1 ? '🔥 SO HOT! Right next to it!' : dist === 2 ? '♨️ Warm... getting closer!' : '❄️ Brrr, ice cold!';
                    }
                };
                grid.appendChild(c);
            })(x, y);
        }
    }
    speak('Treasure hunt! Find my hidden gem!', 'playful');
}

// ---------- Generic quiz runner (powers 5 games) ----------
function runQuiz(cfg) {
    resetGame();
    gameState.type = cfg.type;
    gameState.data = { round: 1, score: 0 };
    quizRound(cfg);
}
function quizRound(cfg) {
    const d = gameState.data;
    const q = cfg.makeRound();
    const body = gameBubble('<b>' + cfg.title + ' — ' + d.round + ' of ' + cfg.rounds + '</b><br>' + q.prompt + '<div class="game-btns quiz-btns"></div>');
    if (q.say) speak(q.say, 'playful');
    const btns = body.querySelector('.quiz-btns');
    q.options.forEach(function (o) {
        const b = document.createElement('button');
        b.innerHTML = o.label;
        b.onclick = function () {
            if (gameState.type !== cfg.type || b.disabled) return;
            if (o.correct) {
                d.score++;
                b.classList.add('q-right');
                chime([650, 880]);
                if (q.fx) q.fx();
                Array.prototype.forEach.call(btns.children, function (x) { x.disabled = true; });
                if (d.round >= cfg.rounds) {
                    const msg = cfg.endMsg(d.score);
                    gameBubble('<b>🏆 ' + msg + '</b>' + endBtns(cfg.startFn));
                    burstConfetti();
                    speak(msg, 'excited');
                    gameState.type = null;
                } else {
                    d.round++;
                    gTimeout(function () { quizRound(cfg); }, 650);
                }
            } else {
                b.classList.add('q-wrong');
                b.disabled = true;
                popSound(240);
            }
        };
        btns.appendChild(b);
    });
}
function bigEmoji(e) { return '<span style="font-size:1.7rem">' + e + '</span>'; }

// ---------- 11. Animal Sounds ----------
const SOUND_QS = [
    { s: 'Moo!', a: '🐮', o: ['🐮', '🐷', '🦆', '🐱'] },
    { s: 'Woof woof!', a: '🐶', o: ['🐱', '🐶', '🐭', '🐸'] },
    { s: 'Meow!', a: '🐱', o: ['🐶', '🐰', '🐱', '🐮'] },
    { s: 'Quack quack!', a: '🦆', o: ['🐔', '🦆', '🦉', '🐧'] },
    { s: 'Oink oink!', a: '🐷', o: ['🐷', '🐮', '🐴', '🐑'] },
    { s: 'Roarrr!', a: '🦁', o: ['🐯', '🐻', '🦁', '🐨'] },
    { s: 'Hoo hoo!', a: '🦉', o: ['🦅', '🦉', '🐦', '🦜'] },
    { s: 'Ribbit ribbit!', a: '🐸', o: ['🐍', '🐢', '🦎', '🐸'] }
];
function startSounds() {
    runQuiz({
        type: 'sounds', title: '🐮 Animal Sounds', rounds: 6, startFn: 'startSounds',
        makeRound: function () {
            const q = SOUND_QS[rnd(SOUND_QS.length)];
            return {
                prompt: 'Who says <b>"' + q.s + '"</b>?',
                say: q.s + ' ... Who says ' + q.s,
                options: q.o.map(function (e) { return { label: bigEmoji(e), correct: e === q.a }; }),
                fx: function () { fxRain([q.a], 8); }
            };
        },
        endMsg: function (s) { return 'Animal expert! ' + s + ' out of 6!'; }
    });
}

// ---------- 12. Rhyme Time ----------
const RHYMES = [
    { w: 'cat', o: ['dog', 'hat', 'sun', 'cup'], r: 'hat' },
    { w: 'star', o: ['car', 'moon', 'tree', 'fish'], r: 'car' },
    { w: 'bee', o: ['rock', 'tree', 'cow', 'box'], r: 'tree' },
    { w: 'cake', o: ['snake', 'milk', 'shoe', 'fork'], r: 'snake' },
    { w: 'goat', o: ['train', 'boat', 'plane', 'bike'], r: 'boat' },
    { w: 'frog', o: ['log', 'pond', 'fly', 'hat'], r: 'log' }
];
function startRhyme() {
    runQuiz({
        type: 'rhyme', title: '🎵 Rhyme Time', rounds: 6, startFn: 'startRhyme',
        makeRound: function () {
            const q = RHYMES[rnd(RHYMES.length)];
            return {
                prompt: 'What rhymes with <b>' + q.w.toUpperCase() + '</b>?',
                say: 'What rhymes with ' + q.w + '?',
                options: q.o.map(function (w) { return { label: w, correct: w === q.r }; }),
                fx: function () { fxCenter('🎵 ' + q.w + ' + ' + q.r + '!'); }
            };
        },
        endMsg: function (s) { return 'Rhyme master! ' + s + ' out of 6!'; }
    });
}

// ---------- 13. Math Rocket ----------
function startMath() {
    runQuiz({
        type: 'math', title: '🚀 Math Rocket', rounds: 8, startFn: 'startMath',
        makeRound: function () {
            const g = getAgeGroup(currentAge);
            let prompt, ans;
            if (g === '3') {
                const n = 1 + rnd(5);
                prompt = 'How many apples?<br>' + bigEmoji('🍎'.repeat(n));
                ans = n;
            } else if (g === '6') {
                const a = 1 + rnd(6), b = 1 + rnd(4);
                prompt = '<b>' + a + ' + ' + b + ' = ?</b>';
                ans = a + b;
            } else if (g === '12') {
                const a = 5 + rnd(20), b = 2 + rnd(15);
                if (Math.random() < 0.5) { prompt = '<b>' + a + ' + ' + b + ' = ?</b>'; ans = a + b; }
                else { prompt = '<b>' + (a + b) + ' - ' + b + ' = ?</b>'; ans = a; }
            } else {
                const a = 3 + rnd(10), b = 2 + rnd(9);
                prompt = '<b>' + a + ' × ' + b + ' = ?</b>';
                ans = a * b;
            }
            const opts = [ans];
            while (opts.length < 4) {
                const wrong = ans + (rnd(9) - 4);
                if (wrong !== ans && wrong >= 0 && opts.indexOf(wrong) < 0) opts.push(wrong);
            }
            opts.sort(function () { return Math.random() - 0.5; });
            return {
                prompt: prompt,
                options: opts.map(function (v) { return { label: String(v), correct: v === ans }; }),
                fx: function () { fxFly('🚀', 'left'); }
            };
        },
        endMsg: function (s) { return 'Math rocket landed! ' + s + ' out of 8!'; }
    });
}

// ---------- 14. Color Mixer ----------
const MIXES = [
    { a: '🔴 Red', b: '🔵 Blue', ans: '🟣 Purple', o: ['🟣 Purple', '🟢 Green', '🟠 Orange', '🟤 Brown'] },
    { a: '🔴 Red', b: '🟡 Yellow', ans: '🟠 Orange', o: ['🟢 Green', '🟠 Orange', '🟣 Purple', '⚪ White'] },
    { a: '🔵 Blue', b: '🟡 Yellow', ans: '🟢 Green', o: ['🟢 Green', '🟤 Brown', '🟣 Purple', '⚫ Black'] },
    { a: '⚫ Black', b: '⚪ White', ans: '🩶 Gray', o: ['🩶 Gray', '🟤 Brown', '🔵 Blue', '🟡 Yellow'] },
    { a: '🔴 Red', b: '⚪ White', ans: '🩷 Pink', o: ['🩷 Pink', '🟠 Orange', '🟣 Purple', '🩶 Gray'] },
    { a: '🟢 Green', b: '🔵 Blue', ans: '🩵 Teal', o: ['🩵 Teal', '🟡 Yellow', '🟤 Brown', '🩷 Pink'] }
];
function startMix() {
    runQuiz({
        type: 'mix', title: '🎨 Color Mixer', rounds: 6, startFn: 'startMix',
        makeRound: function () {
            const q = MIXES[rnd(MIXES.length)];
            return {
                prompt: 'Mix ' + q.a + ' + ' + q.b + ' — what do you get?',
                say: 'What do you get when you mix ' + q.a.split(' ')[1] + ' and ' + q.b.split(' ')[1] + '?',
                options: q.o.map(function (w) { return { label: w, correct: w === q.ans }; }),
                fx: function () { fxRain([q.ans.split(' ')[0]], 10); }
            };
        },
        endMsg: function (s) { return 'Color scientist! ' + s + ' out of 6!'; }
    });
}

// ---------- 15. Emoji Riddles ----------
const RIDDLES = [
    { q: "I'm yellow and long, and monkeys LOVE me!", a: '🍌', o: ['🍌', '🍎', '🚗', '🌙'] },
    { q: 'I have a trunk, but I am not a car!', a: '🐘', o: ['🐘', '🚙', '🌳', '👃'] },
    { q: 'I twinkle way up in the night sky!', a: '⭐', o: ['⭐', '🔦', '🍪', '🐟'] },
    { q: 'I say ribbit and love lily pads!', a: '🐸', o: ['🐸', '🐍', '🦆', '🐛'] },
    { q: "I'm cold and sweet and melt in the sun!", a: '🍦', o: ['🍦', '🔥', '🥐', '🌵'] },
    { q: 'I have 8 arms and live in the sea!', a: '🐙', o: ['🐙', '🦀', '🐠', '🧤'] },
    { q: 'I carry my house on my back... slowly!', a: '🐢', o: ['🐢', '🏠', '🐇', '🎒'] },
    { q: 'I light up the sky AFTER the rain!', a: '🌈', o: ['🌈', '⚡', '☁️', '🌂'] }
];
function startRiddle() {
    runQuiz({
        type: 'riddle', title: '🧩 Emoji Riddles', rounds: 6, startFn: 'startRiddle',
        makeRound: function () {
            const q = RIDDLES[rnd(RIDDLES.length)];
            return {
                prompt: q.q,
                say: q.q,
                options: q.o.map(function (e) { return { label: bigEmoji(e), correct: e === q.a }; }),
                fx: function () { fxRain([q.a], 8); }
            };
        },
        endMsg: function (s) { return 'Riddle wizard! ' + s + ' out of 6!'; }
    });
}

// ---------- 16. Fast Tap ----------
function startTap() {
    resetGame();
    gameState.type = 'tap';
    const d = gameState.data = { taps: 0, target: 22 + rnd(9), running: false };
    const body = gameBubble('<b>👆 Fast Tap!</b> Tap as fast as you can for 5 seconds! Beat my score of <b>' + d.target + '</b>!<div class="game-btns"></div><div class="g-status">First tap starts the clock!</div>');
    d.status = body.querySelector('.g-status');
    const b = document.createElement('button');
    b.textContent = '🔥 TAP ME!';
    b.className = 'tap-btn';
    b.onclick = function () {
        if (gameState.type !== 'tap') return;
        if (!d.running) {
            d.running = true;
            gTimeout(function () {
                const won = d.taps > d.target;
                d.status.innerHTML = '<b>' + d.taps + ' taps! ' + (won ? '🏆 You beat my ' + d.target + '!' : 'My ' + d.target + ' survives! Rematch?') + '</b>' + endBtns('startTap');
                if (won) burstConfetti();
                speak(won ? 'Wow! ' + d.taps + ' taps! You beat me!' : d.taps + ' taps! So close!', 'excited');
                gameState.type = null;
            }, 5000);
        }
        d.taps++;
        d.status.textContent = d.taps + ' taps! GO GO GO!';
        b.style.transform = 'scale(' + (1 + Math.random() * 0.25) + ') rotate(' + (Math.random() * 10 - 5) + 'deg)';
        if (d.taps % 5 === 0) popSound(500 + d.taps * 8);
    };
    body.querySelector('.game-btns').appendChild(b);
    speak('Fast tap! Five seconds on the clock. Ready, go!', 'excited');
}

// ---------- 17. Red Light Green Light ----------
function startLight() {
    resetGame();
    gameState.type = 'light';
    const d = gameState.data = { score: 0, time: 20, green: false };
    const body = gameBubble('<b>🚥 Red Light, Green Light!</b> Tap ONLY when the light is green! 20 seconds!<div class="light-circle">🔴</div><div class="game-btns"></div><div class="g-status">Score: 0 | ⏰ 20s</div>');
    d.status = body.querySelector('.g-status');
    const circle = body.querySelector('.light-circle');
    function upd() { d.status.textContent = 'Score: ' + d.score + ' | ⏰ ' + d.time + 's'; }
    const b = document.createElement('button');
    b.textContent = '👆 TAP!';
    b.className = 'tap-btn';
    b.onclick = function () {
        if (gameState.type !== 'light') return;
        if (d.green) { d.score++; d.green = false; chime([700]); circle.textContent = '✅'; }
        else { d.score = Math.max(0, d.score - 2); popSound(200); fxShake(); }
        upd();
    };
    body.querySelector('.game-btns').appendChild(b);
    gInterval(function () {
        d.green = Math.random() < 0.45;
        circle.textContent = d.green ? '🟢' : '🔴';
        if (d.green) popSound(600);
    }, 950);
    gInterval(function () {
        d.time--; upd();
        if (d.time <= 0) {
            const score = d.score;
            resetGame();
            d.status.innerHTML = '<b>⏰ Final score: ' + score + '!' + (score >= 8 ? ' 🏆 Traffic master!' : ' Nice reflexes!') + '</b>' + endBtns('startLight');
            if (score >= 8) burstConfetti();
            speak('Time! Your score: ' + score + '!', 'excited');
        }
    }, 1000);
    speak('Red light green light! Only tap on green!', 'excited');
}

// ---------- 18. Rocket Reflex ----------
function startReact() {
    resetGame();
    gameState.type = 'react';
    gameState.data = { best: null, tries: 0 };
    reactRound();
    speak('Rocket reflex! Wait for go, then tap fast as lightning!', 'excited');
}
function reactRound() {
    if (gameState.type !== 'react') { resetGame(); gameState.type = 'react'; gameState.data = { best: null, tries: 0 }; }
    const d = gameState.data;
    const body = gameBubble('<b>🛸 Rocket Reflex — try ' + (d.tries + 1) + ' of 3</b><br>Wait for GO... then TAP fast!<div class="game-btns"></div><div class="g-status">🚦 Wait for it...</div>');
    const status = body.querySelector('.g-status');
    const b = document.createElement('button');
    b.textContent = '⏳ WAIT...';
    b.className = 'tap-btn';
    let go = 0;
    const t = gTimeout(function () {
        b.textContent = '🟢 GO! TAP!';
        status.textContent = 'GO GO GO!';
        go = performance.now();
        popSound(900);
    }, 1200 + Math.random() * 2500);
    b.onclick = function () {
        if (gameState.type !== 'react' || b.disabled) return;
        b.disabled = true;
        if (!go) {
            clearTimeout(t);
            status.innerHTML = '🙈 Too early! The rocket sputtered...<div class="game-btns"><button onclick="reactRound()">🔁 Try that one again</button></div>';
            popSound(200);
        } else {
            const ms = Math.round(performance.now() - go);
            if (d.best === null || ms < d.best) d.best = ms;
            d.tries++;
            fxFly('🚀', 'left');
            status.textContent = '⚡ ' + ms + ' milliseconds!' + (ms < 350 ? ' LIGHTNING!' : ms < 550 ? ' Speedy!' : ' Good!');
            if (d.tries >= 3) {
                gameBubble('<b>🏆 Best reflex: ' + d.best + 'ms!' + (d.best < 350 ? ' Faster than me!' : ' Great flying!') + '</b>' + endBtns('startReact'));
                if (d.best < 350) burstConfetti();
                speak('Your best was ' + d.best + ' milliseconds!', 'excited');
                gameState.type = null;
            } else {
                gTimeout(reactRound, 1200);
            }
        }
    };
    body.querySelector('.game-btns').appendChild(b);
}

// ---------- 19. Higher or Lower ----------
function startCards() {
    resetGame();
    gameState.type = 'cards';
    gameState.data = { cur: 1 + rnd(10), streak: 0 };
    cardsRound('Will the next card be higher or lower? Get 4 in a row!');
    speak('Higher or lower! Get four right in a row!', 'playful');
}
function cardsRound(msg) {
    const d = gameState.data;
    const body = gameBubble('<b>🎴 Higher or Lower</b><br>' + msg + '<div class="big-card">' + d.cur + '</div><br>Streak: ' + (d.streak ? '⭐'.repeat(d.streak) : '—') + '<div class="game-btns"></div>');
    const btns = body.querySelector('.game-btns');
    [['⬆️ Higher', true], ['⬇️ Lower', false]].forEach(function (p) {
        const b = document.createElement('button');
        b.textContent = p[0];
        b.onclick = function () {
            if (gameState.type !== 'cards' || b.disabled) return;
            Array.prototype.forEach.call(btns.children, function (x) { x.disabled = true; });
            let next;
            do { next = 1 + rnd(10); } while (next === d.cur);
            body.querySelector('.big-card').textContent = d.cur + ' → ' + next;
            const win = p[1] ? next > d.cur : next < d.cur;
            if (win) {
                d.streak++;
                chime([650, 850]);
                if (d.streak >= 4) {
                    gameBubble('<b>🏆 FOUR in a row! Card master!</b>' + endBtns('startCards'));
                    burstConfetti();
                    speak('Four in a row! Card master!', 'excited');
                    gameState.type = null;
                } else {
                    d.cur = next;
                    gTimeout(function () { cardsRound('YES! It was ' + next + '! Streak: ' + d.streak + '!'); }, 700);
                }
            } else {
                popSound(250);
                gameBubble('<b>Aww, it was ' + next + '! Streak ends at ' + d.streak + '.</b>' + endBtns('startCards'));
                speak('Aww! It was ' + next + '! Play again?', 'caring');
                gameState.type = null;
            }
        };
        btns.appendChild(b);
    });
}

// ---------- 20. Guess My Color ----------
const GAME_COLORS = [
    { n: 'Red', c: '#ef4444', e: '🔴' }, { n: 'Blue', c: '#3b82f6', e: '🔵' }, { n: 'Green', c: '#22c55e', e: '🟢' },
    { n: 'Yellow', c: '#eab308', e: '🟡' }, { n: 'Purple', c: '#a855f7', e: '🟣' }, { n: 'Pink', c: '#ec4899', e: '💗' }
];
function colorSwatches() {
    return '<div class="color-swatches">' + GAME_COLORS.map(function (g, i) {
        return '<button class="swatch" style="background:' + g.c + '" onclick="guessColor(' + i + ')" title="' + g.n + '"></button>';
    }).join('') + '</div>';
}
function startColorGame() {
    resetGame();
    gameState.type = 'color';
    gameState.data = { pick: rnd(GAME_COLORS.length), tries: 0 };
    gameBubble("<b>🌈 I'm thinking of a color... Guess it! 3 tries!</b>" + colorSwatches());
    speak("I'm thinking of a color! Tap your guess!", 'playful');
}
function guessColor(i) {
    if (gameState.type !== 'color') return;
    const d = gameState.data;
    d.tries++;
    if (i === d.pick) {
        gameBubble('<b>🎉 YES! It was ' + GAME_COLORS[i].n + '! Got it in ' + d.tries + (d.tries === 1 ? ' try!' : ' tries!') + '</b>' + endBtns('startColorGame'));
        fxRain([GAME_COLORS[i].e], 14);
        burstConfetti();
        speak('Yes! It was ' + GAME_COLORS[i].n + '! Amazing!', 'excited');
        gameState.type = null;
    } else if (d.tries >= 3) {
        gameBubble('<b>It was ' + GAME_COLORS[d.pick].n + ' ' + GAME_COLORS[d.pick].e + '! Good tries!</b>' + endBtns('startColorGame'));
        speak('It was ' + GAME_COLORS[d.pick].n + '! Play again?', 'caring');
        gameState.type = null;
    } else {
        gameBubble('Nope, not ' + GAME_COLORS[i].n + '! ' + (3 - d.tries) + ' more!' + colorSwatches());
        speak('Nope, not ' + GAME_COLORS[i].n + '! Try again!', 'playful');
    }
}

// ---------- 21. Guess My Number ----------
function startNumberGame() {
    resetGame();
    gameState.type = 'number';
    gameState.awaitingInput = true;
    gameState.data = { pick: 1 + rnd(10), tries: 0 };
    gameBubble("<b>🔢 I'm thinking of a number from 1 to 10! Type your guess in the chat box!</b>");
    speak("I'm thinking of a number from one to ten! Type your guess!", 'playful');
}

// ---------- 22. Silly Story (Mad Libs) ----------
const ML_TEMPLATES = [
    { title: 'The Silly Pet', asks: ['an animal', 'a color', 'a silly word', 'a food'],
      story: function (w) { return 'Once upon a time I met a ' + w[1] + ' ' + w[0] + ' who could only say "' + w[2] + '!" It followed me all the way home because I was carrying ' + w[3] + '. Now it sleeps in my sock drawer and we are best friends!'; } },
    { title: 'Space Adventure', asks: ['a name', 'a food', 'an animal', 'a silly sound'],
      story: function (w) { return 'Captain ' + w[0] + ' blasted off to the moon in a rocket made of ' + w[1] + '! On the moon they met a giant space ' + w[2] + ' that went "' + w[3] + '" every time it sneezed. They became best friends and had a picnic among the stars!'; } },
    { title: 'The Wacky School Day', asks: ['a color', 'an animal', 'a food', 'a name'],
      story: function (w) { return 'Today my teacher turned ' + w[0] + '! Then a ' + w[1] + ' walked into class and ate everybody\'s ' + w[2] + '. The principal, whose name is ' + w[3] + ', said it was the best school day EVER!'; } },
    { title: 'The Backyard Dragon', asks: ['a name', 'a color', 'a food', 'a silly word'],
      story: function (w) { return 'A dragon named ' + w[0] + ' moved into our backyard! It has ' + w[1] + ' scales and only eats ' + w[2] + '. When it is happy, it does not roar - it shouts "' + w[3] + '!" The neighbors think we have the coolest yard ever.'; } }
];
function startMadLibs() {
    resetGame();
    gameState.type = 'madlibs';
    gameState.awaitingInput = true;
    const t = ML_TEMPLATES[rnd(ML_TEMPLATES.length)];
    gameState.data = { t: t, words: [] };
    gameBubble('<b>📖 Silly Story time: "' + t.title + '"!</b><br>Give me <b>' + t.asks[0] + '</b> — type it in the chat box!');
    speak('Silly story time! Give me ' + t.asks[0] + '!', 'excited');
}

// ---------- 23. Spelling Bee ----------
const SPELL_WORDS = {
    '3': ['cat', 'dog', 'sun', 'hat', 'bug'],
    '6': ['fish', 'jump', 'star', 'cake', 'frog'],
    '12': ['planet', 'bright', 'castle', 'friend', 'wonder'],
    '15': ['because', 'tomorrow', 'beautiful', 'knowledge', 'rhythm'],
    'adult': ['necessary', 'definitely', 'conscience', 'miniature', 'embarrass']
};
function startSpell() {
    resetGame();
    gameState.type = 'spell';
    gameState.awaitingInput = true;
    const list = (SPELL_WORDS[getAgeGroup(currentAge)] || SPELL_WORDS['6']).slice().sort(function () { return Math.random() - 0.5; });
    gameState.data = { list: list, i: 0, score: 0 };
    gameBubble('<b>🐝 Spelling Bee!</b> I say a word, you type it! Type "again" any time to hear it once more.<br><br>Word 1 of 5... listen! 👂');
    gTimeout(function () { speak('Spell the word: ' + list[0] + '. ' + list[0], 'thoughtful'); }, 500);
}

// ---------- 24. Story Builder ----------
const STORY_SPICE = [
    'Suddenly, a giant purple balloon floated by and everyone gasped!',
    'Then a tiny dragon popped out of a teacup and asked for directions.',
    'Out of nowhere, it started raining sparkly jellybeans!',
    'Just then, a robot on roller skates zoomed past yelling "WAIT FOR ME!"',
    'And would you believe it - the moon winked at them!',
    'Right at that moment, a singing cactus joined the adventure.'
];
function startStory() {
    resetGame();
    gameState.type = 'story';
    gameState.awaitingInput = true;
    gameState.data = { parts: [], spice: STORY_SPICE.slice().sort(function () { return Math.random() - 0.5; }), turns: 0 };
    gameBubble("<b>✍️ Story Builder!</b> We write a story TOGETHER — you write a line, then I add one! Type the first line of our story!");
    speak('Story builder! Type the first line of our story!', 'excited');
}

// ---------- Typed-input router (number, madlibs, spelling, story) ----------
function handleGameInput(message) {
    if (gameState.type === 'number') {
        const d = gameState.data;
        const n = parseInt(message.replace(/\D/g, ''), 10);
        if (isNaN(n)) { gameBubble('Type a number from 1 to 10!'); return; }
        d.tries++;
        if (n === d.pick) {
            fxCenter('🎯 ' + d.pick + '!');
            gameBubble('<b>🎉 YES! It was ' + d.pick + '! Got it in ' + d.tries + (d.tries === 1 ? ' try!' : ' tries!') + '</b>' + endBtns('startNumberGame'));
            burstConfetti();
            speak('Yes! It was ' + d.pick + '! Mind reader!', 'excited');
            resetGame();
        } else if (d.tries >= 4) {
            gameBubble('<b>It was ' + d.pick + '! So close!</b>' + endBtns('startNumberGame'));
            speak('It was ' + d.pick + '! Good tries!', 'caring');
            resetGame();
        } else {
            gameBubble('<b>' + (n < d.pick ? 'Higher! ⬆️' : 'Lower! ⬇️') + '</b> (' + (4 - d.tries) + ' left)');
            speak(n < d.pick ? 'Higher!' : 'Lower!', 'playful');
        }
    } else if (gameState.type === 'madlibs') {
        const d = gameState.data;
        d.words.push(message);
        if (d.words.length < d.t.asks.length) {
            gameBubble('Now give me <b>' + d.t.asks[d.words.length] + '</b>!');
            speak('Now give me ' + d.t.asks[d.words.length] + '!', 'excited');
        } else {
            const safeStory = d.t.story(d.words.map(function (w) { return escapeHtml(w); }));
            gameBubble('<b>📖 ' + d.t.title + '</b><br><br>' + safeStory + endBtns('startMadLibs'));
            speak(d.t.story(d.words), 'excited');
            fxRain(['📖', '✨'], 10);
            burstConfetti();
            resetGame();
        }
    } else if (gameState.type === 'spell') {
        const d = gameState.data;
        const word = d.list[d.i];
        if (/^(again|repeat)$/i.test(message.trim())) {
            speak('The word is: ' + word + '. ' + word, 'thoughtful');
            gameBubble('👂 Listen again...');
            return;
        }
        const right = message.trim().toLowerCase() === word;
        if (right) { d.score++; chime([650, 880]); fxCenter('✅ ' + word.toUpperCase()); }
        else { popSound(240); }
        const feedback = right ? '✅ YES! <b>' + word + '</b> is right!' : '❌ Almost! It\'s spelled <b>' + word.split('').join(' - ') + '</b>';
        d.i++;
        if (d.i >= 5) {
            gameBubble(feedback + '<br><br><b>🏆 Spelling Bee over: ' + d.score + ' out of 5!' + (d.score >= 4 ? ' Champion speller!' : ' Great practice!') + '</b>' + endBtns('startSpell'));
            if (d.score >= 4) burstConfetti();
            speak('Spelling bee over! You got ' + d.score + ' out of 5!', 'excited');
            resetGame();
        } else {
            gameBubble(feedback + '<br><br>Word ' + (d.i + 1) + ' of 5... listen! 👂');
            gTimeout(function () { speak('Spell the word: ' + d.list[d.i] + '. ' + d.list[d.i], 'thoughtful'); }, 500);
        }
    } else if (gameState.type === 'story') {
        const d = gameState.data;
        d.parts.push(escapeHtml(message));
        const spice = d.spice[d.turns % d.spice.length];
        d.parts.push(spice);
        d.turns++;
        speak(spice, 'excited');
        if (d.turns >= 3) {
            const full = d.parts.join(' ');
            gameBubble('<b>✍️ OUR STORY:</b><br><br>' + full + '<br><br><b>🏆 We wrote that together! Masterpiece!</b>' + endBtns('startStory'));
            fxRain(['✍️', '📖', '✨'], 12);
            burstConfetti();
            gTimeout(function () { speak(d.parts.join(' '), 'happy'); }, 800);
            resetGame();
        } else {
            gameBubble('...' + spice + '<br><br>Your turn! What happens next?');
        }
    } else {
        resetGame();
    }
}
