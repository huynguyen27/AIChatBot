// aichatbot-frontend/src/components/Logout.js
// Implement a Logout button that interacts with the backend to terminate the session and updates the frontend state accordingly.

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function Logout() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/logout");
      alert(response.data.message);
      setAuth(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert("An error occurred during logout.");
      }
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
