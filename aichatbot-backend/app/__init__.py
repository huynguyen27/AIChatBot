from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_cors import CORS
import logging
from config import Config

# Set up logging
logging.basicConfig(level=logging.DEBUG)

db = SQLAlchemy()
migrate = Migrate()
login = LoginManager()
login.login_view = 'auth.login'

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.debug = True
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    login.init_app(app)
    
    # Configure CORS to handle cookies
    CORS(app, supports_credentials=True)
    
    # Add error handling
    @app.errorhandler(Exception)
    def handle_error(error):
        app.logger.error(f'An error occurred: {error}')
        return jsonify({'error': str(error)}), 500
    
    # Add a test route
    @app.route('/api/test', methods=['GET'])
    def test_route():
        return jsonify({'message': 'Server is running'})
    
    # Register blueprints
    from app.routes import auth, chat
    app.register_blueprint(auth.bp)
    app.register_blueprint(chat.bp)
    
    @login.user_loader
    def load_user(id):
        from app.models.user import User
        return User.query.get(int(id))
    
    # Add session interface
    @app.before_request
    def before_request():
        app.logger.debug('Processing request')

    @app.after_request
    def after_request(response):
        app.logger.debug('Processing response')
        return response
        
    return app

# Import models after db is defined
from app.models.user import User
from app.models.conversation import Conversation
from app.models.message import Message