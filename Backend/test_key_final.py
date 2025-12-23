import requests
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

print(f"🔑 Testing Key: {api_key[:10]}... (using Direct HTTP)")

# We manually build the URL for the model
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"

headers = {'Content-Type': 'application/json'}
payload = {
    "contents": [{
        "parts": [{"text": "Hello, simply reply with 'Working!'"}]
    }]
}

try:
    response = requests.post(url, headers=headers, json=payload, timeout=10)
    
    if response.status_code == 200:
        print("\n✅ SUCCESS! Your API Key is GOOD.")
        print(f"🤖 Response: {response.json()['candidates'][0]['content']['parts'][0]['text']}")
        print("👉 You can run your Backend now. The previous 'Strict Flash' code I gave you uses this exact same method.")
        
    elif response.status_code == 429:
        print("\n❌ FAILED: Quota Exceeded (429).")
        print("👉 Your Key is valid, but it has zero requests left for today. You MUST get a new Key.")
        
    else:
        print(f"\n❌ FAILED: Error {response.status_code}")
        print(response.text)

except Exception as e:
    print(f"\n❌ Connection Error: {e}")