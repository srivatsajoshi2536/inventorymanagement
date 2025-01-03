const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./qrInventory.db");

const createAuditLogTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS auditLog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productCode TEXT,
      lotNumber TEXT,
      action TEXT,
      quantity INTEGER,
      userName TEXT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

// Insert a new audit log entry
const insertAuditLog = (productCode, lotNumber, action, quantity, userName, callback) => {
  const insertQuery = `INSERT INTO auditLog (productCode, lotNumber, action, quantity, userName) VALUES (?, ?, ?, ?, ?)`;
  db.run(insertQuery, [productCode, lotNumber, action, Number(quantity), userName], callback);
};

// Fetch all audit logs
const fetchAuditLogs = (callback) => {
  const query = `SELECT * FROM auditLog ORDER BY timestamp DESC`;
  db.all(query, [], callback);
};

module.exports = {
  db,
  createAuditLogTable,
  insertAuditLog,
  fetchAuditLogs,
};
