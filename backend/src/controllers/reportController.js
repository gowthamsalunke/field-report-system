const pool = require("../db");

async function submitReport(req, res) {
  const { category, reportDate, payload } = req.body;
  const { managerId, clientId } = req.user; // set by authMiddleware

  try {
    // Prevent exact duplicate (same manager, date, category, AND details)
    const check = await pool.query(
      `SELECT 1 
       FROM reports 
       WHERE manager_id = $1 
         AND report_date = $2 
         AND category = $3 
         AND payload_json = $4::jsonb`,
      [managerId, reportDate, category, JSON.stringify(payload)]
    );

    if (check.rows.length > 0) {
      return res
        .status(400)
        .json({ error: `Duplicate report: category '${category}' with same details already exists today` });
    }

    const result = await pool.query(
      `INSERT INTO reports (manager_id, client_id, category, report_date, payload_json)
       VALUES ($1, $2, $3, $4, $5::jsonb)
       RETURNING report_id, report_date, submission_ts, category, payload_json`,
      [managerId, clientId || null, category, reportDate, JSON.stringify(payload)]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Report submission error:", err);
    res.status(500).json({ error: "Server error during report submission" });
  }
}

async function checkReport(req, res) {
  const { date } = req.params;
  const { managerId } = req.user;

  try {
    const { rows } = await pool.query(
      "SELECT category FROM reports WHERE manager_id = $1 AND report_date = $2",
      [managerId, date]
    );

    res.json({
      exists: rows.length > 0,
      categories: rows.map((r) => r.category),
    });
  } catch (err) {
    console.error("Check report error:", err);
    res.status(500).json({ error: "Server error during report check" });
  }
}

module.exports = { submitReport, checkReport };
