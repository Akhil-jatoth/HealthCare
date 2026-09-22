const Patient = require("../models/patient");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Patient
const registerPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    const savedPatient = await patient.save();

    // Also create a User account so the patient can authenticate
    // and use the appointment / payment system.
    let userAccount = null;
    let token = null;

    const existingUser = await User.findOne({
      email: savedPatient.email.toLowerCase(),
    });

    if (!existingUser) {
      const defaultPassword = await bcrypt.hash(
        "patient123",
        10
      );

      userAccount = new User({
        name: savedPatient.name,
        email: savedPatient.email.toLowerCase(),
        password: defaultPassword,
        phone: savedPatient.phone || "",
        role: "patient",
        age: savedPatient.age,
        gender: savedPatient.gender,
        location: savedPatient.city || "",
        preferredLanguage: "English",
      });

      userAccount = await userAccount.save();

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

    // Link the Patient record to the User account
    savedPatient.userId = userAccount._id;
    await savedPatient.save();

    res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      data: {
        ...savedPatient.toObject(),
        userId: userAccount._id,
      },
      token,
    });
  } catch (error) {
    console.error("Patient registration error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerPatient,
  getAllPatients,
};
