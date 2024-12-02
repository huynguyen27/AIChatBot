import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function Logout() {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            if (!auth?.user?.user_id) {
                throw new Error('User ID not found');
            }
            const response = await axios.post(`/api/logout/${auth.user.user_id}`);
            setAuth(null);
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
            alert(err.response?.data?.error || "Logout failed");
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;