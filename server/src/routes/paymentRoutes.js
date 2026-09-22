const express = require("express");
const protect = require("../middleware/authMiddleware");
const { createPaymentOrder, verifyPayment, confirmDirectPayment } = require("../controllers/paymentController");

const router = express.Router();
router.post("/appointments/:appointmentId/order", protect, createPaymentOrder);
router.post("/appointments/:appointmentId/verify", protect, verifyPayment);
router.post("/appointments/:appointmentId/direct-pay", protect, confirmDirectPayment);

module.exports = router;