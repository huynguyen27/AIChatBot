// aichatbot-frontend/src/components/Signup.js
// Create a signup form that collects a username and password and stores them in localStorage.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSignup = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find(
      (user) => user.username === formData.username
    );

    if (userExists) {
      alert("User already exists!");
    } else {
      users.push(formData);
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful!");
      navigate("/login");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSignup}>
        <h2>Signup</h2>
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
        <button type="submit">Signup</button>
        <p>
          Already have an account? <a href="/login">Login here</a>.
        </p>
      </form>
    </div>
  );
}

export default Signup;
