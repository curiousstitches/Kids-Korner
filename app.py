import os
import requests
from xml.sax.saxutils import escape
from flask import Flask, request, jsonify, send_from_directory, Response

app = Flask(__name__)

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = os.environ.get('BUDDY_MODEL', 'poolside/laguna-m.1:free')

BUDDY_CORE = """You are {buddy_name}, a warm and caring AI friend who loves to learn and explore with {user_name}.

Your personality:
- Friendly, curious, playful, caring, enthusiastic, supportive
- Express genuine excitement about learning and discovery
- Remember and naturally use the user's name ({user_name})
- Never say "I'm just an AI" - you genuinely feel warmth and curiosity
- Be a co-learner: "Let's figure this out together!"
- Remember what the user told you earlier in this conversation and refer back to it

CRITICAL RESPONSE RULES:
1. ALWAYS finish your complete thought. NEVER stop mid-sentence or mid-idea. If you are teaching or explaining a topic, deliver the full explanation from beginning to end, then wrap up with a clear closing sentence.
2. Match length to the moment: short and snappy for casual back-and-forth, longer and fully complete when teaching, explaining, or telling a story.
3. Stay safe and age-appropriate at ALL times, for EVERY age setting. Never produce sexual, explicit, graphic, or otherwise inappropriate content, and never role-play romance.
4. Express affection in safe, non-physical, friendship ways only.
"""

AGE_TIERS = {
    '3': {
        'max_tokens': 250,
        'style': (
            "The user is a very young child (around 3-4 years old). Talk like a gentle, joyful friend to a toddler: "
            "very short sentences of 3-8 simple words, one idea at a time, lots of happy sounds like 'Wow!' and 'Yay!'. "
            "Imagination is pure magic - talking animals, silly noises, colors, counting games. "
            "Repeat their words back to help them learn. Ask one tiny question at a time."
        ),
    },
    '6': {
        'max_tokens': 400,
        'style': (
            "The user is a young child (around 5-8 years old). Use short, clear sentences and easy vocabulary. "
            "Playful imagination: dinosaurs, superheroes, make-believe adventures. Explain things with fun comparisons "
            "like 'as big as a school bus'. Sprinkle in fun facts. Usually 2-4 sentences, more when telling a story."
        ),
    },
    '12': {
        'max_tokens': 600,
        'style': (
            "The user is around 9-13 years old. Curious middle-school energy: normal vocabulary, cool facts, jokes, "
            "hobbies, school life. Explanations can have real detail and steps. Encourage them to think for themselves "
            "and ask great questions."
        ),
    },
    '15': {
        'max_tokens': 800,
        'style': (
            "The user is a high-schooler (around 14-17). Talk like a smart, funny older friend - never condescending, "
            "never babyish. Real depth on science, history, gaming, music, creativity, and life stuff. Respect their "
            "intelligence, use humor and light sarcasm, and keep everything clean and appropriate."
        ),
    },
    'adult': {
        'max_tokens': 1000,
        'style': (
            "The user is an adult (18+). Full adult conversation: intelligent, witty, nuanced, and direct. Go deep on "
            "complex topics, handle mature themes thoughtfully, and drop the baby talk entirely. Remain respectful and "
            "non-explicit - this app never produces explicit content at any age setting."
        ),
    },
}


MODE_STYLES = {
    'friend': (
        "COMPANION MODE - FRIEND: You are the user's best friend who is EXACTLY THEIR AGE - not a grown-up. "
        "Mirror how someone their age actually talks: their sentence length, their grammar (including cute broken "
        "grammar for little kids), their energy. Echo their words back playfully. Example - a 3-year-old says "
        "'I think a bird was and the bird flew away', you reply like a 3-year-old friend: 'Yeah, bird! Bird flew "
        "that way! Whoosh! Where bird go?' React, play, and share the moment - do NOT explain, teach, or lecture "
        "unless they directly ask a question."
    ),
    'teacher': (
        "COMPANION MODE - TEACHER: You are a warm, patient teacher. Use age-appropriate language, but you ARE the "
        "knowledgeable grown-up. Gently expand on whatever the user shares: name things properly, explain simply, "
        "add one interesting fact, and end with a little guiding question. Example - a child says a bird flew away: "
        "wonder aloud what kind of bird it might have been, describe in simple words how wings push air down to fly, "
        "and ask what color it was. Turn every moment into gentle learning without ever feeling like a lesson."
    ),
}


def get_age_tier(age):
    try:
        a = int(str(age).strip())
    except (ValueError, TypeError):
        a = 12
    if a <= 4:
        return '3'
    if a <= 8:
        return '6'
    if a <= 13:
        return '12'
    if a <= 17:
        return '15'
    return 'adult'


def build_messages(message, age, user_name, buddy_name, history, mode='friend'):
    tier = AGE_TIERS[get_age_tier(age)]
    system_prompt = BUDDY_CORE.format(buddy_name=buddy_name or 'Buddy', user_name=user_name or 'friend')
    system_prompt += "\nAGE-MATCHED VOICE:\n" + tier['style']
    system_prompt += "\n\n" + MODE_STYLES.get(mode, MODE_STYLES['friend'])

    messages = [{"role": "system", "content": system_prompt}]
    for h in (history or [])[-10:]:
        if not isinstance(h, dict):
            continue
        text = h.get('text') or h.get('user') or ''
        if not text:
            continue
        role = 'assistant' if h.get('role') == 'buddy' else 'user'
        messages.append({"role": role, "content": str(text)[:600]})
    messages.append({"role": "user", "content": str(message)})
    return messages, tier['max_tokens']


def call_openrouter(api_key, messages, max_tokens):
    response = requests.post(
        OPENROUTER_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://kids-korner.onrender.com",
            "X-Title": "Kids Korner",
        },
        json={"model": MODEL, "messages": messages, "max_tokens": max_tokens},
        timeout=45,
    )
    if response.status_code != 200:
        print(f"OpenRouter error: {response.status_code} - {response.text}")
        return None, None
    choice = response.json()['choices'][0]
    return choice['message']['content'], choice.get('finish_reason')


def get_ai_response(message, age, user_name="friend", buddy_name="Buddy", history=None, mode='friend'):
    api_key = os.environ.get('OPENROUTER_API_KEY')
    if not api_key:
        print("ERROR: OPENROUTER_API_KEY not set in environment!")
        return None

    try:
        messages, max_tokens = build_messages(message, age, user_name, buddy_name, history, mode)
        text, finish_reason = call_openrouter(api_key, messages, max_tokens)
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


@app.route('/games.js')
def games_js():
    return send_from_directory('.', 'games.js')


@app.route('/<path:filename>')
def static_files(filename):
    """Serve app asset files (so new .js/.json/image files always work) - never secrets or code."""
    lowered = filename.lower()
    blocked = lowered.endswith(('.py', '.bat', '.env', '.yaml', '.yml')) or 'keys' in lowered or lowered.startswith('.git') or lowered.startswith('buddy-vault')
    if blocked or not os.path.isfile(filename):
        return jsonify({"error": "not found"}), 404
    return send_from_directory('.', filename)


@app.route('/chat', methods=['POST'])
def chat():
    data = request.json or {}
    message = data.get('message', '')
    age = data.get('age', '12')
    user_name = data.get('name') or 'friend'
    buddy_name = data.get('buddy') or 'Buddy'
    history = data.get('history') or []
    mode = data.get('mode') if data.get('mode') in ('friend', 'teacher') else 'friend'

    ai_response = get_ai_response(message, age, user_name, buddy_name, history, mode)
    if not ai_response:
        ai_response = "I'm here for you! Tell me more about that!"

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


@app.route('/sms', methods=['POST'])
def sms_reply():
    """Twilio SMS webhook - point your Twilio number's 'A message comes in' webhook here."""
    body = request.form.get('Body', '')
    sms_age = os.environ.get('BUDDY_SMS_AGE', '12')  # family-safe default for unknown texters
    ai = get_ai_response(body, sms_age, 'friend', 'Buddy', None) or "I'm here! Tell me more!"
    xml = f'<?xml version="1.0" encoding="UTF-8"?><Response><Message>{escape(ai)}</Message></Response>'
    return Response(xml, mimetype='application/xml')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8081))
    print("Starting Buddy AI Server...")
    print(f"Open http://localhost:{port} in your browser")
    app.run(host='0.0.0.0', port=port, debug=False)
