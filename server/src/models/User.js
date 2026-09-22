const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Common fields
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    role: {
      type: String,
      enum: ["patient", "doctor"],
      required: true,
      default: "patient",
    },

    // =========================
    // PATIENT DETAILS
    // =========================

    age: {
      type: Number,
      min: 0,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },

    // =========================
    // DOCTOR DETAILS
    // =========================

    medicalRegistrationNumber: {
      type: String,
      trim: true,
      default: "",
    },

    specialization: {
      type: String,
      trim: true,
      default: "",
    },

    qualification: {
      type: String,
      trim: true,
      default: "",
    },

    yearsOfExperience: {
      type: Number,
      min: 0,
      default: 0,
    },

    hospitalClinicName: {
      type: String,
      trim: true,
      default: "",
    },

    consultationFee: {
      type: Number,
      min: 0,
      default: 0,
    },

    availableSlots: [{
      day: {
        type: String,
        required: true,
      },
      slots: [{
        type: String,
        required: true,
      }],
    }],

    // =========================
    // COMMON LOCATION/LANGUAGE
    // =========================

    location: {
      type: String,
      trim: true,
      default: "",
    },

    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },

    preferredLanguage: {
      type: String,
      trim: true,
      default: "English",
    },

    // =========================
    // DOCTOR RATINGS
    // =========================

    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    totalReviews: {
      type: Number,
      min: 0,
      default: 0,
    },

    googleId: {
      type: String,
      trim: true,
      default: null,
    },

    profilePicture: {
      type: String,
      trim: true,
      default: "",
    },

    pushSubscriptions: [{
      endpoint: { type: String, required: true },
      keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true },
      },
    }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;