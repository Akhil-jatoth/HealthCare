const Medicine = require("../models/medicine");

// Get all medicines for a specific patient
exports.getMedicinesByPatient = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "patient") {
      return res.status(403).json({ message: "Only patients can view medicine reminders" });
    }

    const medicines = await Medicine.find({ patientId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(medicines);
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ message: "Server error while fetching medicines" });
  }
};

// Add a new medicine
exports.addMedicine = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "patient") {
      return res.status(403).json({ message: "Only patients can create medicine reminders" });
    }

    const { medicineName, dosage, frequency, time, startDate, endDate } = req.body;

    const newMedicine = new Medicine({
      patientId: req.user.userId,
      medicineName,
      dosage,
      frequency,
      time,
      startDate,
      endDate,
    });

    const savedMedicine = await newMedicine.save();
    res.status(201).json(savedMedicine);
  } catch (error) {
    console.error("Error adding medicine:", error);
    res.status(500).json({ message: "Server error while adding medicine" });
  }
};

// Update an existing medicine
exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { patientId, ...updates } = req.body;

    const updatedMedicine = await Medicine.findOneAndUpdate(
      { _id: id, patientId: req.user.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json(updatedMedicine);
  } catch (error) {
    console.error("Error updating medicine:", error);
    res.status(500).json({ message: "Server error while updating medicine" });
  }
};

// Delete a medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMedicine = await Medicine.findOneAndDelete({
      _id: id,
      patientId: req.user.userId,
    });

    if (!deletedMedicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    console.error("Error deleting medicine:", error);
    res.status(500).json({ message: "Server error while deleting medicine" });
  }
};
