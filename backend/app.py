from flask import Flask
from flask_cors import CORS
from models import db
from routes.auth import auth_bp
from routes.products import products_bp
from routes.orders import orders_bp
from routes.users import users_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///restaurant.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app, origins=['http://localhost:5173'], supports_credentials=True)

db.init_app(app)

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(orders_bp, url_prefix='/api/orders')
app.register_blueprint(users_bp, url_prefix='/api/users')

with app.app_context():
    db.create_all()
    # Seed admin user if not exists
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
        print("Admin user created: username=admin, password=admin123")

if __name__ == '__main__':
    app.run(debug=True, port=5000)