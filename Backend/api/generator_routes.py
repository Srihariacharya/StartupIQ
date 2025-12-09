from flask import Blueprint, request, jsonify
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

# Force reload .env to ensure key is picked up
load_dotenv(override=True)

generator_bp = Blueprint('generator', __name__)

# 1. Debug: Print Key Status (Don't print the full key for security)
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    print(f"✅ API Key loaded: {api_key[:5]}...")
    genai.configure(api_key=api_key)
else:
    print("❌ ERROR: GEMINI_API_KEY is missing in .env")

@generator_bp.route('/generate_idea', methods=['POST', 'OPTIONS'])
def generate_idea():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        topic = data.get('topic', '')

        print(f"📩 Received request for topic: {topic}")

        if not api_key:
            print("❌ Failure: No API Key")
            return jsonify({"error": "Server API Key configuration missing"}), 500

        # The Prompt
        prompt = f"""
        Generate 3 innovative startup ideas for: '{topic}'.
        Return ONLY a JSON array. Do not use Markdown.
        Format: [{{"name": "...", "problem": "...", "solution": "...", "audience": "..."}}]
        """

        # Use the newer, faster Flash model
        model = genai.GenerativeModel('gemini-flash-latest')
        response = model.generate_content(prompt)
        
        # 2. Debug: Check what AI actually sent back
        if not response.text:
            print("❌ AI returned empty response (Check Safety Settings)")
            return jsonify({"error": "AI returned no content"}), 500
            
        print("🤖 AI Response Raw:", response.text[:100]) # Print first 100 chars

        # Cleanup text
        cleaned_text = response.text.strip()
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text.replace("```json", "").replace("```", "")
        
        # Validate JSON
        try:
            json_data = json.loads(cleaned_text)
            return jsonify(json_data), 200
        except json.JSONDecodeError:
            print("❌ JSON Parse Error. AI returned invalid JSON.")
            return jsonify({"error": "Failed to parse AI response"}), 500

    except Exception as e:
        print(f"🔥 CRITICAL ERROR: {str(e)}")
        return jsonify({"error": str(e)}), 500