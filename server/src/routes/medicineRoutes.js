const express = require("express");
const router = express.Router();
const medicineController = require("../controllers/medicineController");
const protect = require("../middleware/authMiddleware");

// Get all medicines for a specific patient
router.get("/patient/:patientId", protect, medicineController.getMedicinesByPatient);

// Add a new medicine
router.post("/", protect, medicineController.addMedicine);

// Update a medicine
router.put("/:id", protect, medicineController.updateMedicine);

// Delete a medicine
router.delete("/:id", protect, medicineController.deleteMedicine);

module.exports = router;
