import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv()

class Config:
    # Secret key for sessions and security
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-this'
    
    # Use SQLite instead of PostgreSQL
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
    
    # Disable tracking modifications
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Debug mode
    DEBUG = True
    
    # Session configuration
    SESSION_TYPE = 'filesystem'
    SESSION_PERMANENT = False
    PERMANENT_SESSION_LIFETIME = 1800  # 30 minutes
    
    # CORS settings
    CORS_HEADERS = 'Content-Type'
    
    # Additional Flask configurations
    JSON_SORT_KEYS = False
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max-limit