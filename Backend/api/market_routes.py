import os
import json
import google.generativeai as genai
from flask import Blueprint, request, jsonify

market_bp = Blueprint('market', __name__)

# --- CONFIGURATION ---
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-flash-latest')

@market_bp.route('/analyze_market', methods=['POST'])
def analyze_market():
    try:
        data = request.get_json()
        industry = data.get('industry')

        if not industry:
            return jsonify({"error": "Industry is required"}), 400

        # Prompt Gemini to generate JSON data for charts
        prompt = f"""
        Act as a Market Research Analyst.
        Generate realistic market trend data for the "{industry}" industry for the last 5 years (2020-2024) and forecast for 2025.
        
        Return STRICT JSON format with no markdown. The JSON must have these exact keys:
        
        1. "growth_trend": A list of 6 objects, each with "year" (string) and "market_size" (number in Billions).
        2. "sentiment_distribution": A list of objects for a Pie Chart: "Positive", "Neutral", "Negative" with values summing to 100.
        3. "top_competitors": A list of 5 objects with "name" and "market_share" (number).
        4. "summary": A 1-sentence summary of the market status.

        Example Format:
        {{
            "growth_trend": [
                {{"year": "2020", "market_size": 50}}, 
                {{"year": "2021", "market_size": 65}}
            ],
            "sentiment_distribution": [
                {{"name": "Positive", "value": 60}},
                {{"name": "Neutral", "value": 30}},
                {{"name": "Negative", "value": 10}}
            ],
            "top_competitors": [
                {{"name": "Company A", "market_share": 30}},
                {{"name": "Company B", "market_share": 20}}
            ],
            "summary": "The market is growing rapidly due to AI adoption."
        }}
        """

        response = model.generate_content(prompt)
        
        # Clean AI Output
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        market_data = json.loads(clean_text)

        return jsonify(market_data), 200

    except Exception as e:
        print(f"Market Error: {e}")
        return jsonify({"error": str(e)}), 500