// aichatbot-frontend/src/components/Login.js
// Create a login form that verifies the username and password against the stored data in localStorage.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (user) =>
        user.username === formData.username &&
        user.password === formData.password
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      alert("Login successful!");
      navigate("/");
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          required
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <a href="/signup">Signup here</a>.
        </p>
      </form>
    </div>
  );
}

export default Login;
