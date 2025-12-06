from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

mongo_client = None
db = None

def get_db():
    global mongo_client, db
    if db is None:
        try:
            uri = os.getenv("MONGO_URI")
            mongo_client = MongoClient(uri)
            db = mongo_client.get_database("startup_db")
            print("Connected to MongoDB successfully!")
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            db = None
    return db