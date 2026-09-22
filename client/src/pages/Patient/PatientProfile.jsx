import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllPatients } from "../../services/patientService";
import { useToast } from "../../context/ToastContext";
import "../../styles/PatientProfile.css";

function PatientProfile() {
  const { patientId } = useParams();
  const { showError } = useToast();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await getAllPatients();
        const foundPatient = response.data.find(
          (p) => p._id === patientId
        );
        setPatient(foundPatient || null);
      } catch (error) {
        console.error(error);
        showError("Failed to load patient health profile");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  if (loading) {
    return (
      <div className="patient-profile-page">
        <div className="loading-state glass-panel">
          <div className="pulse-spinner" />
          <p>Loading patient digital profile...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="patient-profile-page">
        <div className="empty-state glass-panel">
          <h3>Patient Profile Not Found</h3>
          <Link to="/patients/register" className="btn-primary">
            Register New Patient
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-profile-page">
      <div className="glass-panel patient-profile-card">
        {/* Profile Avatar & Header */}
        <div className="patient-profile-top">
          <div className="patient-avatar-box">
            {patient.name?.charAt(0).toUpperCase()}
          </div>

          <div className="patient-meta-text">
            <div className="badge-pill badge-emerald">
              <span>👤</span> Active Rural Citizen
            </div>
            <h1>{patient.name}</h1>
            <p className="patient-sub-location">
              📍 {patient.city || "Rural Center"}, {patient.gender || "Citizen"} • {patient.age || "N/A"} years
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="patient-details-grid">
          <div className="patient-detail-box">
            <span className="det-label">📧 Email Address</span>
            <strong className="det-val">{patient.email}</strong>
          </div>

          <div className="patient-detail-box">
            <span className="det-label">📞 Mobile Number</span>
            <strong className="det-val">{patient.phone}</strong>
          </div>

          <div className="patient-detail-box">
            <span className="det-label">🎂 Age & Gender</span>
            <strong className="det-val">{patient.age} Yrs • {patient.gender}</strong>
          </div>

          <div className="patient-detail-box">
            <span className="det-label">📍 Village / City</span>
            <strong className="det-val">{patient.city || "Rural"}</strong>
          </div>

          <div className="patient-detail-box full-span">
            <span className="det-label">🏠 Residential Address</span>
            <p className="det-val">{patient.address || "Village center, near Primary School"}</p>
          </div>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="patient-nav-actions-row">
          <Link
            to={`/patients/${patientId}/appointments`}
            className="btn-primary pat-action-btn"
          >
            📅 My Appointments
          </Link>

          <Link
            to={`/patients/${patientId}/medicines`}
            className="btn-secondary pat-action-btn"
          >
            💊 Medicine Reminders
          </Link>

          <Link
            to={`/patients/${patientId}/health-records`}
            className="btn-accent pat-action-btn"
          >
            📊 Digital Health Records
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;