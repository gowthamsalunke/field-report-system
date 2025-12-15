const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findManagerByUsername } = require("../models/managerModel");

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const manager = await findManagerByUsername(username);
    if (!manager) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, manager.password_hash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { managerId: manager.manager_id, clientId: manager.client_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      manager: {
        id: manager.manager_id,
        username: manager.username,
        clientId: manager.client_id,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
}

module.exports = { login };
