from flask import Flask
from flask_cors import CORS
from api.analyzer_routes import analyzer_bp
from api.generator_routes import generator_bp  
from database.connection import get_db
from api.talent_routes import talent_bp
from api.market_routes import market_bp
from api.brand_routes import brand_bp

app = Flask(__name__)

# Allow CORS for all domains on all routes
CORS(app, resources={r"/*": {"origins": "*"}})

get_db()

# Register Blueprints
app.register_blueprint(analyzer_bp, url_prefix='/api')
app.register_blueprint(generator_bp, url_prefix='/api') 
app.register_blueprint(talent_bp, url_prefix='/api')
app.register_blueprint(market_bp, url_prefix='/api')
app.register_blueprint(brand_bp, url_prefix='/api')

@app.route('/')
def home():
    return "StartupIQ Backend is Running! 🚀"

if __name__ == '__main__':
    app.run(debug=True, port=5000)