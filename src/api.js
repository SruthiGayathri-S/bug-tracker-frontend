import axios from "axios";

// Update this port to match your running .NET backend
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5255/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
