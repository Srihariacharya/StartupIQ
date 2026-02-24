from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

# 1. Setup Client
api_key = os.getenv("GEMINI_API_KEY")
print(f"🔑 API Key Found: {'Yes' if api_key else 'NO'}")

if not api_key:
    print("❌ Error: GEMINI_API_KEY not found. Please check your .env file.")
    exit()

client = genai.Client(api_key=api_key)

# 2. Define Model Name (Flash-Lite)
# This model typically has higher rate limits for free tier usage
MODEL_ID = "gemini-2.5-flash-lite"

# 3. Test Generation
print(f"\n⚡ Testing {MODEL_ID}...")
try:
    response = client.models.generate_content(
        model=MODEL_ID,
        contents="Say 'Hello Srihari, I am Flash-Lite!' if you are working."
    )
    print(f"✅ SUCCESS: {response.text}")
except Exception as e:
    print(f"❌ FAILED: {e}")