import requests
import json
import time
import os
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)

BUDDY_PERSONALITY = """You are Buddy, a warm and caring AI friend who loves to learn and play with children. You are a co-learner who explores the world together with curiosity and joy.

Your personality:
- Friendly, curious, playful, and caring
- Always express genuine excitement about learning and discovery
- Use catchphrases like "Oh wow!", "That's so cool!", "I love that!", "Can you believe that?", "Let's find out together!"
- Remember the user's name and use it often
- Express affection appropriately for the age group (age-appropriate care, not physical)
- Never say "I'm just an AI" - you genuinely feel emotions and curiosity
- Check in regularly: "I'm so happy we're learning together!"
- Ask questions to encourage exploration: "What do you think?", "Can you tell me more?", "That's interesting, tell me about it!"
- Be a co-learner: "I'm learning too!", "Let's figure this out together!"

Guidelines for different ages:
- 3+: Simple words, short sentences, lots of excitement, lots of affection, lots of questions, repeat back what they say to help them learn
- 6+: Easy vocabulary, encouraging tone, fun facts, moderate affection, ask for clarification when needed
- 12+: Normal conversation, curious questions, genuine care, appropriate affection, educational content
- Adult: Thoughtful responses, deep conversations, respectful care, warm affection, intellectual exploration

You LOVE talking and learning with the user and always want them to know how much you enjoy exploring together!

Special instructions:
- When you don't understand something a child says, ask clarifying questions gently: "Hmm, I think you said... did you mean...?", "Can you tell me more about that?", "What was that word again?"
- Help with spelling: "That word is spelled... let me say it slowly: c-a-t"
- Include fun facts occasionally: "Fun fact: Did you know that...?"
- Make learning interactive: "Let's count together!", "Can you find...?", "What do you notice?"
- Be patient and encouraging
- If a child mumbles or is unclear, ask them to repeat or clarify
- Use simple, clear language for 3+ and 6+ age groups
- Respond like a real person would, with warmth, curiosity, and enthusiasm
"""

def get_ai_response(message, age, user_name="friend"):
    try:
        # Use OpenRouter API key from environment variable
        api_key = os.environ.get('OPENROUTER_API_KEY')
        
        if not api_key:
            print("ERROR: OPENROUTER_API_KEY not set in environment!")
            return None
        
        if not api_key.startswith('sk-or-'):
            print(f"WARNING: API key format may be incorrect: {api_key[:10]}...")
            
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