# The Lounge - Buddy for Adults (18+)

The adults-only companion app: intelligent, witty, mature conversation. No kid modes, no baby talk.
Mature conversation only - this app does not produce explicit content.

## Run it
1. `pip install flask requests`
2. Set your key (same key as Kids Korner - get yours free at https://openrouter.ai/keys):
   `set OPENROUTER_API_KEY=sk-or-v1-your-api-key-here`  *(example only - replace with your real key; never save real keys in shared files)*
3. `python app.py`
4. Open http://localhost:8082

Runs on port 8082, so it can run at the same time as Kids Korner (8081).

## Features
- 18+ entry gate
- Full adult conversation with memory (last 10 exchanges)
- Complete thoughts guaranteed - auto-finishes any clipped reply
- Picture generation: type "draw ..." or "picture of ..."
- Lifelike voice: set ELEVENLABS_API_KEY on the server, then flip the toggle in settings
- Names, dark themes, fonts, text color/size, animation/vibrancy/depth sliders, voice controls
- All settings saved on-device, fully separate from Kids Korner
