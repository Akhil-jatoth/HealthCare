const mongoose = require("mongoose");

const symptomHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    symptoms: {
      type: [String],
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: ["Mild", "Moderate", "Severe"],
      required: true,
    },

    result: {
      possibleConditions: {
        type: [String],
        default: [],
      },

      urgency: {
        type: String,
        enum: ["Low", "Moderate", "High", "Emergency"],
        required: true,
      },

      recommendation: {
        type: String,
        required: true,
      },

      recommendedSpecialists: {
        type: [String],
        default: ["General Physician"],
      },
    },
  },
  {
    timestamps: true,
  }
);

const SymptomHistory = mongoose.model(
  "SymptomHistory",
  symptomHistorySchema
);

module.exports = SymptomHistory;