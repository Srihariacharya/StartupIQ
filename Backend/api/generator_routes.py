from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from google import genai  # Updated library
import os
import json
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv(override=True)

generator_bp = Blueprint('generator', __name__)

# 1. Initialize Client (New SDK)
api_key = os.getenv("GEMINI_API_KEY")
client = None
if api_key:
    client = genai.Client(api_key=api_key)

# Using the high-limit lite model for 2026
MODEL_ID = "gemini-2.5-flash-lite"

# --- 🧠 SMART FALLBACK LOGIC ---
def get_fallback_ideas(topic):
    """Generates relevant ideas if the AI fails or quota is hit."""
    clean_topic = topic.title() if topic else "Startup"
    return [
        {
            "name": f"Smart {clean_topic} Logistics Hub",
            "problem": f"The current supply chain for {clean_topic} is fragmented.",
            "solution": f"A decentralized network of micro-warehouses for {clean_topic}.",
            "audience": f"{clean_topic} Manufacturers"
        },
        {
            "name": f"{clean_topic}-as-a-Service",
            "problem": f"High upfront costs prevent access to {clean_topic} services.",
            "solution": f"A subscription model for {clean_topic} infrastructure.",
            "audience": f"Startups in {clean_topic}"
        },
        {
            "name": f"AI-Powered {clean_topic} Optimizer",
            "problem": f"Inefficiencies in demand prediction in the {clean_topic} sector.",
            "solution": f"An AI platform that predicts market demand for {clean_topic}.",
            "audience": f"{clean_topic} Operations Managers"
        }
    ]

@generator_bp.route('/generate_idea', methods=['POST', 'OPTIONS'])
@cross_origin()
def generate_idea():
    if request.method == 'OPTIONS': 
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        topic = data.get('topic', 'Startup')
        print(f"📩 Request for Idea Generation: {topic}")

        # 2. Check for Client/API Key
        if not client:
            print("❌ No API Client initialized. Using Fallback.")
            return jsonify(get_fallback_ideas(topic)), 200

        # 3. Construct the Prompt (Asking for JSON Schema)
        prompt = f"""
        Act as a startup consultant. Generate exactly 3 innovative startup ideas in the "{topic}" industry.
        
        Categories:
        1. Hard-Tech/Physical Idea.
        2. Business Model Innovation.
        3. Tech-Enabled Solution.

        Return ONLY a valid JSON array of objects.
        Format:
        [
            {{"name": "Idea Name", "problem": "Statement", "solution": "Description", "audience": "Target"}}
        ]
        """

        print(f"⚡ ACTIVATING MODEL: {MODEL_ID} ⚡")

        # 4. Call Gemini 2.5 Flash-Lite
        try:
            # Using new generate_content syntax
            response = client.models.generate_content(
                model=MODEL_ID,
                contents=prompt
            )
            
            if not response.text:
                raise ValueError("Empty response from AI")

            response_text = response.text

        except Exception as e:
            print(f"⚠️ AI Model Failed: {e}")
            return jsonify(get_fallback_ideas(topic)), 200

        # 5. Clean and Parse Response
        # Removing potential markdown blocks if AI includes them
        cleaned_text = response_text.replace("```json", "").replace("```", "").strip()
        
        try:
            ideas_json = json.loads(cleaned_text)
            return jsonify(ideas_json), 200
        except json.JSONDecodeError:
            print("⚠️ Failed to parse AI JSON. Using Fallback.")
            return jsonify(get_fallback_ideas(topic)), 200

    except Exception as e:
        print(f"🔥 Critical Error: {e}")
        return jsonify(get_fallback_ideas(topic if 'topic' in locals() else 'Startup')), 200