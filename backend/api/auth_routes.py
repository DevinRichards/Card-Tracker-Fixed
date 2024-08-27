from flask import Blueprint, request, jsonify
from models.users import User, db
from forms.login_form import LoginForm
from forms.register_form import RegisterForm
from flask_login import current_user, login_user, logout_user, login_required
from flask_wtf.csrf import validate_csrf

auth_routes = Blueprint('auth', __name__)

@auth_routes.route('/login', methods=['POST', 'OPTIONS'])
def login():
    """
    Logs a user in and handles preflight requests
    """
    print(f"Received {request.method} request at /login")

    if request.method == 'OPTIONS':
        print("Handling OPTIONS preflight request")
        response = jsonify(success=True)
        response.headers.add("Access-Control-Allow-Origin", "http://127.0.0.1:5173")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, X-CSRFToken")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 200

    # Handle login request
    form = LoginForm()
    csrf_token = request.cookies.get('csrf_token')
    print(f"CSRF Token from cookies: {csrf_token}")
    form['csrf_token'].data = csrf_token

    # Validate CSRF token
    try:
        validate_csrf(form['csrf_token'].data)
        print("CSRF token validated successfully")
    except Exception as e:
        print(f"CSRF validation failed: {str(e)}")
        return jsonify({"error": "Invalid CSRF token"}), 400

    # Validate form and login user
    if form.validate_on_submit():
        print("Form validated successfully")
        user = User.query.filter(User.email == form.data['email']).first()
        if user:
            login_user(user)
            print(f"User {user.email} logged in successfully")
            return jsonify(user.to_dict())
        print("Invalid credentials")
        return jsonify({"error": "Invalid credentials"}), 401
    print(f"Form validation errors: {form.errors}")
    return form.errors, 401

@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    print("User logged out")
    logout_user()
    return {'message': 'User logged out'}

@auth_routes.route('/register', methods=['POST'])
def register():
    """
    Creates a new user and logs them in
    """
    print(f"Received {request.method} request at /register")
    form = RegisterForm()
    csrf_token = request.cookies.get('csrf_token')
    print(f"CSRF Token from cookies: {csrf_token}")
    form['csrf_token'].data = csrf_token

    # Validate CSRF token
    try:
        validate_csrf(form['csrf_token'].data)
        print("CSRF token validated successfully")
    except Exception as e:
        print(f"CSRF validation failed: {str(e)}")
        return jsonify({"error": "Invalid CSRF token"}), 400

    # Validate form and register user
    if form.validate_on_submit():
        print("Form validated successfully")
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            password=form.data['password']
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        print(f"User {user.email} registered and logged in successfully")
        return jsonify(user.to_dict())
    print(f"Form validation errors: {form.errors}")
    return form.errors, 401

@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    print("Unauthorized access attempt")
    return {'errors': {'message': 'Unauthorized'}}, 401
