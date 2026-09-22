import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../../services/appointmentService";
import { useToast } from "../../context/ToastContext";
import "../../styles/DoctorAppointment.css";

function DoctorAppointments() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError, showCelebration } = useToast();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const response = await getDoctorAppointments(doctorId);
      setAppointments(response.data || []);
    } catch (error) {
      console.error(error);
      showError("Failed to load doctor appointments queue", "Server Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [doctorId]);

  const updateStatus = async (id, status) => {
    try {
      const response = await updateAppointmentStatus(id, status);
      if (status === "Confirmed") {
        showSuccess("Appointment accepted! Video room activated.", "Confirmed");
      } else if (status === "Completed") {
        showCelebration("Consultation marked as completed!", "Session Closed ✨");
      } else {
        showSuccess(response.message || `Appointment updated to ${status}`);
      }
      fetchAppointments();
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || "Failed to update appointment");
    }
  };

  if (loading) {
    return (
      <div className="doctor-appts-page">
        <div className="loading-state glass-panel">
          <div className="pulse-spinner" />
          <p>Loading doctor teleconsultation queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-appts-page">
      {/* Top Banner */}
      <div className="doctor-portal-header glass-panel">
        <div className="header-text-block">
          <div className="badge-pill badge-indigo">
            <span>🩺</span> Doctor Practice Portal
          </div>
          <h1>Tele-OPD & Patient Queue</h1>
          <p>Review incoming appointment requests, manage video rooms, and complete consultations</p>
        </div>

        <div className="doctor-nav-actions">
          <button
            className="btn-secondary"
            onClick={() => navigate(`/doctors/${doctorId}/availability`)}
          >
            ⏰ Set Availability
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate(`/doctors/${doctorId}`)}
          >
            👤 My Profile
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate(`/doctors/${doctorId}/notifications`)}
          >
            🔔 Notifications
          </button>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="empty-state glass-panel">
          <div className="empty-icon">🩺</div>
          <h3>No appointment requests pending</h3>
          <p>New patient booking requests will arrive here automatically in real time.</p>
        </div>
      ) : (
        <div className="doctor-appts-grid">
          {appointments.map((appointment) => {
            const statusKey = appointment.status?.toLowerCase();

            return (
              <div className="glass-panel doctor-appt-card" key={appointment._id}>
                <div className="doctor-appt-top">
                  <div className="patient-avatar-name">
                    <div className="pat-avatar-pill">👤</div>
                    <div>
                      <h2>{appointment.patient?.name || "Rural Citizen"}</h2>
                      <p className="pat-phone-sub">📞 {appointment.patient?.phone || "Phone on file"}</p>
                    </div>
                  </div>

                  <span className={`status-pill status-${statusKey}`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="patient-appt-meta-grid">
                  <div className="meta-cell">
                    <span className="meta-label">📅 Date</span>
                    <span className="meta-val">
                      {new Date(appointment.appointmentDate).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short"
                      })}
                    </span>
                  </div>

                  <div className="meta-cell">
                    <span className="meta-label">⏰ Slot Time</span>
                    <span className="meta-val">{appointment.appointmentTime}</span>
                  </div>

                  <div className="meta-cell full-width">
                    <span className="meta-label">🩺 Patient Complaint</span>
                    <span className="meta-val">{appointment.reason || "General Consultation"}</span>
                  </div>
                </div>

                {appointment.status === "Pending" && (
                  <div className="doctor-card-action-row">
                    <button
                      className="btn-primary btn-accept"
                      onClick={() => updateStatus(appointment._id, "Confirmed")}
                    >
                      ✓ Accept Consultation
                    </button>
                    <button
                      className="btn-danger btn-decline"
                      onClick={() => updateStatus(appointment._id, "Rejected")}
                    >
                      ✕ Decline
                    </button>
                  </div>
                )}

                {appointment.status === "Confirmed" && (
                  <div className="doctor-card-action-row">
                    <button
                      className="btn-primary btn-video-meet"
                      onClick={() =>
                        window.open(
                          appointment.meetLink || "https://meet.google.com/new",
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      🎥 Start Video OPD
                    </button>
                    <button
                      className="btn-secondary btn-complete"
                      onClick={() => updateStatus(appointment._id, "Completed")}
                    >
                      ✨ Complete
                    </button>
                  </div>
                )}

                {appointment.status === "Completed" && (
                  <div className="badge-completed-row">
                    <span className="badge-pill badge-emerald">✓ Session Finished</span>
                    <span className="paid-status-note">
                      Payment: {appointment.payment?.status === "paid" ? "Paid ✅" : "Pending 💳"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DoctorAppointments;
