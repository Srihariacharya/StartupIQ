import os
import requests
import random
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import google.generativeai as genai 

talent_bp = Blueprint('talent', __name__)

# --- CONFIGURATION ---
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-1.5-flash') 
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN") 

# --- FALLBACK DATA (Safety Net if GitHub API fails) ---
MOCK_DEVELOPERS = [
    {"name": "Aditya Verma", "role": "Full Stack Dev", "skills": ["React", "Node.js", "India"], "bio": "Building scalable SaaS in Bangalore.", "avatar": "https://avatars.githubusercontent.com/u/101?v=4", "linkedin": "https://github.com"},
    {"name": "Sneha Kapoor", "role": "Frontend Engineer", "skills": ["React", "Tailwind", "India"], "bio": "UI/UX enthusiast and Open Source contributor.", "avatar": "https://avatars.githubusercontent.com/u/102?v=4", "linkedin": "https://github.com"},
    {"name": "Rahul Sharma", "role": "Backend Architect", "skills": ["Python", "Django", "India"], "bio": "Pythonista improving API performance.", "avatar": "https://avatars.githubusercontent.com/u/103?v=4", "linkedin": "https://github.com"},
]

@talent_bp.route('/search_talent', methods=['POST', 'OPTIONS'])
@cross_origin()
def search_talent():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        query = data.get('skill') or "Developer"
        page = data.get('page', 1)
        
        # 1. Prepare GitHub API
        clean_query = query.replace(',', ' ')
        github_query = f"{clean_query} location:India type:user"
        url = f"https://api.github.com/search/users?q={github_query}&per_page=50&page={page}"
        
        headers = {'Accept': 'application/vnd.github.v3+json'}
        if GITHUB_TOKEN:
            headers['Authorization'] = f'token {GITHUB_TOKEN}'
        
        print(f"🔍 Searching GitHub for: {github_query}")
        
        try:
            response = requests.get(url, headers=headers, timeout=5)
        except:
            print("⚠️ GitHub Connection Failed. Using Mock Data.")
            return jsonify(MOCK_DEVELOPERS), 200

        if response.status_code != 200:
            print(f"⚠️ GitHub API Error ({response.status_code}). Switching to Mock Data.")
            return jsonify(MOCK_DEVELOPERS), 200

        github_items = response.json().get('items', [])
        formatted_users = []
        
        # 3. Filter for High Quality Profiles
        for item in github_items:
            if len(formatted_users) >= 9:
                break

            try:
                # Fetch detailed profile
                details_resp = requests.get(item['url'], headers=headers, timeout=3)
                if details_resp.status_code == 200:
                    user_details = details_resp.json()
                    real_name = user_details.get('name')
                    bio = user_details.get('bio')
                    
                    # STRICT FILTER: Must have a real name with a space (e.g., "Amit Patel")
                    if real_name and ' ' in real_name:
                        formatted_users.append({
                            "name": real_name,
                            "role": f"{query} Developer", 
                            "skills": [query, "Open Source", "India"], 
                            "bio": bio if bio else f"Top {query} Developer from India",
                            "avatar": item['avatar_url'],
                            "linkedin": item['html_url'] # Using GitHub Link as Profile
                        })
            except:
                continue 

        # If strict filter returned too few results, fill with mock data
        if len(formatted_users) < 3:
            print("⚠️ Found few candidates. Appending mock data.")
            formatted_users.extend(MOCK_DEVELOPERS[:3])

        return jsonify(formatted_users), 200

    except Exception as e:
        print(f"❌ Server Error: {e}")
        return jsonify(MOCK_DEVELOPERS), 200

@talent_bp.route('/analyze_fit', methods=['POST', 'OPTIONS'])
@cross_origin()
def analyze_fit():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    try:
        data = request.get_json()
        founder_skills = data.get('founder_skills', '')
        candidate_skills = data.get('candidate_skills', '')
        
        prompt = f"""
        Act as a Technical Recruiter.
        Founder Skills: {founder_skills}.
        Candidate Skills: {candidate_skills}.
        
        Analyze compatibility in exactly 1 short sentence. 
        Start with "High Match:", "Medium Match:", or "Low Match:".
        """
        response = model.generate_content(prompt)
        return jsonify({"analysis": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500