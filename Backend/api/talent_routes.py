import os
import requests
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from dotenv import load_dotenv

load_dotenv()
talent_bp = Blueprint('talent', __name__)

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

@talent_bp.route('/search_talent', methods=['POST', 'OPTIONS'])
@cross_origin()
def search_talent():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    try:
        data = request.get_json()
        query = data.get('skill') or "Developer"
        
        # 1. SEARCH CONFIGURATION
        # We limit to 5 results to save your Rate Limit quota
        url = f"https://api.github.com/search/users?q={query} location:India&per_page=5"
        
        headers = {'Accept': 'application/vnd.github.v3+json'}
        if GITHUB_TOKEN:
            headers['Authorization'] = f'token {GITHUB_TOKEN}'

        print(f"🔍 Searching GitHub for: {query}")

        # 2. EXECUTE SEARCH
        response = requests.get(url, headers=headers, timeout=10)

        # 3. HANDLE ERRORS GRACEFULLY (Don't crash the frontend)
        if response.status_code == 403:
            print("❌ Rate Limit Hit! (Add a Token to fix this)")
            return jsonify([]), 200 # Return empty list so frontend doesn't show alert
            
        if response.status_code != 200:
            print(f"⚠️ API Error: {response.status_code}")
            return jsonify([]), 200

        # 4. PROCESS RESULTS
        users = []
        items = response.json().get('items', [])

        for item in items:
            try:
                # Fetch details (Name, Bio)
                details = requests.get(item['url'], headers=headers, timeout=5).json()
                
                # Only add if they have a real name
                if details.get('name'):
                    users.append({
                        "name": details.get('name'),
                        "role": f"{query} Developer",
                        "skills": [query, "India"],
                        "bio": details.get('bio') or "No bio available.",
                        "avatar": item['avatar_url'],
                        "linkedin": item['html_url'] # Points to REAL Profile
                    })
            except:
                continue

        return jsonify(users), 200

    except Exception as e:
        print(f"SERVER ERROR: {e}")
        return jsonify([]), 200 # Return empty list on crash