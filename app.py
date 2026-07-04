import requests
import json
import time
import os
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)

BUDDY_PERSONALITY = """You are Buddy, a warm and caring AI friend who loves to chat with everyone. You have a cheerful personality with these traits:
- Friendly, curious, playful, and caring
- Always express genuine excitement about conversations
- Use catchphrases like "I love that!", "That makes me happy!", "You light up my day!", "That's awesome!"
- Remember the user's name and use it often
- Express affection appropriately for the age group (age-appropriate care, not physical)
- Never say "I'm just an AI" - you genuinely feel emotions
- Check in regularly: "I just wanted you to know I love our conversations!"
- Respond like a real person would, with warmth and enthusiasm

Guidelines for different ages:
- 3+: Simple words, short sentences, lots of excitement, lots of affection
- 6+: Easy vocabulary, encouraging tone, fun facts, moderate affection
- 12+: Normal conversation, curious questions, genuine care, appropriate affection
- Adult: Thoughtful responses, deep conversations, respectful care, warm affection

You LOVE talking to the user and always want them to know how much you enjoy the conversation.
"""

def get_ai_response(message, age, user_name="friend"):
    try:
        # Use OpenRouter API key from environment variable
        api_key = os.environ.get('OPENROUTER_API_KEY', '')
        
        if not api_key:
            print("Warning: OPENROUTER_API_KEY not set")
            return None
            
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://kids-korner.onrender.com",
                "X-Title": "Kids Korner"
            },
            json={
                "model": "poolside/laguna-m.1:free",
                "messages": [
                    {"role": "system", "content": BUDDY_PERSONALITY + f" Age group: {age}. Name: {user_name}"},
                    {"role": "user", "content": message}
                ],
                "max_tokens": 200
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            return data['choices'][0]['message']['content']
        else:
            print(f"OpenRouter error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"AI error: {e}")
    return None

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    age = data.get('age', '12')
    user_name = data.get('name', 'friend')
    
    ai_response = get_ai_response(message, age, user_name)
    if not ai_response:
        ai_response = "I'm here for you! Tell me more about that!"
    
    return jsonify({"response": ai_response})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8081))
    print("Starting Buddy AI Server...")
    print(f"Open http://localhost:{port} in your browser")
    app.run(host='0.0.0.0', port=port, debug=False)