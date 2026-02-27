from flask import Blueprint, request, jsonify, current_app
from database.db import db
from database.models import User
import jwt
import datetime
from functools import wraps
import bcrypt

auth_bp = Blueprint('auth_bp', __name__)

# --- DECORATOR: PROTECT ROUTES ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Check in the headers for 'Authorization: Bearer <token>'
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if len(auth_header.split(" ")) == 2:
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'error': 'Token is missing!'}), 401

        try:
            # Note: you should ideally use a secret key from environment variables (e.g., current_app.config['SECRET_KEY'])
            # For simplicity, we are using a hardcoded secret if not available
            secret = current_app.config.get('SECRET_KEY', 'startup_iq_super_secret_key_123')
            data = jwt.decode(token, secret, algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
            if not current_user:
                 return jsonify({'error': 'User not found!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

# --- 1. SIGNUP API ---
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json

    if not data or not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields (name, email, password)'}), 400

    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'User with this email already exists'}), 409

    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    new_user = User(
        name=data['name'],
        email=data['email'],
        password_hash=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully!', 'user': new_user.to_dict()}), 201


# --- 2. LOGIN API ---
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json

    if not data or not data.get('email') or not data.get('password'):
         return jsonify({'error': 'Missing email or password'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user:
        return jsonify({'error': 'Invalid email or password'}), 401

    if bcrypt.checkpw(data['password'].encode('utf-8'), user.password_hash.encode('utf-8')):
        secret = current_app.config.get('SECRET_KEY', 'startup_iq_super_secret_key_123')
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7) # Token expires in 7 days
        }, secret, algorithm="HS256")

        return jsonify({'token': token, 'user': user.to_dict()}), 200

    return jsonify({'error': 'Invalid email or password'}), 401


# --- 3. GET CURRENT USER (Protected) ---
@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({'user': current_user.to_dict()}), 200
