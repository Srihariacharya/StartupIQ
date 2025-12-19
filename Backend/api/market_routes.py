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

        # --- UPDATED PROMPT FOR REAL DATA ---
        prompt = f"""
        Act as a Senior Market Research Analyst.
        Analyze the current real-world market for the "{industry}" industry (focus on India and Global trends).
        
        Return STRICT JSON format with these exact keys:
        
        1. "summary": A 1-sentence executive summary of the current market status.
        2. "growth_trend": A list of 6 objects representing market size history & forecast (2020-2025). Format: {{"year": "202x", "market_size": number_in_billions}}.
        3. "sentiment_distribution": A list of 3 objects for sentiment (Positive, Neutral, Negative). Total must match 100.
        
        4. "trending_startups_heatmap": 
           Identify 10 REAL, ACTUAL startups or key players currently active in the "{industry}" sector.
           Do NOT make up names. Use real companies (e.g., if EdTech: Byju's, Unacademy, PhysicsWallah, etc.).
           For each company, estimate:
           - "name": Real Company Name.
           - "size": Estimated Valuation or Funding Score (10-100).
           - "growth": Estimated YoY Growth % (-20 to +120).
           
        5. "top_competitors": List of 5 top competitors with estimated market share %.

        Example JSON Structure:
        {{
            "summary": "The EV market is booming with 40% YoY growth...",
            "growth_trend": [{{"year": "2020", "market_size": 20}}, ...],
            "sentiment_distribution": [{{"name": "Positive", "value": 70}}, ...],
            "trending_startups_heatmap": [
                {{"name": "RealCompany A", "size": 90, "growth": 45}},
                {{"name": "RealCompany B", "size": 60, "growth": 20}}
            ],
            "top_competitors": [...]
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