# 📦 Installation & API Guide

Everything here is **free**. The app even runs with **zero keys** — so you can show the folder to anyone without giving anything away.

---

## Level 0 — Zero keys, zero install (30 seconds)

Just double-click `index.html`.

Works immediately, 100% free, nothing to sign up for:
- 💬 Chat — Buddy Mode (built-in replies by age)
- 🎨 Drawing — "draw a rainbow unicorn" (Pollinations, no key needed)
- 🔊 Voices — built-in browser voices with moods
- ⚙️ All themes, skins, names, and settings

## Level 1 — Real AI brain (5 minutes, free)

1. Install Python from https://www.python.org/downloads (check "Add to PATH")
2. In the kids-Korner folder run: `pip install -r requirements.txt`
3. Get a free key at **https://openrouter.ai/keys** (starts with `sk-or-`)
4. Copy `keys.local.bat.example` → rename the copy `keys.local.bat` → paste your key in it.
   Inside, the line looks like this (example key — swap in your real one):
   `set OPENROUTER_API_KEY=sk-or-v1-your-api-key-here`
5. Double-click `START-BUDDY.bat` → it opens http://localhost:8081 for you

The default model is a free one. Never pay: on OpenRouter, only pick models tagged `:free`.

## Level 2 — Put it on the internet (free)

1. Create account at https://render.com (free plan)
2. Connect your GitHub repo — `render.yaml` does the setup automatically
3. In the Render dashboard → Environment → add `OPENROUTER_API_KEY` with your key
   (name: `OPENROUTER_API_KEY`, value example: `sk-or-v1-your-api-key-here` — use your real key)
4. Your app appears at `https://your-app-name.onrender.com`

⚠️ Keys go in Render's **Environment** screen — never in code files.

## Level 3 — Optional upgrades (free tiers)

**🗣️ Lifelike voice** — https://elevenlabs.io (free tier). Get key from your profile → add `ELEVENLABS_API_KEY` to `keys.local.bat` (or Render) → flip "Lifelike voice" in the app's settings. Example line: `set ELEVENLABS_API_KEY=your-api-key-here`. No key? Browser voices keep working.

**📱 Text Buddy from a phone** — https://www.twilio.com/try-twilio (free trial). Buy/claim a number, then in the number's settings paste `https://your-app.onrender.com/sms` into "A message comes in". Texters get family-safe replies (change with `BUDDY_SMS_AGE`).

---

## 🗂️ The Free API Directory

Store and manage all of these with the Key Vault: `Buddy-Vault/vault.html`

### 💬 Chat AI
| Provider | Key needed? | Get it | Notes |
|---|---|---|---|
| **OpenRouter** ⭐ default | Yes (free) | https://openrouter.ai/keys | Many free models (`:free` tag). One key, many brains. |
| Groq | Yes (free) | https://console.groq.com/keys | Extremely fast, generous free limits. |
| Google AI Studio (Gemini) | Yes (free) | https://aistudio.google.com/apikey | Solid free tier. |
| Ollama (runs on your PC) | **No key** | https://ollama.com | 100% free forever, private, works offline. Needs a decent PC. |

### 🎨 Picture generation
| Provider | Key needed? | Get it | Notes |
|---|---|---|---|
| **Pollinations** ⭐ built in | **No key** | https://pollinations.ai | Already wired into both apps. Safety filter always on. |
| Hugging Face | Yes (free) | https://huggingface.co/settings/tokens | Free-tier image models. |

### 🔊 Voice (text-to-speech)
| Provider | Key needed? | Get it | Notes |
|---|---|---|---|
| **Browser voices** ⭐ built in | **No key** | (built into Chrome/Edge) | Default. Mood-based pitch/speed. |
| ElevenLabs | Yes (free tier) | https://elevenlabs.io | Stunningly human. ~10k free credits/month. |

### 📱 Texting (SMS)
| Provider | Key needed? | Get it | Notes |
|---|---|---|---|
| **Twilio** ⭐ supported | Yes (free trial) | https://www.twilio.com/try-twilio | `/sms` webhook already built into app.py. |
| TextBelt | Sort of | https://textbelt.com | 1 free outgoing text/day with key `textbelt`. |

---

## 🔐 Golden rules for keys

1. Keys live ONLY in `keys.local.bat`, the Vault, or Render's Environment screen.
2. Never in `index.html`, `app.py`, `tools\deploy.bat`, or anything Git uploads — `.gitignore` protects `keys.local.bat` automatically.
3. Sharing the folder or repo? That's fine — it contains no keys. Your friends add their own (that's the recommended way) or run Level 0 with none.
4. If a key ever leaks, log in to the provider and delete/rotate it immediately.
