const express = require("express");
const cors = require("cors");
const { createInventoryTable } = require("./models/inventory");
const { createAuditLogTable } = require("./models/auditlog");

const app = express();

// Update CORS and body parser configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create necessary tables if they don't exist
createInventoryTable();
createAuditLogTable();

// Routes
app.use("/api", require("./routes/api"));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
