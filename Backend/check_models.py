import requests
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"🔑 Checking available models for Key: {api_key[:10]}...")

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

try:
    response = requests.get(url)
    data = response.json()
    
    if 'models' in data:
        print("\n✅ AVAILABLE MODELS FOR YOU:")
        print("--------------------------------")
        found_any = False
        for m in data['models']:
            # We only care about models that can generate text
            if 'generateContent' in m.get('supportedGenerationMethods', []):
                print(f"👉 {m['name']}")
                found_any = True
        
        if not found_any:
            print("⚠️ No text-generation models found! You might need to enable the API in Google Cloud Console.")
            
    else:
        print(f"\n❌ ERROR: {data}")

except Exception as e:
    print(f"Connection Failed: {e}")