import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Chat from "./components/Chat"; 
import "./App.css";

function App() {
 const navigate = useNavigate();
 const location = useLocation();

 useEffect(() => {
   const user = JSON.parse(localStorage.getItem('user'));
   // Only redirect to login if we're not already on login or signup pages
   if (!user && location.pathname !== '/login' && location.pathname !== '/signup') {
     navigate('/login');
   }
   // Redirect to chat if logged in and on login/signup pages
   if (user && (location.pathname === '/login' || location.pathname === '/signup')) {
     navigate('/');
   }
 }, [navigate, location]);

 const handleLogout = async () => {
   const user = JSON.parse(localStorage.getItem('user'));
   try {
     const response = await fetch(`http://localhost:5000/api/logout/${user.user_id}`, {
       method: 'POST',
       credentials: 'include'
     });
     if (response.ok) {
       localStorage.removeItem('user');
       navigate('/login');
     } else {
       console.error('Logout failed');
     }
   } catch (error) {
     console.error('Logout error:', error);
   }
 };

 return (
   <div className="app">
     <Routes>
       <Route path="/" element={<Chat onLogout={handleLogout} />} />
       <Route path="/signup" element={<Signup />} />
       <Route path="/login" element={<Login />} />
     </Routes>
   </div>
 );
}

function AppWrapper() {
 return (
   <Router>
     <App />
   </Router>
 );
}

export default AppWrapper;