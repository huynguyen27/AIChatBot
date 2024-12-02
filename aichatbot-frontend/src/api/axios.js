// aichatbot-frontend/src/api/axios.js
// Ensure that Axios is configured to send session cookies with every request, maintaining the authenticated session.

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add response interceptors for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors globally
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
