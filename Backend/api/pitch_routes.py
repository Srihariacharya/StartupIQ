import os
import json
import google.generativeai as genai
from flask import Blueprint, request, jsonify

pitch_bp = Blueprint('pitch', __name__)

# --- CONFIGURATION ---
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-flash-latest')

@pitch_bp.route('/generate_pitch', methods=['POST'])
def generate_pitch():
    try:
        data = request.get_json()
        idea = data.get('idea')
        
        if not idea:
            return jsonify({"error": "Startup idea is required"}), 400

        # Prompt Gemini to generate a 10-slide deck structure
        prompt = f"""
        Act as a Venture Capital Consultant. 
        Create a 10-slide Pitch Deck structure for this startup idea: "{idea}".
        
        For EACH slide, provide:
        1. "title": The Title of the slide (e.g., The Problem, The Solution).
        2. "content": A bulleted list (array of strings) of key points for that slide.
        
        Return STRICT JSON format:
        [
            {{"title": "The Problem", "content": ["Current solutions are slow", "Users waste 5 hours a week"]}},
            ...
        ]
        """

        response = model.generate_content(prompt)
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        slides = json.loads(clean_text)

        return jsonify(slides), 200

    except Exception as e:
        print(f"Pitch Deck Error: {e}")
        return jsonify({"error": str(e)}), 500