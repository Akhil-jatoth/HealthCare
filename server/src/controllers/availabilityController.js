const Doctor = require("../models/doctor");

const updateAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    doctor.availability = req.body.availability;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: doctor.availability
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  updateAvailability
};