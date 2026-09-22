const Doctor = require("../models/doctor");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new doctor
const registerDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    const savedDoctor = await doctor.save();

    // Also create a User account so the doctor can be found by the
    // appointment / payment system (which queries the User model).
    let userAccount = null;
    let token = null;

    const existingUser = await User.findOne({
      email: savedDoctor.email.toLowerCase(),
    });

    if (!existingUser) {
      // Generate a password from the email so the doctor can log in later
      const defaultPassword = await bcrypt.hash(
        "doctor123",
        10
      );

      userAccount = new User({
        name: savedDoctor.name,
        email: savedDoctor.email.toLowerCase(),
        password: defaultPassword,
        phone: savedDoctor.phone || "",
        role: "doctor",
        specialization: savedDoctor.specialization || "",
        qualification: savedDoctor.qualification || "",
        yearsOfExperience: savedDoctor.experience || 0,
        hospitalClinicName: savedDoctor.hospitalOrClinicName || "",
        consultationFee: savedDoctor.consultationFee || 0,
        location: [savedDoctor.city, savedDoctor.state]
          .filter(Boolean)
          .join(", "),
        preferredLanguage: "English",
      });

      userAccount = await userAccount.save();

      // Generate a JWT so the doctor is immediately logged in
      token = jwt.sign(
        {
          userId: userAccount._id,
          email: userAccount.email,
          role: userAccount.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
    } else {
      userAccount = existingUser;
      token = jwt.sign(
        {
          userId: existingUser._id,
          email: existingUser.email,
          role: existingUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
    }

    // Link the Doctor record to the User account
    savedDoctor.userId = userAccount._id;
    await savedDoctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully",
      data: {
        ...savedDoctor.toObject(),
        userId: userAccount._id,
      },
      token,
    });
  } catch (error) {
    console.error("Doctor registration error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update doctor
const updateDoctor = async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(
      req.params.id
    );

    if (!deletedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
