const express = require("express");
const { upsertInventory, fetchInventory } = require("../models/inventory");
const { insertAuditLog, fetchAuditLogs } = require("../models/auditlog");

const router = express.Router();

// Add or update inventory and log the action
router.post("/inventory", (req, res) => {
  const { productCode, lotNumber, name, quantity, action, userName } = req.body;

  // Determine the quantity adjustment based on action
  const adjustedQuantity = action === "Add" ? quantity : -quantity;

  // Update inventory
  upsertInventory(productCode, lotNumber, name, adjustedQuantity, (err) => {
    if (err) {
      console.error("Error updating inventory:", err);
      return res.status(500).json({ message: "Error updating inventory" });
    }

    // Add audit log
    insertAuditLog(productCode, lotNumber, action, quantity, userName, (logErr) => {
      if (logErr) {
        console.error("Error logging action:", logErr);
        return res.status(500).json({ message: "Error logging action" });
      }

      res.status(200).json({ message: "Inventory updated and logged successfully!" });
    });
  });
});

// Fetch all inventory
router.get("/inventory", (req, res) => {
  fetchInventory((err, rows) => {
    if (err) {
      console.error("Error fetching inventory:", err);
      return res.status(500).json({ message: "Error fetching inventory" });
    }
    res.status(200).json(rows);
  });
});

// Fetch all audit logs
router.get("/auditlogs", (req, res) => {
  fetchAuditLogs((err, rows) => {
    if (err) {
      console.error("Error fetching audit logs:", err);
      return res.status(500).json({ message: "Error fetching audit logs" });
    }
    res.status(200).json(rows);
  });
});

module.exports = router;
