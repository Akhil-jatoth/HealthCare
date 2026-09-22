const User = require("../models/User");
const Appointment = require("../models/Appointment");

// =====================================================
// CHECK DOCTOR AVAILABILITY
// GET /api/availability/check/:doctorId?date=2026-08-28T10:00
// =====================================================

const checkDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID and date are required",
      });
    }

    const requestedDate = new Date(date);
    if (isNaN(requestedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    // Get the day of the week (e.g., "Monday")
    const dayNames = [
      "Sunday", "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday",
    ];
    const dayOfWeek = dayNames[requestedDate.getDay()];

    // Get the time string (e.g., "10:00")
    const hours = String(requestedDate.getHours()).padStart(2, "0");
    const minutes = String(requestedDate.getMinutes()).padStart(2, "0");
    const timeSlot = `${hours}:${minutes}`;

    // Find the doctor
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

    // Check 1: Does the doctor have available slots for this day?
    const daySlots = doctor.availableSlots?.find(
      (s) => s.day === dayOfWeek
    );

    let slotAvailable = false;

    if (daySlots && daySlots.slots && daySlots.slots.length > 0) {
      // Check if the requested time falls within any of the doctor's slot ranges
      slotAvailable = daySlots.slots.some((slot) => {
        // Slots can be "09:00-12:00" or "10:00" format
        if (slot.includes("-")) {
          const [start, end] = slot.split("-");
          return timeSlot >= start && timeSlot < end;
        }
        // Exact match for a single time slot
        return slot === timeSlot;
      });
    }

    // If doctor has no slots defined, assume available (no restriction)
    const hasDefinedSlots =
      doctor.availableSlots &&
      doctor.availableSlots.length > 0;

    // Check 2: Does the doctor already have an appointment at this exact time?
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      scheduledAt: requestedDate,
      status: { $in: ["requested", "accepted"] },
    });

    const slotOccupied = !!existingAppointment;

    // Determine availability
    let available = true;
    let reason = "";

    if (slotOccupied) {
      available = false;
      reason = "Doctor already has an appointment at this time";
    } else if (hasDefinedSlots && !slotAvailable) {
      available = false;
      reason = `Doctor is not available on ${dayOfWeek} at ${timeSlot}. Available hours: ${daySlots?.slots?.join(", ") || "none"}`;
    }

    // Get available slots for the requested day (for display)
    const availableHours = hasDefinedSlots && daySlots
      ? daySlots.slots
      : [];

    return res.status(200).json({
      success: true,
      data: {
        available,
        reason,
        doctorId,
        requestedDate: date,
        dayOfWeek,
        timeSlot,
        availableHours,
        hasSchedule: hasDefinedSlots,
      },
    });
  } catch (error) {
    console.error("Check availability error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

module.exports = { checkDoctorAvailability };
