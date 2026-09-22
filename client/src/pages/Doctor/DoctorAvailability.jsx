import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getDoctorAvailability,
  updateDoctorAvailability,
} from "../../services/availabilityService";
import { useToast } from "../../context/ToastContext";
import "../../styles/DoctorAvailability.css";

function DoctorAvailability() {
  const { doctorId } = useParams();
  const { showCelebration, showError, showSuccess } = useToast();

  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await getDoctorAvailability(doctorId);
        setAvailability(
          response.data?.availability || response.data || []
        );
      } catch (error) {
        console.error(error);
        setAvailability([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [doctorId]);

  const addSlot = () => {
    setAvailability([
      ...availability,
      {
        day: "Monday",
        startTime: "09:00",
        endTime: "13:00",
      },
    ]);
    showSuccess("New availability slot added");
  };

  const updateSlot = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  const removeSlot = (index) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await updateDoctorAvailability(doctorId, availability);
      showCelebration(response.message || "Your weekly telemedicine schedule has been updated!", "Schedule Updated ⏰");
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || "Failed to update availability");
    }
  };

  if (loading) {
    return (
      <div className="availability-page">
        <div className="loading-state glass-panel">
          <div className="pulse-spinner" />
          <p>Loading doctor practice availability slots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="availability-page">
      <div style={{ marginBottom: "18px" }}>
        <Link to={`/doctors/${doctorId}/appointments`} className="back-link-pill">
          ← Back to Appointments Queue
        </Link>
      </div>

      <div className="glass-panel availability-card">
        <div className="availability-header">
          <div className="badge-pill badge-indigo">
            <span>⏰</span> Practice Schedule
          </div>
          <h2>Doctor Availability & Telehealth Hours</h2>
          <p>Configure days and time windows when rural patients can book consultations with you.</p>
        </div>

        <form onSubmit={handleSubmit} className="availability-form">
          {availability.length === 0 ? (
            <div className="empty-slots-banner">
              <p>No recurring slots set. Add your consultation hours below.</p>
            </div>
          ) : (
            <div className="slots-list">
              {availability.map((slot, index) => (
                <div className="glass-panel availability-row" key={index}>
                  <div className="slot-day-select">
                    <label>Day of Week</label>
                    <select
                      value={slot.day}
                      onChange={(e) => updateSlot(index, "day", e.target.value)}
                    >
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="slot-time-input">
                    <label>Start Time</label>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateSlot(index, "startTime", e.target.value)}
                      required
                    />
                  </div>

                  <div className="slot-time-input">
                    <label>End Time</label>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateSlot(index, "endTime", e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="button"
                    className="btn-danger remove-slot-btn"
                    onClick={() => removeSlot(index)}
                    title="Remove Slot"
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="availability-actions">
            <button
              type="button"
              className="btn-secondary add-slot-btn"
              onClick={addSlot}
            >
              ➕ Add Time Slot
            </button>

            <button type="submit" className="btn-primary save-sched-btn">
              Save Weekly Schedule 💾
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DoctorAvailability;