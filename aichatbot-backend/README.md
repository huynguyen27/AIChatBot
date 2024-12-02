# AI Chatbot Backend

A Flask-based backend API for an AI chatbot application with user authentication, conversation management, and user status tracking.

## Features
- User authentication (signup/login)
- User status tracking (online/offline)
- Conversation management (create/read/update/delete)
- Message handling with simulated bot responses
- SQLite database (configurable for PostgreSQL)
- Session-based authentication
- User activity tracking (login/logout times)

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

## Installation & Setup

1. Clone the repository and create virtual environment:
```bash
cd chatbot-backend
python -m venv venv
venv\Scripts\activate  # On Windows
source venv/bin/activate  # On macOS/Linux
```

2. Install dependencies:
```bash
python -m pip install flask flask-sqlalchemy flask-migrate flask-login python-dotenv flask-cors
```

3. Initialize database:
```bash
python -m flask db init
python -m flask db migrate -m "Initial migration"
python -m flask db upgrade
```

4. Run the application:
```bash
python -m flask run
```

## API Documentation

### 1. Test API
```
GET /api/test
Response: {
    "message": "Server is running"
}
```

### 2. Authentication APIs

#### Register New User
```
POST /api/signup
Request Body: {
    "username": "string",
    "password": "string"
}
Response: {
    "message": "User created successfully",
    "user_id": integer
}
Error Response: {
    "error": "Username already exists"
} (400)
```

#### Login
```
POST /api/login
Request Body: {
    "username": "string",
    "password": "string"
}
Response: {
    "message": "Login successful",
    "user": {
        "id": integer,
        "user_id": integer,
        "username": "string"
    }
}
Error Response: {
    "error": "Invalid username or password"
} (401)
```

#### Logout
```
POST /api/logout/{user_id}
URL Parameters: user_id (integer)
Response: {
    "message": "User {user_id} logged out successfully"
}
Error Response: {
    "error": "Cannot logout different user"
} (403)
```

#### Get User Status List
```
GET /api/users/status
Response: {
    "users": [
        {
            "user_id": integer,
            "username": "string",
            "status": "Online" | "Offline",
            "last_login": "datetime string",
            "last_logout": "datetime string"
        }
    ]
}
```

### 3. Conversation APIs

#### Get All Conversations
```
GET /api/conversations
Response: [
    {
        "id": integer,
        "name": "string",
        "messages": [
            {
                "id": integer,
                "sender": "user" | "bot",
                "text": "string",
                "created_at": "datetime string"
            }
        ]
    }
]
Authentication: Required
```

#### Create New Conversation
```
POST /api/conversations
Request Body: {
    "name": "string"
}
Response: {
    "id": integer,
    "name": "string"
}
Authentication: Required
```

#### Rename Conversation
```
PUT /api/conversations/{conversation_id}
URL Parameters: conversation_id (integer)
Request Body: {
    "name": "string"
}
Response: {
    "id": integer,
    "name": "string"
}
Authentication: Required
```

#### Delete Conversation
```
DELETE /api/conversations/{conversation_id}
URL Parameters: conversation_id (integer)
Response: 204 No Content
Authentication: Required
```

#### Send Message
```
POST /api/conversations/{conversation_id}/messages
URL Parameters: conversation_id (integer)
Request Body: {
    "text": "string"
}
Response: [
    {
        "id": integer,
        "sender": "user",
        "text": "string",
        "created_at": "datetime string"
    },
    {
        "id": integer,
        "sender": "bot",
        "text": "string",
        "created_at": "datetime string"
    }
]
Authentication: Required
```

## Common HTTP Status Codes
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## User Status Management
- Each user has a unique user_id assigned at registration
- System tracks login/logout status and timestamps
- User status can be monitored through the /api/users/status endpoint
- Login/logout times are stored in UTC

## Authentication Notes
- Session-based authentication using Flask-Login
- Sessions persist until explicit logout or server restart
- Each user can only logout their own session
- Login state is tracked in the database

## Database Schema
### User Table
- id: Primary Key
- user_id: Unique identifier
- username: Unique username
- password_hash: Hashed password
- is_logged_in: Boolean status
- last_login: Timestamp
- last_logout: Timestamp

### Conversation Table
- id: Primary Key
- name: Conversation name
- user_id: Foreign Key to User
- created_at: Timestamp

### Message Table
- id: Primary Key
- sender: "user" or "bot"
- text: Message content
- conversation_id: Foreign Key to Conversation
- created_at: Timestamp
