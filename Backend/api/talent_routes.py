import os
import requests
from flask import Blueprint, request, jsonify
import google.generativeai as genai 

talent_bp = Blueprint('talent', __name__)

# --- CONFIGURATION ---
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-flash-latest') 
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN") # Optional: Add to .env for higher limits

# --- 1. GITHUB SEARCH (With Pagination & Multi-Skill Fix) ---
@talent_bp.route('/search_talent', methods=['POST'])
def search_talent():
    try:
        data = request.get_json()
        query = data.get('skill') or "Developer"
        page = data.get('page', 1) # Default to Page 1
        
        # FIX: Replace commas with spaces. 
        # "React, Python" -> "React Python" (GitHub treats space as AND)
        clean_query = query.replace(',', ' ')
        
        # Query: Keywords + Location India + Type User (Not Company)
        github_query = f"{clean_query} location:India type:user"
        
        # Add &page={page} to URL
        url = f"https://api.github.com/search/users?q={github_query}&per_page=9&page={page}"
        
        headers = {'Accept': 'application/vnd.github.v3+json'}
        if GITHUB_TOKEN:
            headers['Authorization'] = f'token {GITHUB_TOKEN}'
        
        print(f"🔍 Searching Page {page} for: {github_query}")
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            return jsonify({"error": "GitHub API limit reached."}), 500

        github_items = response.json().get('items', [])
        
        # Fetch Real Names
        formatted_users = []
        for item in github_items:
            # Quick fetch for real name (optional optimization: skip this if slow)
            try:
                details_resp = requests.get(item['url'], headers=headers)
                user_details = details_resp.json() if details_resp.status_code == 200 else {}
                display_name = user_details.get('name') or item['login']
                bio = user_details.get('bio') or "GitHub Developer from India"
            except:
                display_name = item['login']
                bio = "GitHub Developer"

            formatted_users.append({
                "name": display_name, 
                "role": "Full Stack Developer", # Inferred
                "skills": [query], 
                "bio": bio,
                "avatar": item['avatar_url'],
                "linkedin": item['html_url']
            })
        
        return jsonify(formatted_users), 200

    except Exception as e:
        print(f"Search Error: {e}")
        return jsonify([]), 500

# --- 2. AI COMPATIBILITY CHECK ---
@talent_bp.route('/analyze_fit', methods=['POST'])
def analyze_fit():
    try:
        data = request.get_json()
        founder_skills = data.get('founder_skills', '')
        candidate_skills = data.get('candidate_skills', '')
        
        prompt = f"""
        Act as a Hiring Expert.
        Me: {founder_skills}.
        Candidate: {candidate_skills}.
        
        Analyze compatibility.
        Format output:
        Score: [Number]%
        Reason: [1 Short Sentence]
        """
        response = model.generate_content(prompt)
        return jsonify({"analysis": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500