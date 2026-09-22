const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  bookAppointment,
  getAllAppointments,
  getDoctorAppointments,
  getPatientAppointments,
  updateAppointmentStatus,
  getRegisteredDoctors,
} = require("../controllers/appointmentController");

// ==========================================
// Get All Registered Doctors (for patient booking)
// GET /api/appointments/doctors
// ==========================================
router.get("/doctors", protect, getRegisteredDoctors);

// ==========================================
// Book Appointment
// POST /api/appointments/book  OR  POST /api/appointments
// ==========================================
router.post("/book", protect, bookAppointment);
router.post("/", protect, bookAppointment);

// ==========================================
// Get All Appointments
// GET /api/appointments
// ==========================================
router.get("/", protect, getAllAppointments);

// ==========================================
// Get Doctor Appointments (JWT-based, no param needed)
// GET /api/appointments/doctor
// ==========================================
router.get("/doctor", protect, getDoctorAppointments);

// ==========================================
// Get Doctor Appointments by doctorId
// GET /api/appointments/doctor/:doctorId
// ==========================================
router.get("/doctor/:doctorId", protect, getDoctorAppointments);

// ==========================================
// Get Patient Appointments (JWT-based, no param needed)
// GET /api/appointments/patient
// ==========================================
router.get("/patient", protect, getPatientAppointments);

// ==========================================
// Get Patient Appointments by patientId
// GET /api/appointments/patient/:patientId
// ==========================================
router.get("/patient/:patientId", protect, getPatientAppointments);

// ==========================================
// Update Appointment Status
// PATCH /api/appointments/:id/status  OR  PUT /api/appointments/:id/status
// ==========================================
router.put("/:id/status", protect, updateAppointmentStatus);
router.patch("/:id/status", protect, updateAppointmentStatus);

module.exports = router;