const express = require("express");
const router = express.Router();
const finance = require("../controllers/financeController");

// Payments Routes 
router.get("/payments", finance.getPayments);
router.get("/payments/:id", finance.getPaymentById);
router.post("/payments", finance.createPayment);
router.put("/payments/:id", finance.updatePayment);
router.delete("/payments/:id", finance.deletePayment);

// Violations Routes
router.get("/violations", finance.getViolations);
router.post("/violations", finance.createViolation);
router.put("/violations/:id", finance.updateViolation);
router.delete("/violations/:id", finance.deleteViolation);

// Charging Session Routes 
router.get("/charging-sessions", finance.getChargingSessions);

// JOIN REPORT
router.get("/report", finance.getFinanceReport);

module.exports = router;