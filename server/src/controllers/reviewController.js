const Review = require("../models/Review");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

// =====================================================
// SUBMIT A REVIEW
// POST /api/reviews
// =====================================================

const submitReview = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "patient") {
      return res
        .status(403)
        .json({ success: false, message: "Only patients can submit reviews" });
    }

    const { appointmentId, rating, feedback } = req.body;

    if (!appointmentId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID and rating are required",
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Find the appointment
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patient: req.user.userId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check that the appointment is completed or at least patient has completed
    const patientDone = appointment.completion?.patientCompleted === true;
    const bothDone = appointment.status === "completed";
    if (!patientDone && !bothDone) {
      return res.status(400).json({
        success: false,
        message:
          "You can only review after completing the consultation",
      });
    }

    // Check for duplicate review
    const existing = await Review.findOne({
      patient: req.user.userId,
      appointment: appointmentId,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this consultation",
      });
    }

    // Create the review
    const review = await Review.create({
      doctor: appointment.doctor,
      patient: req.user.userId,
      appointment: appointmentId,
      rating: numRating,
      feedback: (feedback || "").trim(),
    });

    // Recalculate doctor's average rating
    const stats = await Review.aggregate([
      { $match: { doctor: appointment.doctor } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const avgRating =
      stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0;
    const totalReviews =
      stats.length > 0 ? stats[0].totalReviews : 0;

    await User.findByIdAndUpdate(appointment.doctor, {
      averageRating: avgRating,
      totalReviews: totalReviews,
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    console.error("Submit review error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

// =====================================================
// GET REVIEWS FOR A DOCTOR
// GET /api/reviews/doctor/:doctorId
// =====================================================

const getDoctorReviews = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const reviews = await Review.find({ doctor: doctorId })
      .populate("patient", "name")
      .sort({ createdAt: -1 })
      .limit(50);

    const stats = await Review.aggregate([
      { $match: { doctor: require("mongoose").Types.ObjectId.createFromHexString(doctorId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingCounts: {
            $push: "$rating",
          },
        },
      },
    ]);

    let avgRating = 0;
    let totalReviews = 0;
    let distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (stats.length > 0) {
      avgRating =
        Math.round(stats[0].avgRating * 10) / 10;
      totalReviews = stats[0].totalReviews;
      stats[0].ratingCounts.forEach((r) => {
        distribution[r] = (distribution[r] || 0) + 1;
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        reviews,
        stats: { avgRating, totalReviews, distribution },
      },
    });
  } catch (error) {
    console.error("Get doctor reviews error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

// =====================================================
// CHECK IF PATIENT HAS REVIEWED AN APPOINTMENT
// GET /api/reviews/check/:appointmentId
// =====================================================

const checkReviewExists = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const review = await Review.findOne({
      patient: req.user.userId,
      appointment: appointmentId,
    });

    return res.status(200).json({
      success: true,
      data: { exists: !!review, review: review || null },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

module.exports = {
  submitReview,
  getDoctorReviews,
  checkReviewExists,
};
