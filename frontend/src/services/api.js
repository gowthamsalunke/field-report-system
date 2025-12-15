// src/services/api.js
import axios from "axios";

// Create an axios instance for backend API
const api = axios.create({
  baseURL: "http://localhost:8000", // backend server
  headers: { "Content-Type": "application/json" },
});

// --- Auth helper functions ---
// You can import these directly in your components

// Login
export async function login(username, password) {
  const { data } = await api.post("/api/auth/login", { username, password });
  return data; // contains token + manager info
}

// Example: future logout (if needed)
export function logout() {
  localStorage.removeItem("token");
}

// Example: get reports (protected route)
export async function getReports() {
  const token = localStorage.getItem("token");
  const { data } = await api.get("/api/reports", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export default api;
