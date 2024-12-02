# Chat Frontend Application

A React.js-based frontend application that offers user authentication (Signup, Login, Logout), a chatbot interface, and conversation history management. Conversations are stored locally using `localStorage`, ensuring persistence across user sessions.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Project Structure](#project-structure)
6. [Components Overview](#components-overview)
7. [Data Storage](#data-storage)
8. [Styling](#styling)
9. [Future Enhancements](#future-enhancements)
10. [License](#license)

---

## Features

- **User Authentication**
  - **Signup**: Create a new account with a unique username and password.
  - **Login**: Access the chat interface using registered credentials.
  - **Logout**: Securely log out of the application.

- **Chat Interface**
  - **Send Messages**: Users can send messages to a simulated chatbot.
  - **Receive Responses**: The chatbot echoes user messages as responses.

- **Conversation Management**
  - **Multiple Conversations**: Create and manage multiple chat conversations.
  - **Conversation History**: View past conversations in a sidebar.
  - **Sidebar Toggle**: Open and close the conversation history sidebar using a dedicated button.

- **Data Persistence**
  - Conversations are stored in `localStorage`, ensuring data persists across sessions and is specific to each user.

---

## Technologies Used

- **React.js**: Frontend library for building user interfaces.
- **React Router DOM**: For client-side routing.
- **JavaScript (ES6+)**: Core programming language.
- **CSS**: Styling the application components.

---

## Installation

### Prerequisites

- **Node.js** (v14 or above)
- **npm** (v6 or above) or **yarn**

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/chat-frontend.git
   cd chat-frontend
   ```

2. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

---

## Usage

### Running the Development Server

Start the React development server:

Using npm:

```bash
npm start
```

Or using yarn:

```bash
yarn start
```

The application will automatically open in your default browser at `http://localhost:3000`. If it doesn't, navigate to this URL manually.

---

## Project Structure

```
aichatbot-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Chat.js
│   │   ├── ConversationItem.js
│   │   ├── ConversationList.js
│   │   ├── Login.js
│   │   ├── Sidebar.js
│   │   └── Signup.js
│   ├── App.css
│   ├── App.js
│   ├── index.css
│   └── index.js
├── .gitignore
├── package-lock.json
├── package.json
└── README-FRONTEND.md
```

---

## Components Overview

### Signup

- **Purpose**: Allows new users to create an account by providing a unique username and password.
- **Functionality**:
  - Collects user credentials.
  - Stores user data in `localStorage`.
  - Redirects to the Login page upon successful signup.

### Login

- **Purpose**: Enables existing users to authenticate and access the chat interface.
- **Functionality**:
  - Validates user credentials against stored data in `localStorage`.
  - Stores the current user session in `localStorage`.
  - Redirects to the Chat interface upon successful login.

### Chat

- **Purpose**: Serves as the main interface for users to engage in conversations.
- **Functionality**:
  - Displays the active conversation.
  - Allows sending and receiving messages.
  - Manages multiple conversations.
  - Provides a logout option.

### Sidebar

- **Purpose**: Displays a list of all conversations and allows users to create new ones.
- **Functionality**:
  - Lists existing conversations.
  - Highlights the active conversation.
  - Includes a button to create new conversations.
  - Supports toggling visibility.

### ConversationList

- **Purpose**: Renders the list of all conversations within the Sidebar.
- **Functionality**:
  - Iterates over conversations and displays each as a ConversationItem.

### ConversationItem

- **Purpose**: Represents an individual conversation in the Sidebar.
- **Functionality**:
  - Displays the conversation name.
  - Highlights if it’s the currently active conversation.
  - Allows selection of the conversation to view its messages.

---

## Data Storage

### User Information

- **Signup**: User credentials (username and password) are stored in `localStorage` under the `users` key as an array of user objects.
  
  ```json
  [
    {
      "username": "john_doe",
      "password": "securepassword"
    }
    // ...other users
  ]
  ```

- **Login**: Upon successful authentication, the current user's information is stored under the `currentUser` key.
  
  ```json
  {
    "username": "john_doe",
    "password": "securepassword"
  }
  ```

### Conversations

- **Per-User Storage**: Conversations are stored in `localStorage` with keys unique to each user, following the pattern `conversations_{username}`.
  
  ```json
  // Example key: conversations_john_doe
  [
    {
      "id": 1617981373000,
      "name": "Conversation 1",
      "messages": [
        { "sender": "user", "text": "Hello" },
        { "sender": "bot", "text": "You said: Hello" }
      ]
    }
    // ...other conversations
  ]
  ```

- **Creating Conversations**: New conversations are added to the beginning of the user's conversation array, ensuring easy access and organization.

- **Message Handling**: Messages are appended to the respective conversation's `messages` array, maintaining a history of interactions.

### Data Persistence

- **Upon Login**: The application retrieves conversations specific to the logged-in user from `localStorage` and loads them into the application's state.

- **Upon Logout**: The `currentUser` key is removed from `localStorage`, but individual user conversations remain intact, allowing them to be accessed upon subsequent logins.

---

## Styling

### CSS File

**File:** `src/App.css`

**Description:** Contains styles for the entire application, ensuring a clean and responsive user interface.

**Highlights:**

- **Authentication Forms**: Centered forms with clean input fields and buttons.
- **Chat Interface**: Flexbox layout for sidebar and main chat area.
- **Sidebar**: Dark-themed with clear separation of conversation items.
- **Messages**: Distinct styling for user and bot messages for clarity.
- **Responsive Design**: Ensures usability across various device sizes.

---

## Future Enhancements

1. **Backend Integration**
   - **Secure Authentication**: Move user authentication to a secure backend, avoiding storing sensitive information like passwords in `localStorage`.
   - **Persistent Storage**: Store conversations and user data on the server to ensure data persistence across different devices and browsers.

2. **Enhanced UI/UX**
   - **Styling Frameworks**: Integrate libraries like **Material-UI**, **Ant Design**, or **Tailwind CSS** for a more polished look.
   - **Responsive Design**: Further improve responsiveness for various device sizes.
   - **Animations**: Add animations for smoother user interactions.

3. **Chatbot Integration**
   - **Real Chatbot API**: Replace the simulated echo bot with a real chatbot API (e.g., OpenAI's GPT, Dialogflow).
   - **Natural Language Processing**: Enhance chatbot responses with advanced NLP capabilities.

4. **State Management**
   - **Context API or Redux**: For more efficient state management, especially as the application scales.

5. **Security Improvements**
   - **Password Hashing**: Ensure passwords are hashed before storage (move to backend for secure handling).
   - **Token-Based Authentication**: Use tokens (like JWT) for managing user sessions securely.

6. **User Profile Management**
   - **Profile Editing**: Allow users to edit their profiles.
   - **Avatar Uploads**: Enable users to upload profile pictures.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For any questions, suggestions, or contributions, please reach out to [your-email@example.com](mailto:your-email@example.com).
