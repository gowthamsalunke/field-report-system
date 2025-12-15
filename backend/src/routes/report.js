const express = require("express");
const router = express.Router();
const { submitReport, checkReport } = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/reports/:date → check which categories submitted for that date
router.get("/:date", authMiddleware, checkReport);

// POST /api/reports → submit a new report
router.post("/", authMiddleware, submitReport);

module.exports = router;
