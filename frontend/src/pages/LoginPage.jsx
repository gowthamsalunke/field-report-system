import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";   // import login helper
import Layout from "../components/Layout";
import "../PageStyles.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("⚠️ Please enter username and password");
      return;
    }

    try {
      // ✅ call login helper which posts to /api/auth/login
      const res = await login(username, password);

      // store token
      localStorage.setItem("token", res.token);

      alert("✅ Login successful!");
      navigate("/report");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert("❌ Invalid credentials");
    }
  };

  return (
    <Layout>
      <h2 className="title">🔐 Login</h2>
      <input
        className="input"
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="input"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn" onClick={handleLogin}>
        Login
      </button>
    </Layout>
  );
}
