import os
import json
import random
import google.generativeai as genai
from flask import Blueprint, request, jsonify

brand_bp = Blueprint('brand', __name__)

# --- CONFIGURATION ---
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-flash-latest')

@brand_bp.route('/generate_brands', methods=['POST'])
def generate_brands():
    try:
        data = request.get_json()
        description = data.get('description')
        
        if not description:
            return jsonify({"error": "Description is required"}), 400

        # Prompt Gemini to generate creative names
        prompt = f"""
        Act as a Branding Expert.
        Generate 6 unique, modern, and catchy startup names for this business idea: "{description}".
        
        For each name, provide:
        1. "name": The startup name.
        2. "reason": A short 5-word explanation of why it's good.
        
        Return STRICT JSON format:
        [
            {{"name": "AgriTech", "reason": "Combines agriculture and technology."}},
            ...
        ]
        """

        response = model.generate_content(prompt)
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        names_list = json.loads(clean_text)

        # Add Simulated Domain Availability
        # We randomize this to look realistic for the demo
        results = []
        for item in names_list:
            # Randomly decide availability for .com, .in, .ai
            availability = {
                ".com": random.choice(["Available", "Taken"]),
                ".in": random.choice(["Available", "Taken"]),
                ".ai": "Available" # .ai is usually expensive but available
            }
            
            results.append({
                "name": item['name'],
                "reason": item['reason'],
                "domains": availability
            })

        return jsonify(results), 200

    except Exception as e:
        print(f"Brand Gen Error: {e}")
        return jsonify({"error": str(e)}), 500