const pool = require("../db");

async function findManagerByUsername(username) {
  const { rows } = await pool.query(
    "SELECT * FROM project_managers WHERE username = $1",
    [username]
  );
  return rows[0];
}

module.exports = { findManagerByUsername };
