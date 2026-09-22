const express = require("express");

const router = express.Router();

const {
  updateAvailability
} = require("../controllers/availabilityController");

const {
  checkDoctorAvailability
} = require("../controllers/availabilityCheckController");

// Check if a doctor is available for a specific time
router.get("/check/:doctorId", checkDoctorAvailability);

// Update doctor availability slots
router.put(
  "/:id",
  updateAvailability
);

module.exports = router;