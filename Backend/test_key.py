import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"🔑 Testing Key: {api_key[:10]}...") 

try:
    genai.configure(api_key=api_key)
    # We specifically test the Free Model
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content("Hello, are you working?")
    
    print("\n✅ SUCCESS! The API Key is working.")
    print(f"🤖 AI Replied: {response.text}")

except Exception as e:
    print("\n❌ FAILED! Your API Key is broken.")
    print(f"⚠️ Error Message: {e}")