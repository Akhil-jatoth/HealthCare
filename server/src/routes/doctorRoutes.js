const express = require("express");
const router = express.Router();

const {
  registerDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");

// Register Doctor
router.post("/register", registerDoctor);

// Get all doctors
router.get("/", getAllDoctors);

// Get doctor by ID
router.get("/:id", getDoctorById);

// Update doctor
router.put("/:id", updateDoctor);

// Delete doctor
router.delete("/:id", deleteDoctor);

module.exports = router;