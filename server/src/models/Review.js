const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // The doctor being reviewed
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The patient who wrote the review
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The appointment this review is linked to
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },

    // Star rating (1-5)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Optional text feedback
    feedback: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// One review per patient per appointment
reviewSchema.index(
  { patient: 1, appointment: 1 },
  { unique: true }
);

// Index for quickly fetching reviews for a doctor
reviewSchema.index({ doctor: 1, createdAt: -1 });

module.exports =
  mongoose.models.Review ||
  mongoose.model("Review", reviewSchema);
