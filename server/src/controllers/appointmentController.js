const Appointment = require("../models/Appointment");
const User = require("../models/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const createMeetingLink = (roomId) => {
  const jitsiAppId = process.env.JITSI_APP_ID;
  const jitsiPrivateKey = process.env.JITSI_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const hasValidPrivateKey = jitsiPrivateKey?.includes("BEGIN PRIVATE KEY") &&
    jitsiPrivateKey.includes("END PRIVATE KEY");

  if (jitsiAppId && hasValidPrivateKey) {
    const token = jwt.sign(
      {
        aud: "jitsi",
        iss: "chat",
        sub: jitsiAppId,
        room: roomId,
        context: {
          user: {
            name: "Swasthya Saathi participant",
            moderator: true,
          },
        },
      },
      jitsiPrivateKey,
      { expiresIn: "24h" }
    );

    return `https://8x8.vc/${jitsiAppId}/${roomId}?jwt=${encodeURIComponent(token)}`;
  }

  return `https://meet.jit.si/health-${roomId}`;
};

// =====================================================
// GET ALL REGISTERED DOCTORS
// Patient uses this to see available doctors
// =====================================================

const getRegisteredDoctors = async (req, res) => {
  try {
    if (req.user && req.user.role !== "patient") {
      return res.status(403).json({
        success: false,
        message: "Only patients can view registered doctors",
      });
    }

    const doctors = await User.find({
      role: "doctor",
    })
      .select(
        "name email phone specialization qualification yearsOfExperience hospitalClinicName location consultationFee preferredLanguage averageRating totalReviews"
      )
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// BOOK / CREATE APPOINTMENT
// Patient books an appointment with a doctor
//
// POST /api/appointments/book
// =====================================================

const bookAppointment = async (req, res) => {
  try {
    // Only patients can book appointments
    if (req.user && req.user.role !== "patient") {
      return res.status(403).json({
        success: false,
        message: "Only patients can book appointments",
      });
    }

    // Accept both field name formats:
    //   { doctorId, scheduledAt, reason, mode }
    //   { doctor, patient, appointmentDate, appointmentTime, reason }
    const {
      doctorId: _doctorId,
      doctor: _doctor,
      scheduledAt: _scheduledAt,
      appointmentDate,
      appointmentTime,
      reason,
      mode,
    } = req.body;

    const doctorId = _doctorId || _doctor;

    if (!doctorId || !reason) {
      return res.status(400).json({
        success: false,
        message:
          "Doctor, appointment date/time and reason are required",
      });
    }

    // Build scheduledAt from either a single datetime string
    // or separate date + time fields.
    let scheduledAtValue = _scheduledAt;
    if (!scheduledAtValue && appointmentDate) {
      scheduledAtValue = appointmentTime
        ? `${appointmentDate}T${appointmentTime}`
        : appointmentDate;
    }

    if (!scheduledAtValue) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment date/time is required",
      });
    }

    // Check doctor
    const doctor = await User.findOne({
      _id: doctorId,
      role: "doctor",
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Validate appointment date
    const appointmentDateObj = new Date(scheduledAtValue);

    if (isNaN(appointmentDateObj.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date/time",
      });
    }

    // Appointment must be in the future
    if (appointmentDateObj <= new Date()) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment must be scheduled for a future date and time",
      });
    }

    // Check whether the doctor already has an appointment
    // at the requested time
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      scheduledAt: appointmentDateObj,
      status: {
        $in: ["requested", "accepted"],
      },
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: "This appointment slot is already booked",
      });
    }

    // Check doctor's weekly availability schedule
    const dayNames = [
      "Sunday", "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday",
    ];
    const dayOfWeek = dayNames[appointmentDateObj.getDay()];
    const hours = String(appointmentDateObj.getHours()).padStart(2, "0");
    const minutes = String(appointmentDateObj.getMinutes()).padStart(2, "0");
    const timeSlot = `${hours}:${minutes}`;

    const hasSchedule = doctor.availableSlots && doctor.availableSlots.length > 0;
    if (hasSchedule) {
      const daySlots = doctor.availableSlots.find(s => s.day === dayOfWeek);
      const slotInRange = daySlots && daySlots.slots && daySlots.slots.some(slot => {
        if (slot.includes("-")) {
          const [start, end] = slot.split("-");
          return timeSlot >= start && timeSlot < end;
        }
        return slot === timeSlot;
      });

      if (!slotInRange) {
        const availableTimes = daySlots?.slots?.join(", ") || "none";
        return res.status(400).json({
          success: false,
          message: `Doctor is not available on ${dayOfWeek} at ${timeSlot}. Available hours: ${availableTimes}`,
        });
      }
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user.userId,
      doctor: doctorId,
      scheduledAt: appointmentDateObj,
      reason: reason.trim(),
      mode: mode || "telemedicine",
      status: "requested",
    });

    // Get complete appointment information
    const populatedAppointment = await Appointment.findById(
      appointment._id
    )
      .populate(
        "patient",
        "name email phone age gender location preferredLanguage"
      )
      .populate(
        "doctor",
        "name email phone specialization qualification yearsOfExperience hospitalClinicName location consultationFee preferredLanguage"
      );

    return res.status(201).json({
      success: true,
      message: "Appointment request sent successfully",
      data: populatedAppointment,
    });
  } catch (error) {
    console.error("Book appointment error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// CREATE APPOINTMENT
// Alias for compatibility with existing code
// =====================================================

const createAppointment = bookAppointment;

// =====================================================
// GET ALL APPOINTMENTS
//
// GET /api/appointments
// =====================================================

const getAllAppointments = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const filter = req.user.role === "doctor"
      ? { doctor: req.user.userId }
      : { patient: req.user.userId };

    const appointments = await Appointment.find(filter)
      .populate(
        "doctor",
        "name email phone specialization qualification yearsOfExperience hospitalClinicName location consultationFee preferredLanguage"
      )
      .populate(
        "patient",
        "name email phone age gender location preferredLanguage"
      )
      .sort({
        scheduledAt: 1,
      });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Get all appointments error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET PATIENT APPOINTMENTS
//
// GET /api/appointments/patient/:patientId
// =====================================================

const getPatientAppointments = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "patient") {
      return res.status(403).json({
        success: false,
        message: "Only patients can view patient appointments",
      });
    }

    const patientId = req.user.userId;

    const appointments = await Appointment.find({
      patient: patientId,
    })
      .populate(
        "doctor",
        "name email phone specialization qualification yearsOfExperience hospitalClinicName location consultationFee preferredLanguage"
      )
      .sort({
        scheduledAt: 1,
      });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Get patient appointments error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET DOCTOR APPOINTMENTS
//
// GET /api/appointments/doctor/:doctorId
// =====================================================

const getDoctorAppointments = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Only doctors can view doctor appointments",
      });
    }

    const doctorId = req.user.userId;

    const appointments = await Appointment.find({
      doctor: doctorId,
    })
      .populate(
        "patient",
        "name email phone age gender location preferredLanguage"
      )
      .populate(
        "doctor",
        "name email phone specialization qualification hospitalClinicName consultationFee"
      )
      .sort({
        scheduledAt: 1,
      });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Get doctor appointments error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE APPOINTMENT STATUS
//
// PUT /api/appointments/:id/status
//
// Doctor manages appointments; patient can mark their accepted appointment completed.
// =====================================================

const updateAppointmentStatus = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "accepted",
      "rejected",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid appointment status. Use accepted, rejected, completed or cancelled",
      });
    }

    if (req.user.role === "patient" && status !== "completed") {
      return res.status(403).json({
        success: false,
        message: "Patients can only mark accepted appointments as completed",
      });
    }

    if (req.user.role !== "doctor" && req.user.role !== "patient") {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update appointment status",
      });
    }

    // Find appointment
    const appointment = await Appointment.findOne({
      _id: id,
      ...(req.user.role === "doctor"
        ? { doctor: req.user.userId }
        : { patient: req.user.userId }),
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      status === "completed" &&
      !["accepted", "confirmed"].includes(appointment.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Only accepted appointments can be marked as completed",
      });
    }

    // Requested appointment can only be accepted/rejected
    if (
      (status === "accepted" || status === "rejected") &&
      appointment.status !== "requested"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This appointment request has already been processed",
      });
    }

    if (status === "completed") {
      if (!appointment.completion) {
        appointment.completion = {};
      }

      if (req.user.role === "doctor") {
        appointment.completion.doctorCompleted = true;
      } else {
        appointment.completion.patientCompleted = true;
      }

      if (
        appointment.completion.doctorCompleted &&
        appointment.completion.patientCompleted
      ) {
        appointment.status = "completed";
      }
    } else {
      appointment.status = status;
    }

    // =====================================================
    // CREATE JITSI ROOM WHEN ACCEPTED
    // =====================================================

    if (status === "accepted" && !appointment.meetLink) {
      const roomId = crypto.randomUUID();

      appointment.meetLink = createMeetingLink(`health-${roomId}`);
    }

    // Remove meeting link when rejected/cancelled
    if (
      status === "rejected" ||
      status === "cancelled"
    ) {
      appointment.meetLink = null;
    }

    await appointment.save();

    // Get updated appointment
    const updatedAppointment =
      await Appointment.findById(appointment._id)
        .populate(
          "patient",
          "name email phone age gender location preferredLanguage"
        )
        .populate(
          "doctor",
          "name email specialization qualification hospitalClinicName"
        );

    let message =
      "Appointment status updated successfully";

    if (status === "accepted") {
      message =
        "Appointment accepted and Jitsi consultation created";
    }

    if (status === "rejected") {
      message =
        "Appointment rejected successfully";
    }

    if (status === "completed") {
      const bothCompleted = appointment.status === "completed";
      message = bothCompleted
        ? "Both sides marked the consultation as completed. Payment is now available."
        : `Marked as completed. Waiting for the ${req.user.role === "doctor" ? "patient" : "doctor"} to confirm.`;
    }

    if (status === "cancelled") {
      message =
        "Appointment cancelled";
    }

    return res.status(200).json({
      success: true,
      message,
      data: updatedAppointment,
    });
  } catch (error) {
    console.error(
      "Update appointment status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// EXPORT ALL FUNCTIONS
// =====================================================

module.exports = {
  getRegisteredDoctors,
  bookAppointment,
  createAppointment,
  getAllAppointments,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
};