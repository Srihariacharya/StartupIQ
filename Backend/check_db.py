# check_db.py
from app import app
from database.db import db
from database.models import StartupAnalysis

with app.app_context():
    # 1. Get all startups from the DB
    startups = StartupAnalysis.query.all()
    print(f"\nTotal Startups in DB: {len(startups)}")
    print("-" * 30)
    
    # 2. Print the details of the last one saved
    if startups:
        latest = startups[-1]
        print(f"ID: {latest.id}")
        print(f"Name: {latest.startup_name}")
        print(f"Funding: ₹{latest.funding:,.0f}")
        print(f"AI Score: {latest.ai_result.get('score')}%")
        print("-" * 30)
    else:
        print("Database is empty! Run an analysis first.")