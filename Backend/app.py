from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# --- 1. NEW DATABASE IMPORTS ---
from database.db import db
from database.models import StartupAnalysis # Importing this ensures the table is created!

# --- 2. BLUEPRINT IMPORTS ---
from api.analyzer_routes import analyzer_bp
from api.generator_routes import generator_bp
from api.talent_routes import talent_bp
from api.market_routes import market_bp
from api.valuation_routes import valuation_bp

# Load environment variables
load_dotenv(override=True)

app = Flask(__name__)

# --- 3. CORS CONFIGURATION ---
CORS(app, resources={r"/*": {"origins": "*"}})

# --- 4. DATABASE CONFIGURATION (PostgreSQL / SQLite) ---
# Default to SQLite for local development (no setup required)
# In production, this will read your PostgreSQL URL from the .env file
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///startup_iq.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the DB with the app
db.init_app(app)

# Create Tables automatically if they don't exist
with app.app_context():
    try:
        db.create_all()
        print("✅ SQL Database connected & tables created.")
    except Exception as e:
        print(f"❌ Database error: {e}")

# --- 5. REGISTER BLUEPRINTS ---
app.register_blueprint(analyzer_bp, url_prefix='/api')
app.register_blueprint(generator_bp, url_prefix='/api') 
app.register_blueprint(talent_bp, url_prefix='/api')
app.register_blueprint(market_bp, url_prefix='/api')
app.register_blueprint(valuation_bp, url_prefix='/api')

# --- 6. HEALTH CHECK ---
@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "project": "StartupIQ",
        "database": "PostgreSQL (via SQLAlchemy)",
        "message": "Backend is running smoothly! 🚀"
    })

# --- 7. ERROR HANDLING ---
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print(f"📡 StartupIQ Server starting on port {port}...")
    app.run(debug=True, host='0.0.0.0', port=port)