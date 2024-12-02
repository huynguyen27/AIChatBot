// aichatbot-frontend/src/context/AuthContext.js
// We'll use React Context to manage authentication state globally, allowing components to access authentication status and user data without prop drilling.

import React, { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial loading state

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("/api/current_user");
        setAuth(response.data.user); // Assuming backend returns { user: { ... } }
      } catch (err) {
        setAuth(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {!loading && children}
      {loading && <div>Loading...</div>} {/* Or a spinner */}
    </AuthContext.Provider>
  );
};
