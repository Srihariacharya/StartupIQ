from flask import Flask
from flask_cors import CORS
from api.analyzer_routes import analyzer_bp
from database.connection import get_db

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

get_db()

app.register_blueprint(analyzer_bp, url_prefix='/api')

@app.route('/')
def home():
    return "StartupIQ Backend is Running! 🚀"

if __name__ == '__main__':
    app.run(debug=True, port=5000)