# database/models.py
from database.db import db
from datetime import datetime

class StartupAnalysis(db.Model):
    __tablename__ = 'startup_analysis'
    
    id = db.Column(db.Integer, primary_key=True)
    startup_name = db.Column(db.String(100), nullable=True)
    funding = db.Column(db.Float, default=0.0)
    market_size = db.Column(db.String(50), nullable=True)
    
    # This JSON column stores the entire AI output (score, recommendations, etc.)
    ai_result = db.Column(db.JSON, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.startup_name,
            "funding": self.funding,
            "result": self.ai_result,
            "date": self.created_at.isoformat()
        }

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at.isoformat()
        }