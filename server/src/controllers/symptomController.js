const SymptomHistory = require("../models/symptomHistory");

const { analyzeSymptoms } = require("../services/aiService");

// Check symptoms using AI
const checkSymptoms = async (req, res) => {
  try {
    const {
      symptoms,
      duration,
      severity,
    } = req.body;

    // -----------------------------
    // 1. Validate input
    // -----------------------------

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one symptom",
      });
    }

    if (!duration) {
      return res.status(400).json({
        success: false,
        message: "Please provide symptom duration",
      });
    }

    if (!["Mild", "Moderate", "Severe"].includes(severity)) {
      return res.status(400).json({
        success: false,
        message: "Invalid severity",
      });
    }

    // -----------------------------
    // 2. Normalize symptoms
    // -----------------------------

    const normalizedSymptoms = symptoms
      .map((symptom) => String(symptom).toLowerCase().trim())
      .filter((symptom) => symptom.length > 0);

    const uniqueSymptoms = [
      ...new Set(normalizedSymptoms),
    ];

    // Make sure symptoms still exist
    if (uniqueSymptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid symptoms",
      });
    }

    // -----------------------------
    // 3. Emergency symptoms
    // -----------------------------

    const emergencySymptoms = [
      "chest pain",
      "difficulty breathing",
      "severe difficulty breathing",
      "loss of consciousness",
      "unconscious",
      "severe bleeding",
      "coughing blood",
      "seizure",
    ];

    const hasEmergencySymptom =
      uniqueSymptoms.some((symptom) =>
        emergencySymptoms.includes(symptom)
      );

    let aiResult;

    // -----------------------------
    // 4. Emergency case
    // -----------------------------

    if (hasEmergencySymptom) {
      aiResult = {
        possibleConditions: [
          "Potential medical emergency",
        ],
        urgency: "Emergency",
        recommendation:
          "Your reported symptoms may require immediate medical attention. Please seek emergency medical care immediately.",
      };
    } else {
      // -----------------------------
      // 5. Ask Gemini AI
      // -----------------------------

      aiResult = await analyzeSymptoms(
        uniqueSymptoms,
        duration,
        severity
      );
    }

    // -----------------------------
    // 6. Save history to MongoDB
    // -----------------------------

    const history = await SymptomHistory.create({
      user: req.user.userId,

      symptoms: uniqueSymptoms,

      duration,

      severity,

      result: {
        possibleConditions:
          aiResult.possibleConditions || [],

        urgency:
          aiResult.urgency || "Moderate",

        recommendation:
          aiResult.recommendation ||
          "Please consult a healthcare professional.",

        recommendedSpecialists:
          aiResult.recommendedSpecialists || ["General Physician"],
      },
    });

    // -----------------------------
    // 7. Send response
    // -----------------------------

    return res.status(200).json({
      success: true,
      message: "AI symptom check completed",
      data: history,
    });

  } catch (error) {
    console.error(
      "Symptom checker error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get user's symptom history
const getSymptomHistory = async (req, res) => {
  try {
    const history = await SymptomHistory.find({
      user: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Export functions
module.exports = {
  checkSymptoms,
  getSymptomHistory,
};