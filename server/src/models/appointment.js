const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // Doctor who will conduct the consultation
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Patient who booked the appointment
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Date and time of the appointment
    scheduledAt: {
      type: Date,
      required: true,
    },

    // Reason for consultation
    reason: {
      type: String,
      required: true,
      trim: true,
    },

    // Type of consultation
    mode: {
      type: String,
      enum: ["telemedicine", "in-person"],
      default: "telemedicine",
    },

    // Appointment status
    status: {
      type: String,
      enum: [
        "requested",
        "accepted",
        "rejected",
        "cancelled",
        "completed",
      ],
      default: "requested",
    },

    // Jitsi meeting link
    meetLink: {
      type: String,
      default: null,
    },

    completion: {
      doctorCompleted: {
        type: Boolean,
        default: false,
      },
      patientCompleted: {
        type: Boolean,
        default: false,
      },
    },

    payment: {
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
      provider: {
        type: String,
        enum: ["razorpay", "gpay", "upi", "direct_upi"],
        default: "razorpay",
      },
      orderId: { type: String, default: null },
      paymentId: { type: String, default: null },
      paidAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// Compound unique index to prevent double-booking.
// A doctor cannot have two appointments at the same
// scheduled time (database-level enforcement per PRD 5.4).
// =====================================================
appointmentSchema.index(
  { doctor: 1, scheduledAt: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["requested", "accepted"] },
    },
  }
);

module.exports = mongoose.models.Appointment || mongoose.model(
  "Appointment",
  appointmentSchema
);