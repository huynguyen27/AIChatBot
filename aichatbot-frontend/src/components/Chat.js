// aichatbot-frontend/src/components/Chat.js
// The main chat interface where users can send messages and see responses from the chatbot (simulated).
// We'll update the Chat component to handle multiple conversations and manage the sidebar's visibility.
// By associating conversations with the current user, we ensure that each user has their own set of conversations. This prevents data from being mixed between different users and ensures persistence across sessions.
// Description: Main chat interface updated to handle renaming and deleting conversations.

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

function Chat() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Helper function to generate storage key based on username
  const getConversationsKey = (username) => `conversations_${username}`;

  // Load user and conversations from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      navigate("/login");
    } else {
      setCurrentUser(user);
      const conversationsKey = getConversationsKey(user.username);
      const savedConversations =
        JSON.parse(localStorage.getItem(conversationsKey)) || [];
      console.log("Loaded Conversations:", savedConversations); // Debug
      setConversations(savedConversations);
      if (savedConversations.length > 0) {
        setActiveConversationId(savedConversations[0].id);
      }
    }
  }, [navigate]);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (currentUser) {
      const conversationsKey = getConversationsKey(currentUser.username);
      console.log("Saving Conversations to:", conversationsKey, conversations); // Debug
      localStorage.setItem(conversationsKey, JSON.stringify(conversations));
    }
  }, [conversations, currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleSend = () => {
    if (input.trim() === "" || activeConversationId === null) return;

    const userMessage = { sender: "user", text: input };
    const botMessage = { sender: "bot", text: `You said: ${input}` };

    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === activeConversationId
          ? { ...conv, messages: [...conv.messages, userMessage, botMessage] }
          : conv
      )
    );

    setInput("");
  };

  const handleCreateConversation = () => {
    const newConversation = {
      id: Date.now(),
      name: `Conversation ${conversations.length + 1}`,
      messages: [],
    };
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversation.id);
  };

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    setIsSidebarOpen(true);
  };

  const handleRenameConversation = (id, newName) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === id ? { ...conv, name: newName } : conv
      )
    );
  };

  const handleDeleteConversation = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this conversation?"
    );
    if (confirmDelete) {
      setConversations((prevConversations) =>
        prevConversations.filter((conv) => conv.id !== id)
      );
      // If the deleted conversation was active, set a new active conversation
      if (id === activeConversationId && conversations.length > 1) {
        const newActive = conversations.find((conv) => conv.id !== id);
        setActiveConversationId(newActive ? newActive.id : null);
      } else if (id === activeConversationId) {
        setActiveConversationId(null);
      }
    }
  };

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="chat-container">
      {isSidebarOpen && (
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onCreateConversation={handleCreateConversation}
          onRenameConversation={handleRenameConversation}
          onDeleteConversation={handleDeleteConversation}
        />
      )}
      <div className="chat-main">
        <div className="chat-header">
          <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? "Hide" : "Show"} History
          </button>
          <h2>
            {activeConversation
              ? activeConversation.name
              : "No Conversation Selected"}
          </h2>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <div className="chat-messages">
          {activeConversation ? (
            activeConversation.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.sender === "user" ? "user" : "bot"}`}
              >
                <span>{msg.text}</span>
              </div>
            ))
          ) : (
            <p>Select or create a conversation to start chatting.</p>
          )}
        </div>
        {activeConversation && (
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
