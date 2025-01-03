const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./qrInventory.db");

const createInventoryTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productCode TEXT UNIQUE,
      lotNumber TEXT UNIQUE,
      name TEXT,
      quantity INTEGER,
      description TEXT,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

// Insert or update inventory
const upsertInventory = (productCode, lotNumber, name, quantity, callback) => {
  const selectQuery = `SELECT * FROM inventory WHERE productCode = ? AND lotNumber = ?`;
  db.get(selectQuery, [productCode, lotNumber], (err, row) => {
    if (err) return callback(err);

    if (row) {
      // Update existing inventory
      const newQuantity = row.quantity + Number(quantity); // Ensure addition is numerical
      const updateQuery = `UPDATE inventory SET quantity = ?, updatedAt = CURRENT_TIMESTAMP WHERE productCode = ? AND lotNumber = ?`;
      db.run(updateQuery, [newQuantity, productCode, lotNumber], callback);
    } else {
      // Insert new inventory
      const insertQuery = `INSERT INTO inventory (productCode, lotNumber, name, quantity) VALUES (?, ?, ?, ?)`;
      db.run(insertQuery, [productCode, lotNumber, name, Number(quantity)], callback);
    }
  });
};

// Fetch all inventory
const fetchInventory = (callback) => {
  const query = `SELECT * FROM inventory`;
  db.all(query, [], callback);
};

module.exports = {
  db,
  createInventoryTable,
  upsertInventory,
  fetchInventory,
};
