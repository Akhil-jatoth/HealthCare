import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookAppointment } from "../../services/appointmentService";
import { getDoctorById } from "../../services/doctorService";
import { useToast } from "../../context/ToastContext";
import "../../styles/BookAppointment.css";

function BookAppointment() {
  const { doctorId, patientId } = useParams();
  const navigate = useNavigate();
  const { showCelebration, showError, showInfo } = useToast();

  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    appointmentDate: new Date().toISOString().split("T")[0],
    appointmentTime: "10:30",
    reason: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doctorId) {
      getDoctorById(doctorId)
        .then((res) => setDoctor(res.data))
        .catch(() => {});
    }
  }, [doctorId]);

  const timeSlots = ["09:30", "10:30", "11:30", "14:00", "15:30", "17:00", "18:30"];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await bookAppointment({
        doctor: doctorId,
        patient: patientId,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reason: formData.reason || "General Rural Health Consultation",
      });

      showCelebration(
        `Consultation booked with ${doctor ? `Dr. ${doctor.name}` : "Doctor"} on ${formData.appointmentDate} at ${formData.appointmentTime}!`,
        "Appointment Confirmed 🎉"
      );

      navigate(`/patients/${patientId}/appointments`);
    } catch (error) {
      console.error("Appointment booking error:", error);
      const msg = error.response?.data?.message || "Failed to schedule appointment";
      showError(msg, "Booking Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-appointment-page">
      <div className="glass-panel book-appointment-container">
        <div className="booking-header">
          <div className="badge-pill badge-cyan">
            <span>📅</span> Instant Rural OPD Booking
          </div>
          <h2>Schedule Consultation</h2>
          <p>Choose an available slot for audio/video telemedicine or clinic visit</p>
        </div>

        {/* Doctor Summary Card */}
        {doctor && (
          <div className="doctor-summary-glass">
            <div className="doctor-summary-avatar">🩺</div>
            <div className="doctor-summary-info">
              <h4>Dr. {doctor.name}</h4>
              <div className="summary-spec">
                {doctor.specialization} • {doctor.qualification}
              </div>
              <div className="summary-hospital">
                🏥 {doctor.hospitalOrClinicName || doctor.city || "Primary Health Center"}
              </div>
            </div>
            <div className="summary-fee">
              <span>Consultation</span>
              <strong>₹{doctor.consultationFee || 150}</strong>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
            <label>Preferred Date</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Available Time Slots (Tap to select)</label>
            <div className="time-slots-grid">
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  className={`slot-chip ${formData.appointmentTime === slot ? "selected" : ""}`}
                  onClick={() => {
                    setFormData({ ...formData, appointmentTime: slot });
                    showInfo(`Selected consultation time: ${slot}`);
                  }}
                >
                  ⏰ {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Chief Health Complaint / Symptoms</label>
            <textarea
              name="reason"
              placeholder="e.g. Cough for 3 days, low grade fever in evenings, weakness..."
              value={formData.reason}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="btn-primary booking-submit-btn"
            disabled={loading}
          >
            {loading ? "Confirming Slot..." : "Confirm & Book Consultation ➜"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;