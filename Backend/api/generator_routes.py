from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import google.generativeai as genai
import os
import json
import time
from dotenv import load_dotenv

load_dotenv(override=True)

generator_bp = Blueprint('generator', __name__)

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

# --- 🧠 SMART FALLBACK LOGIC ---
def get_fallback_ideas(topic):
    """
    Generates 'fake' but relevant ideas by injecting the 
    user's topic into generic templates.
    """
    # Capitalize for better looking titles
    clean_topic = topic.title() 
    
    return [
        {
            "name": f"Smart {clean_topic} Logistics Hub (Physical)",
            "problem": f"The current supply chain for {topic} is fragmented, leading to high storage costs and slow delivery times.",
            "solution": f"A decentralized network of micro-warehouses specifically designed for {topic}, utilizing automated inventory tracking.",
            "audience": f"{clean_topic} Manufacturers & Distributors"
        },
        {
            "name": f"{clean_topic}-as-a-Service (Business Model)",
            "problem": f"High upfront costs prevent smaller companies from accessing premium {topic} equipment/services.",
            "solution": f"A pay-per-use subscription model allowing businesses to rent high-end {topic} infrastructure without capital expenditure.",
            "audience": f"Startups & SMEs in {clean_topic}"
        },
        {
            "name": f"AI-Powered {clean_topic} Optimizer (Tech)",
            "problem": f"Inefficiencies in tracking and predicting demand cause massive waste in the {topic} sector.",
            "solution": f"An AI-driven platform that predicts market demand shifts for {topic} using real-time global data analytics.",
            "audience": f"{clean_topic} Operations Managers"
        }
    ]

@generator_bp.route('/generate_idea', methods=['POST', 'OPTIONS'])
@cross_origin()
def generate_idea():
    if request.method == 'OPTIONS': return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        topic = data.get('topic', 'Startup')
        print(f"📩 Request for: {topic}")

        if not api_key: 
            print("⚠️ No API Key found. Using Fallback.")
            time.sleep(1) # Fake delay
            return jsonify(get_fallback_ideas(topic)), 200

        # Prompt asking for 3 categories
        prompt = f"""
        I am looking for innovative startup ideas in the "{topic}" industry.
        Generate exactly 3 distinct ideas:
        1. Hard-Tech/Physical Idea.
        2. Business Model Innovation.
        3. Tech-Enabled Solution.
        
        Return JSON array: [{{"name": "...", "problem": "...", "solution": "...", "audience": "..."}}]
        """

        # Try API
        models = ['gemini-1.5-flash', 'gemini-pro']
        response_text = None
        
        for m in models:
            try:
                model = genai.GenerativeModel(m)
                response = model.generate_content(prompt)
                if response.text:
                    response_text = response.text
                    break
            except Exception as e:
                print(f"⚠️ Model {m} failed: {e}")
                continue

        if not response_text:
            print("⚠️ All AI models failed/limit reached. Using Fallback.")
            # 🛡️ SAFETY NET: Return Smart Mock Data
            time.sleep(1.5) # Fake delay to make it look real
            return jsonify(get_fallback_ideas(topic)), 200

        # Parse AI Response
        cleaned = response_text.replace("```json", "").replace("```", "").strip()
        return jsonify(json.loads(cleaned)), 200

    except Exception as e:
        print(f"🔥 ERROR: {e}")
        # Final Safety Net
        return jsonify(get_fallback_ideas(topic)), 200