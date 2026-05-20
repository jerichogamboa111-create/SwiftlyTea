import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from datetime import timedelta
from flask import Flask
from flask_cors import CORS
from models import db
from routes.auth import auth_bp
from routes.products import products_bp
from routes.orders import orders_bp
from routes.users import users_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'swiftlytea-super-secret-2024-xkq9'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://neondb_owner:npg_HnGy0gspb9Jq@ep-nameless-resonance-aq3y3wpv.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

CORS(app, origins=['https://swiftlytea.vercel.app'], supports_credentials=True)

db.init_app(app)

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(orders_bp, url_prefix='/api/orders')
app.register_blueprint(users_bp, url_prefix='/api/users')

with app.app_context():
    db.create_all()
    from models import User
    from werkzeug.security import generate_password_hash
    if not User.query.filter_by(username='admin').first():
        admin = User(
            username='admin',
            email='admin@restaurant.com',
            password=generate_password_hash('admin123'),
            role='admin'
        )
        db.session.add(admin)
        db.session.commit()
