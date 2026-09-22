const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  submitReview,
  getDoctorReviews,
  checkReviewExists,
} = require("../controllers/reviewController");

// Submit a review (patient only)
router.post("/", protect, submitReview);

// Get reviews for a doctor (public)
router.get("/doctor/:doctorId", getDoctorReviews);

// Check if patient has already reviewed an appointment
router.get("/check/:appointmentId", protect, checkReviewExists);

module.exports = router;
