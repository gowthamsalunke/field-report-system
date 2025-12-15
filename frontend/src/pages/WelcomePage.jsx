// src/pages/WelcomePage.jsx
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout"; // go up one folder, then into components

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <h1 className="title">📊 Smart Meter Reporting</h1>
      <p className="subtitle">Submit your daily reports with ease and security.</p>
      <button className="btn" onClick={() => navigate("/login")}>
        🚀 Get Started
      </button>
    </Layout>
  );
}
