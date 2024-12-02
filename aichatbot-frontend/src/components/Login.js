import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/');
        }
      } catch (error) {
        console.error(error);
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
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button type="submit">Login</button>
                <p>Don't have an account? <a href="/signup">Signup here</a>.</p>
            </form>
        </div>
    );
}

export default Login;