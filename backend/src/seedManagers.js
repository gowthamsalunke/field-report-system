const bcrypt = require("bcryptjs");
const pool = require("./db");

async function seedManagers() {
  const clients = [
    "Adani Power",
    "Apraava Energy",
    "Esyasoft",
    "Genus Power",
    "Intellismart DGVCL",
    "Intellismart PVVNL",
    "Polaris",
  ];

  const managers = [
    { username: "dinesh.ra@veetechnologies.com", password: "adani123", client: "Adani Power" },
    { username: "apraava_manager", password: "apraava123", client: "Apraava Energy" },
    { username: "esyasoft_manager", password: "esyasoft123", client: "Esyasoft" },
    { username: "genus_manager", password: "genus123", client: "Genus Power" },
    { username: "dgvcl_manager", password: "dgvcl123", client: "Intellismart DGVCL" },
    { username: "pvvnl_manager", password: "pvvnl123", client: "Intellismart PVVNL" },
    { username: "polaris_manager", password: "polaris123", client: "Polaris" },
  ];

  try {
    for (const client of clients) {
      await pool.query(
        "INSERT INTO clients (client_name) VALUES ($1) ON CONFLICT (client_name) DO NOTHING",
        [client]
      );
    }

    for (const mgr of managers) {
      const hash = await bcrypt.hash(mgr.password, 10);

      const { rows } = await pool.query(
        "SELECT client_id FROM clients WHERE client_name = $1",
        [mgr.client]
      );
      const clientId = rows[0]?.client_id;
      if (!clientId) throw new Error(`Client not found: ${mgr.client}`);

      await pool.query(
        `INSERT INTO project_managers (client_id, username, password_hash)
         VALUES ($1, $2, $3)
         ON CONFLICT (username) DO NOTHING`,
        [clientId, mgr.username, hash]
      );
    }

    console.log("✅ Managers seeded successfully with bcrypt hashes");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding managers:", err);
    process.exit(1);
  }
}

seedManagers();
