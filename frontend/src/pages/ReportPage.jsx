// src/pages/ReportPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";
import "../PageStyles.css";

const categories = [
  "Single phase meter installation",
  "Three phase meter installation",
  "DTR meter installation",
  "Feeder meter installation",
  "LTCT meter installation",
  "Consumer indexing survey",
];

export default function ReportPage() {
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [submittedReports, setSubmittedReports] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const todayIst = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  const submitReport = async (logoutAfter = false) => {
    if (!category || !details.trim()) {
      alert("⚠️ Please select a category and enter details before submitting.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/api/reports", // ✅ corrected endpoint
        { category, reportDate: todayIst, payload: { details } },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Report submitted successfully!");
      console.log("Report response:", res.data);

      setSubmittedReports((prev) => [
        ...prev,
        { category, details, date: todayIst },
      ]);

      setCategory("");
      setDetails("");

      if (logoutAfter) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (err) {
      console.error("Report submission error:", err.response?.data || err.message);
      alert("❌ Error submitting report: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <Layout>
      <h2 className="title">📝 Submit Report</h2>
      <p className="subtitle">📅 Reports can be submitted for today ({todayIst}).</p>

      <select
        className="input"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select category</option>
        {categories.map((c, i) => (
          <option key={i} value={c}>
            {c}
          </option>
        ))}
      </select>

      <textarea
        className="input"
        placeholder="Enter report details"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button className="btn" onClick={() => submitReport(false)}>
          Submit & Select Another Category
        </button>
        <button className="btn" onClick={() => setShowConfirm(true)}>
          Submit & Logout
        </button>
      </div>

      {showConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              width: "300px",
            }}
          >
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to submit and log out?</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button
                className="btn"
                onClick={() => {
                  setShowConfirm(false);
                  submitReport(true);
                }}
              >
                Yes, Submit & Logout
              </button>
              <button
                className="btn"
                style={{ background: "#aaa" }}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {submittedReports.length > 0 && (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <h3>📋 Reports submitted this session:</h3>
          <ul>
            {submittedReports.map((r, idx) => (
              <li key={idx}>
                <strong>{r.category}</strong> — {r.details} ({r.date})
              </li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  );
}
