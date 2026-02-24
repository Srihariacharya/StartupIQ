from flask import Blueprint, request, jsonify
from google import genai  # Modern 2026 SDK
import os
import json
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv(override=True)

market_bp = Blueprint('market', __name__)

# --- CONFIGURATION ---
api_key = os.getenv("GEMINI_API_KEY")

# Initialize the new Client
# The client will automatically use the API key for all requests in this blueprint
client = None
if api_key:
    client = genai.Client(api_key=api_key)

# We use Flash-Lite for better speed and higher daily limits
MODEL_ID = "gemini-2.5-flash-lite"

@market_bp.route('/analyze_market', methods=['POST'])
def analyze_market():
    try:
        if not client:
            return jsonify({"error": "AI Client not initialized. Check your API Key."}), 500

        data = request.get_json()
        industry = data.get('industry')

        if not industry:
            return jsonify({"error": "Industry is required"}), 400

        # --- PROMPT FOR STARTUP-IQ ANALYTICS ---
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
        """

        # --- CALL NEW GENERATE METHOD ---
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt
        )

        # Gemini often wraps JSON in markdown blocks like ```json ... ```
        response_text = response.text
        clean_text = response_text.replace("```json", "").replace("```", "").strip()
        
        market_data = json.loads(clean_text)

        return jsonify(market_data), 200

    except Exception as e:
        print(f"❌ Market Analysis Error: {e}")
        return jsonify({"error": str(e)}), 500