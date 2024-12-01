# AI Chatbot Backend

A Flask-based backend API for an AI chatbot application with user authentication and conversation management.

## Features
- User authentication (signup/login)
- Conversation management (create/read/update/delete)
- Message handling with simulated bot responses
- SQLite database (can be configured for PostgreSQL)
- Database migrations using Flask-Migrate
- Session-based authentication
- CORS support for frontend integration

## Project Structure
```
chatbot-backend/
│
├── .env                    # Environment variables
├── requirements.txt        # Project dependencies
├── config.py              # Configuration settings
├── run.py                 # Application entry point
│
├── app/
│   ├── __init__.py        # Flask application initialization
│   │
│   ├── models/            # Database models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── conversation.py
│   │   └── message.py
│   │
│   └── routes/            # API routes/endpoints
│       ├── __init__.py
│       ├── auth.py        # Authentication routes
│       └── chat.py        # Chat-related routes
```

## Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- SQLite (included with Python) or PostgreSQL

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd chatbot-backend
```

2. Create and activate virtual environment
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
source venv/bin/activate  # On macOS/Linux
```

3. Install dependencies
```bash
python -m pip install flask flask-sqlalchemy flask-migrate flask-login python-dotenv flask-cors
```

4. Create .env file
```
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///app.db
```

5. Initialize the database
```bash
python -m flask db init
python -m flask db migrate -m "Initial migration"
python -m flask db upgrade
```

6. Run the application
```bash
python -m flask run
```

The server will start at http://localhost:5000

## API Documentation

### Authentication Endpoints

#### Test Connection
```
GET /api/test
Response: {"message": "Server is running"}
```

#### Register User
```
POST /api/signup
Request: {
    "username": string,
    "password": string
}
Response: {"message": "User created successfully"}
```

#### Login
```
POST /api/login
Request: {
    "username": string,
    "password": string
}
Response: {
    "message": "Login successful",
    "user": {
        "id": integer,
        "username": string
    }
}
```

#### Logout
```
GET /api/logout
Response: {"message": "Logged out successfully"}
```

### Conversation Endpoints

#### Get All Conversations
```
GET /api/conversations
Response: [
    {
        "id": integer,
        "name": string,
        "messages": [
            {
                "id": integer,
                "sender": "user" | "bot",
                "text": string,
                "created_at": string
            }
        ]
    }
]
```

#### Create Conversation
```
POST /api/conversations
Request: {
    "name": string
}
Response: {
    "id": integer,
    "name": string
}
```

#### Rename Conversation
```
PUT /api/conversations/{conversation_id}
Request: {
    "name": string
}
Response: {
    "id": integer,
    "name": string
}
```

#### Delete Conversation
```
DELETE /api/conversations/{conversation_id}
Response: 204 No Content
```

#### Send Message
```
POST /api/conversations/{conversation_id}/messages
Request: {
    "text": string
}
Response: [
    {
        "id": integer,
        "sender": "user",
        "text": string,
        "created_at": string
    },
    {
        "id": integer,
        "sender": "bot",
        "text": string,
        "created_at": string
    }
]
```

## Database Management

The project uses Flask-Migrate for database migrations. Key commands:

```bash
# Create new migration
python -m flask db migrate -m "Migration description"

# Apply migrations
python -m flask db upgrade

# Rollback migration
python -m flask db downgrade
```

## Security Features
- Password hashing using Werkzeug Security
- Session-based authentication
- CORS protection
- SQL injection prevention through SQLAlchemy

## Error Handling
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Frontend Integration
The backend is configured to work with a React frontend. CORS is enabled with credentials support. Frontend developers should set:
```javascript
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
```

## Development Notes
- Currently using SQLite for development
- Can be configured to use PostgreSQL by updating DATABASE_URL in .env
- Debug mode is enabled by default
- Session lifetime is set to 30 minutes

## Future Improvements
- Add email verification
- Implement password reset functionality
- Add rate limiting
- Enhance bot responses
- Add user profiles
- Implement real-time chat using WebSocket
