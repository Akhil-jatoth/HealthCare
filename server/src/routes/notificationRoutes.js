const express = require("express");

const router = express.Router();

const {
  getDoctorNotifications,
  markAsRead,
} = require(
  "../controllers/notificationController"
);

// Get all notifications for a doctor
router.get(
  "/doctor/:doctorId",
  getDoctorNotifications
);

// Mark a notification as read (PRD 5.8)
router.patch(
  "/:id/read",
  markAsRead
);

module.exports = router;