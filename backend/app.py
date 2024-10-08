import os
from flask import Flask, request, redirect, send_from_directory, render_template
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import generate_csrf
from flask_login import LoginManager
from models.db import db
from models.users import User
from api.user_routes import user_routes
from api.auth_routes import auth_routes
from seeds import seed_commands
from config import Config

app = Flask(__name__, static_folder='../frontend', static_url_path='/')

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.login'

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')

db.init_app(app)
Migrate(app, db)

# General CORS setup for all routes
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "http://127.0.0.1:5173"}})

# Redirect HTTP to HTTPS in production
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            return redirect(url, code=301)

# Inject CSRF token into cookies
@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get('FLASK_ENV') == 'production' else None,
        httponly=True  # Set to True for security
    )
    return response

@app.route('/api/docs')
def api_help():
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = {
        rule.rule: [
            [method for method in rule.methods if method in acceptable_methods],
            app.view_functions[rule.endpoint].__doc__
        ]
        for rule in app.url_map.iter_rules() if rule.endpoint != 'static'
    }
    return route_list

# Serve static files for the frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    if path == '' or path == 'index.html':
        return app.send_static_file('index.html')
    if path == 'favicon.ico':
        return send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run()
