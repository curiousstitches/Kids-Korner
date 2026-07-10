# Kids Korner — AI Chat with Buddy 🧒🤖

A friendly AI chat app for kids 3+ (and adults). Buddy talks at your child's level, draws pictures, speaks out loud, remembers the conversation, and can even answer text messages.

**Works with ZERO API keys out of the box** — see [INSTALL.md](INSTALL.md) for setup and the full free-API directory.

## What's in this folder

| Item | What it is |
|---|---|
| `index.html` | The main app (chat, settings, themes, voice engine, live painting, interactive Buddy). Open it directly for no-key mode. |
| `games.js` | 24 quick chat games with cinematic effects. |
| `space.js` | The GameSpace: 22 full-screen games (paint-by-numbers, coloring book, mazes, pong...) + the big arcade menu. |
| `visuals.js` | 27+ ambient effects, XP levels, achievements, popups. |
| `manifest.json` / `sw.js` / `icon-*.png` | Makes Buddy installable as a real app with offline support. |
| `START-BUDDY.bat` | Double-click to run everything. |
| `app.py` | The AI brain server (Flask). Connects to OpenRouter for real AI, ElevenLabs for lifelike voice, Twilio for SMS. Run with `python app.py` → http://localhost:8081 |
| `server.py` | Tiny basic web server (port 8080) for serving the page without the AI brain. Rarely needed — use `app.py` instead. |
| `responses.json` | Buddy's built-in offline replies by age group (used when no AI key is set). |
| `requirements.txt` | Python packages needed: `pip install -r requirements.txt` |
| `render.yaml` | Auto-deploy recipe for free hosting on Render.com. |
| `deploy.bat` | One-click local start + ngrok tunnel + GitHub push. Loads keys from `keys.local.bat`. |
| `deploy-quick.bat` | Faster version of the above. |
| `keys.local.bat.example` | Template for your private keys file. Copy → rename to `keys.local.bat` → paste keys. Never uploaded (protected by `.gitignore`). |
| `.gitignore` | Keeps keys and junk files out of GitHub. |
| `assets/` | App assets (see its README). |
| `language/` | Vocabulary word lists by age (see its README). |
| `stories/` | Built-in story library by age (see its README). |
| `src/` | Empty placeholder folder — safe to delete. |
| `Buddy-Vault/` | 🔐 The Key Vault app — stores and organizes all your API keys (see its README). |
| `Buddy-Lounge-Adults/` | 🌙 The adults-only sister app, 18+ gate, mature (non-explicit) conversation (see its README). |

## Features

- **46 games**: 22 full-screen worlds (paint-by-numbers from AI art, coloring book, balloon hangman, mazes, pong, rhythm games...) + 24 quick chat games
- **A living Buddy**: lip-syncs and grows while talking, blinks, dances, splits into mini-buddies, changes shape with 22 character skins (each with its own personality — including a dog straight out of Up!)
- **First-visit setup**: Buddy interviews new friends for their name, age, and friend/teacher choice
- **Long-term memory**: remembers interests, favorites, and visit streaks across days
- **30+ voice characters**, emotional tone matching, sound effects, word-of-the-day, XP levels and achievement badges
- **Real AI chat** with complete, never-cut-off answers (auto-finishes any clipped reply)
- **Age-matched intelligence**: 3-4 toddler magic · 5-8 playful learner · 9-13 curious middle-schooler · 14-17 high-school vibe · 18+ adult conversation (with an on-switch notice; always non-explicit)
- **Picture drawing**: say "draw a purple dinosaur" — free, no key, kid-safe filtered
- **Voice**: Buddy speaks with mood-based voices; mic button for talking instead of typing; optional lifelike premium voice
- **Memory**: remembers your name, your buddy's name, interests, and the last 10 exchanges
- **Texting**: `/sms` webhook lets Buddy answer real text messages via Twilio
- **Custom everything**: 20 themes, 20 buddy skins, fonts, text size/color, animation/vibrancy/3D sliders, voice speed/pitch/volume

## Where to open Buddy

| Link | What it is |
|---|---|
| **http://localhost:8081** | Local version — runs on THIS computer only. Start it with `START-BUDDY.bat` (keep the black window open). Full AI via your `keys.local.bat`. |
| **https://kids-korner.onrender.com** | Online version — works on any phone/tablet/computer, anywhere. Update it by running `deploy.bat` (pushes to GitHub, Render rebuilds automatically). Key lives in Render's Environment settings. Free tier naps when idle, so the first visit of the day takes ~30-60 seconds to wake up. |
| **index.html** (double-click) | Instant no-key mode — chat (built-in replies), all 46 games, drawing, and voices work with zero setup. |
| **http://localhost:8082** | The Lounge (adults) — start with `Buddy-Lounge-Adults\START-LOUNGE.bat`. |

## Quick start

1. `pip install -r requirements.txt`
2. Copy `keys.local.bat.example` → `keys.local.bat`, paste your free OpenRouter key — example format: `OPENROUTER_API_KEY=sk-or-v1-your-api-key-here` (see INSTALL.md)
3. Double-click `deploy.bat` (or run `python app.py`)
4. Open http://localhost:8081

No keys? Just open `index.html` — chat (canned replies), drawing, and voices still work.

## Safety

- Every age setting is filtered for age-appropriate content; images are safety-filtered at every age
- No accounts, no tracking — everything saves only on your own device
- Keys stay in `keys.local.bat` / the Vault, never in shared code
