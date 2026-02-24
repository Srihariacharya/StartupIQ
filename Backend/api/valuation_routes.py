from flask import Blueprint, request, jsonify
from google import genai  # Modern 2026 SDK
import os
import json
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv(override=True)

valuation_bp = Blueprint('valuation', __name__)

# --- CONFIGURATION ---
api_key = os.getenv("GEMINI_API_KEY")

# Initialize the new Client
client = None
if api_key:
    client = genai.Client(api_key=api_key)

# Using Flash-Lite for speed and high daily request limits (1,000+ RPD)
MODEL_ID = "gemini-2.5-flash-lite"

@valuation_bp.route('/calculate_valuation', methods=['POST'])
def calculate_valuation():
    try:
        if not client:
            return jsonify({"error": "AI Client not initialized"}), 500

        data = request.get_json()
        
        # Gathering startup details for the AI to process
        startup_details = {
            "revenue": data.get('revenue', 0),
            "users": data.get('users', 0),
            "growth_rate": data.get('growth_rate', '0%'),
            "industry": data.get('industry', 'General Tech')
        }

        prompt = f"""
        Act as a Venture Capital Analyst. 
        Calculate an estimated valuation for a startup in the {startup_details['industry']} sector 
        with ${startup_details['revenue']} annual revenue, {startup_details['users']} users, 
        and a {startup_details['growth_rate']} growth rate.

        Return ONLY a JSON object with:
        1. "estimated_valuation": A string (e.g. "$5M - $7M").
        2. "multiples_used": The industry multiple applied.
        3. "confidence_score": A percentage.
        4. "key_factors": List of 3 reasons for this valuation.
        """

        # --- CALL NEW GENERATE METHOD ---
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt
        )

        # Clean and parse the AI response
        response_text = response.text
        clean_text = response_text.replace("```json", "").replace("```", "").strip()
        valuation_data = json.loads(clean_text)

        return jsonify(valuation_data), 200

    except Exception as e:
        print(f"❌ Valuation Error: {e}")
        return jsonify({"error": str(e)}), 500