import os
import requests
from flask import Blueprint, request, jsonify
import google.generativeai as genai 

talent_bp = Blueprint('talent', __name__)

# --- CONFIGURATION ---
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-flash-latest') 
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN") 

@talent_bp.route('/search_talent', methods=['POST'])
def search_talent():
    try:
        data = request.get_json()
        query = data.get('skill') or "Developer"
        page = data.get('page', 1)
        
        # Clean query
        clean_query = query.replace(',', ' ')
        
        # 1. Search for MANY results (fetch 50 to ensure we find good ones)
        # We search for "location:India" to get Indian users
        github_query = f"{clean_query} location:India type:user"
        
        # Note: We fetch 50 results per page to have enough candidates to filter
        url = f"https://api.github.com/search/users?q={github_query}&per_page=50&page={page}"
        
        headers = {'Accept': 'application/vnd.github.v3+json'}
        if GITHUB_TOKEN:
            headers['Authorization'] = f'token {GITHUB_TOKEN}'
        
        print(f"🔍 Searching GitHub (Strict Filter Mode): {github_query}")
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            return jsonify({"error": "GitHub API Error"}), 500

        github_items = response.json().get('items', [])
        
        formatted_users = []
        
        # 2. THE QUALITY FILTER LOOP
        for item in github_items:
            # Stop if we have found 9 perfect candidates
            if len(formatted_users) >= 9:
                break

            # Fetch detailed profile to check the Real Name
            try:
                details_resp = requests.get(item['url'], headers=headers)
                if details_resp.status_code == 200:
                    user_details = details_resp.json()
                    real_name = user_details.get('name')
                    bio = user_details.get('bio')
                    
                    # --- STRICT FILTER RULES ---
                    # 1. Name must exist
                    # 2. Name must have a space (e.g. "Rahul Sharma") -> Avoids "Coder123"
                    if real_name and ' ' in real_name:
                        formatted_users.append({
                            "name": real_name,  # REAL Name (e.g. "Aditya Verma")
                            "role": "Full Stack Developer", 
                            "skills": [query, "Open Source", "India"], 
                            "bio": bio if bio else f"Top {query} Developer from India",
                            "avatar": item['avatar_url'], # Real Photo
                            "linkedin": item['html_url']  # Real Profile Link
                        })
            except:
                continue # Skip if error
        
        return jsonify(formatted_users), 200

    except Exception as e:
        print(f"Search Error: {e}")
        return jsonify([]), 500

@talent_bp.route('/analyze_fit', methods=['POST'])
def analyze_fit():
    try:
        data = request.get_json()
        founder_skills = data.get('founder_skills', '')
        candidate_skills = data.get('candidate_skills', '')
        
        prompt = f"""
        Act as a Team Expert.
        Me: {founder_skills}.
        Candidate: {candidate_skills}.
        Analyze compatibility.
        Output: 1 sentence.
        """
        response = model.generate_content(prompt)
        return jsonify({"analysis": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500