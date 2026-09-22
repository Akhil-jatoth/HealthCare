const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
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

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    hospitalOrClinicName: {
      type: String,
      required: true,
      trim: true,
    },

    hospitalType: {
      type: String,
      enum: ["Hospital", "Clinic"],
      required: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    availableSlots: [
      {
        day: {
          type: String,
          required: true,
        },
        slots: [
          {
            type: String,
            required: true,
          },
        ],
      },
    ],

    image: {
      type: String,
      default: "",
    },

    // Link to the User account used by the appointment / payment system
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
