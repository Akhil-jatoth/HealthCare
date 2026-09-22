const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  checkSymptoms,
  getSymptomHistory,
} = require("../controllers/symptomController");


// Check symptoms
router.post(
  "/check",
  protect,
  checkSymptoms
);


// Get symptom history
router.get(
  "/history",
  protect,
  getSymptomHistory
);


// Test route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Symptom routes are working",
  });
});


module.exports = router;