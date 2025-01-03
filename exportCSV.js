const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const db = new sqlite3.Database("./qrInventory.db");

// Function to export table data to a CSV file
const exportTableToCSV = (tableName, outputFile) => {
  db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
    if (err) {
      console.error(`Error reading table ${tableName}:`, err);
      return;
    }

    // Convert rows to CSV format
    const csvHeaders = Object.keys(rows[0]).join(",");
    const csvRows = rows.map((row) => Object.values(row).join(",")).join("\n");
    const csvData = `${csvHeaders}\n${csvRows}`;

    // Write CSV data to file
    fs.writeFileSync(outputFile, csvData, "utf8");
    console.log(`Table ${tableName} exported to ${outputFile}`);
  });
};

// Export inventory and auditLog tables
exportTableToCSV("inventory", "inventory.csv");
exportTableToCSV("auditLog", "auditLog.csv");
