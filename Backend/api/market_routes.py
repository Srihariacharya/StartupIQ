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

        # --- UPDATED PROMPT FOR RICHER CARDS ---
        prompt = f"""
        Act as a Senior Market Research Analyst.
        Analyze the current real-world market for the "{industry}" industry (focus on India and Global trends).
        
        Return STRICT JSON format with these exact keys:
        
        1. "summary": A 1-sentence executive summary.
        2. "growth_trend": List of 6 objects (2020-2025) format: {{"year": "202x", "market_size": number_in_billions}}.
        3. "sentiment_distribution": List of 3 objects (Positive, Neutral, Negative) summing to 100.
        
        4. "trending_startups_heatmap": 
           Identify 4 TRENDING startup concepts/opportunities in "{industry}".
           For each, provide:
           - "name": A catchy startup name or concept title.
           - "subtitle": What problem it solves (max 6 words).
           - "competition": "High", "Medium", or "Low".
           - "avgFunding": Estimated funding needed (e.g., "₹5Cr", "$1M").
           - "successRate": A number between 50-95.
           
        Example JSON Structure:
        {{
            "summary": "...",
            "growth_trend": [...],
            "sentiment_distribution": [...],
            "trending_startups_heatmap": [
                {{"name": "AgriDrone", "subtitle": "Drones for pesticide spraying", "competition": "Medium", "avgFunding": "₹2Cr", "successRate": 85}},
                ... (4 items total)
            ]
        }}
        """

        response = model.generate_content(prompt)
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        market_data = json.loads(clean_text)

        return jsonify(market_data), 200

    except Exception as e:
        print(f"Market Error: {e}")
        return jsonify({"error": str(e)}), 500