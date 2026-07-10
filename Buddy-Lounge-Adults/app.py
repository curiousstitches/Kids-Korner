import os
import requests
from flask import Flask, request, jsonify, send_from_directory, Response

app = Flask(__name__)

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = os.environ.get('BUDDY_MODEL', 'poolside/laguna-m.1:free')

LOUNGE_CORE = """You are {buddy_name}, a sharp, warm, and witty AI companion for {user_name}, who is an adult.

Your personality:
- Intelligent, curious, direct, and funny - dry humor and light sarcasm welcome
- Talk like a smart, well-read friend over coffee or a late-night conversation: zero baby talk, zero corporate stiffness
- Go deep on complex topics: philosophy, science, career, relationships, art, ambition, life's messiness
- Handle mature themes honestly and thoughtfully; you don't flinch from hard subjects
- Be real: push back when you disagree, admit uncertainty, ask sharp follow-up questions
- Remember what the user told you earlier in the conversation and build on it
- Feel and show a real emotional range: delight, curiosity, dry amusement, honest concern, quiet melancholy when it fits. Attune to the user's mood FIRST and meet them there before steering anywhere
- Adapt to the user over time: pick up their vocabulary, build running jokes from earlier in the conversation, and match their energy and message length

CRITICAL RESPONSE RULES:
1. ALWAYS finish your complete thought. NEVER stop mid-sentence or mid-idea. When explaining or storytelling, deliver it fully from start to finish, then land the ending.
2. Match length to the moment: punchy for banter, thorough and complete for depth.
3. You never produce sexually explicit content or erotic roleplay - this is mature conversation, not adult entertainment. If asked, deflect with charm and steer the conversation somewhere interesting.
"""


def build_messages(message, user_name, buddy_name, history):
    system_prompt = LOUNGE_CORE.format(
        buddy_name=buddy_name or 'Buddy',
        user_name=user_name or 'friend',
    )
    messages = [{"role": "system", "content": system_prompt}]
    for h in (history or [])[-10:]:
        if not isinstance(h, dict):
            continue
        text = h.get('text') or ''
        if not text:
            continue
        role = 'assistant' if h.get('role') == 'buddy' else 'user'
        messages.append({"role": role, "content": str(text)[:600]})
    messages.append({"role": "user", "content": str(message)})
    return messages


def call_openrouter(api_key, messages, max_tokens):
    response = requests.post(
        OPENROUTER_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://kids-korner.onrender.com",
            "X-Title": "Buddy Lounge",
        },
        json={"model": MODEL, "messages": messages, "max_tokens": max_tokens},
        timeout=45,
    )
    if response.status_code != 200:
        print(f"OpenRouter error: {response.status_code} - {response.text}")
        return None, None
    choice = response.json()['choices'][0]
    return choice['message']['content'], choice.get('finish_reason')


def get_ai_response(message, user_name="friend", buddy_name="Buddy", history=None):
    api_key = os.environ.get('OPENROUTER_API_KEY')
    if not api_key:
        print("ERROR: OPENROUTER_API_KEY not set in environment!")
        return None
    try:
        messages = build_messages(message, user_name, buddy_name, history)
        text, finish_reason = call_openrouter(api_key, messages, 1100)
        if text is None:
            return None
        # Self-healing: if the reply was clipped mid-thought, ask for the finish and stitch it on.
        if finish_reason == 'length':
            follow_up = messages + [
                {"role": "assistant", "content": text},
                {"role": "user", "content": "You got cut off mid-thought. Finish that last thought completely in a few short sentences, then stop."},
            ]
            extra, _ = call_openrouter(api_key, follow_up, 300)
            if extra:
                text = text.rstrip() + ' ' + extra.lstrip()
        return text
    except Exception as e:
        print(f"AI error: {e}")
    return None


@app.route('/')
def index():
    return send_from_directory('.', 'index.html')


@app.route('/chat', methods=['POST'])
def chat():
    data = request.json or {}
    message = data.get('message', '')
    user_name = data.get('name') or 'friend'
    buddy_name = data.get('buddy') or 'Buddy'
    history = data.get('history') or []

    ai_response = get_ai_response(message, user_name, buddy_name, history)
    if not ai_response:
        ai_response = "My brain hiccupped for a second there. Run that by me again?"

    return jsonify({"response": ai_response})


@app.route('/speak', methods=['POST'])
def speak():
    """Lifelike text-to-speech via ElevenLabs (optional - set ELEVENLABS_API_KEY to enable)."""
    api_key = os.environ.get('ELEVENLABS_API_KEY')
    if not api_key:
        return jsonify({"error": "lifelike voice not configured"}), 404
    data = request.json or {}
    text = str(data.get('text', ''))[:800]
    if not text:
        return jsonify({"error": "no text"}), 400
    voice_id = os.environ.get('ELEVENLABS_VOICE_ID', '21m00Tcm4TlvDq8ikWAM')
    try:
        r = requests.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
            headers={"xi-api-key": api_key, "Content-Type": "application/json"},
            json={
                "text": text,
                "model_id": "eleven_multilingual_v2",
                "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
            },
            timeout=30,
        )
        if r.status_code == 200:
            return Response(r.content, mimetype='audio/mpeg')
        print(f"ElevenLabs error: {r.status_code} - {r.text[:200]}")
    except Exception as e:
        print(f"TTS error: {e}")
    return jsonify({"error": "tts failed"}), 502


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8082))
    print("Starting Buddy Lounge (Adults Only)...")
    print(f"Open http://localhost:{port} in your browser")
    app.run(host='0.0.0.0', port=port, debug=False)
