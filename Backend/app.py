from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# --- 1. DATABASE IMPORTS ---
from database.db import db
from database.models import StartupAnalysis, User

# --- 2. BLUEPRINT IMPORTS ---
from api.analyzer_routes import analyzer_bp
from api.generator_routes import generator_bp
from api.talent_routes import talent_bp
from api.market_routes import market_bp
from api.valuation_routes import valuation_bp
from api.auth_routes import auth_bp
from api.competitor_routes import competitor_bp
from api.canvas_routes import canvas_bp
from api.share_routes import share_bp

# Load environment variables
load_dotenv(override=True)

app = Flask(__name__)

# --- 3. CORS CONFIGURATION ---
CORS(app, resources={r"/*": {"origins": "*"}})

# --- 4. DATABASE CONFIGURATION (PostgreSQL / SQLite) ---
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///startup_iq.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'startup_iq_dev_secret_key_must_be_changed_in_prod')

# Initialize the DB with the app
db.init_app(app)

# Create Tables automatically if they don't exist
with app.app_context():
    try:
        db.create_all()
        print("[OK] SQL Database connected & tables created.")
    except Exception as e:
        print(f"[ERROR] Database error: {e}")

# --- 5. REGISTER BLUEPRINTS ---
app.register_blueprint(analyzer_bp, url_prefix='/api')
app.register_blueprint(generator_bp, url_prefix='/api') 
app.register_blueprint(talent_bp, url_prefix='/api')
app.register_blueprint(market_bp, url_prefix='/api')
app.register_blueprint(valuation_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(competitor_bp, url_prefix='/api')
app.register_blueprint(canvas_bp, url_prefix='/api')
app.register_blueprint(share_bp, url_prefix='/api')

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
    print(f"[SERVER] StartupIQ Server starting on port {port}...")
    app.run(debug=True, host='0.0.0.0', port=port)