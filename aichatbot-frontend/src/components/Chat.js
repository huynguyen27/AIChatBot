// aichatbot-frontend/src/components/Chat.js
// The main chat interface where users can send messages and see responses from the chatbot (simulated).
// We'll update the Chat component to handle multiple conversations and manage the sidebar's visibility.
// By associating conversations with the current user, we ensure that each user has their own set of conversations. This prevents data from being mixed between different users and ensures persistence across sessions.
// Description: Main chat interface updated to handle renaming and deleting conversations.
// Now, update the Chat component to interact with the backend instead of using localStorage. We'll fetch conversations from the backend, manage them via state, and handle CRUD operations through API calls.

import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function Chat() {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [error, setError] = useState("");

  // Fetch conversations from backend on mount
  useEffect(() => {
    if (auth) {
      fetchConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get("/api/conversations");
      setConversations(response.data);
      if (response.data.length > 0) {
        setActiveConversationId(response.data[0].id);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError("Failed to load conversations.");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/logout");
      alert(response.data.message);
      setAuth(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("An error occurred during logout.");
    }
  };

  const handleSend = async () => {
    if (input.trim() === "" || activeConversationId === null) return;

    try {
      // Send message to backend
      const response = await axios.post(
        `/api/conversations/${activeConversationId}/messages`,
        { text: input }
      );
      const newMessage = response.data;

      // Update local state
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === activeConversationId
            ? { ...conv, messages: [...conv.messages, newMessage] }
            : conv
        )
      );

      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    }
  };

  const handleCreateConversation = async () => {
    const name = prompt("Enter conversation name:");
    if (!name || name.trim() === "") {
      alert("Conversation name cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("/api/conversations", { name });
      const newConversation = response.data;
      setConversations([newConversation, ...conversations]);
      setActiveConversationId(newConversation.id);
    } catch (err) {
      console.error("Error creating conversation:", err);
      alert("Failed to create conversation.");
    }
  };

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    setIsSidebarOpen(true);
  };

  const handleRenameConversation = async (id, newName) => {
    if (!newName || newName.trim() === "") {
      alert("Conversation name cannot be empty.");
      return;
    }

    try {
      const response = await axios.put(`/api/conversations/${id}`, {
        name: newName,
      });
      const updatedConversation = response.data;

      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === id ? updatedConversation : conv
        )
      );

      if (activeConversationId === id) {
        // Optionally update active conversation name
      }
    } catch (err) {
      console.error("Error renaming conversation:", err);
      alert("Failed to rename conversation.");
    }
  };

  const handleDeleteConversation = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this conversation?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/conversations/${id}`);
      setConversations((prevConversations) =>
        prevConversations.filter((conv) => conv.id !== id)
      );
      if (activeConversationId === id && conversations.length > 1) {
        const newActive = conversations.find((conv) => conv.id !== id);
        setActiveConversationId(newActive ? newActive.id : null);
      } else if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
      alert("Failed to delete conversation.");
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
            activeConversation.messages.map((msg) => (
              <div
                key={msg.id}
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
