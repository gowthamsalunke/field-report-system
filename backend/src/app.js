const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/report");

const app = express();

// Enable CORS for frontend at http://localhost:5173
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
