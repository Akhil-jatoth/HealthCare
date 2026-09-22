import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAllPatients } from "../../services/patientService";
import { getPatientAppointments } from "../../services/appointmentService";
import { getSymptomHistory } from "../../services/symptomService";
import { useToast } from "../../context/ToastContext";
import "../../styles/HealthRecords.css";

function HealthRecords() {
  const { patientId } = useParams();
  const { showSuccess, showInfo } = useToast();

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch patient profile
        const patientRes = await getAllPatients();
        const found = (patientRes.data || []).find((p) => p._id === patientId);
        setPatient(found || null);

        // Fetch appointments
        const apptRes = await getPatientAppointments(patientId);
        setAppointments(apptRes.data || []);

        // Fetch symptom history if token is available
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const sympRes = await getSymptomHistory(token);
            setSymptoms(sympRes.data || []);
          } catch (e) {
            console.log("Could not load symptom history", e);
          }
        }
      } catch (error) {
        console.error("Error loading health records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  const handleDownloadEHR = () => {
    showSuccess("Generating unified ABHA Digital Health Record PDF...", "Digital Health Record");
  };

  if (loading) {
    return (
      <div className="health-records-page">
        <div className="loading-state glass-panel">
          <div className="pulse-spinner" />
          <p>Decrypting digital health records & ABHA records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="health-records-page">
      <div className="records-top-nav">
        <Link to={`/patients/${patientId}`} className="back-link-pill">
          ← Back to Patient Profile
        </Link>
      </div>

      {/* Header */}
      <div className="records-header glass-panel">
        <div className="header-text-block">
          <div className="badge-pill badge-cyan">
            <span>🛡️</span> ABHA & Ayushman Bharat Unified
          </div>
          <h1>Digital Health Records (EHR)</h1>
          <p>Continuous longitudinal health record, consultation summaries, vitals, and lab triage logs</p>
        </div>

        <button className="btn-primary" onClick={handleDownloadEHR}>
          📥 Download Health Passport
        </button>
      </div>

      {/* Patient Basic Info Card & Vitals */}
      {patient && (
        <div className="glass-panel records-card">
          <h3>👤 Patient Identity & Rural Health Card</h3>
          <div className="patient-info-grid">
            <div className="patient-meta-pill">
              <span className="meta-lbl">Full Name</span>
              <strong className="meta-txt">{patient.name}</strong>
            </div>
            <div className="patient-meta-pill">
              <span className="meta-lbl">Demographics</span>
              <strong className="meta-txt">{patient.gender}, {patient.age} yrs</strong>
            </div>
            <div className="patient-meta-pill">
              <span className="meta-lbl">Contact Phone</span>
              <strong className="meta-txt">📞 {patient.phone}</strong>
            </div>
            <div className="patient-meta-pill">
              <span className="meta-lbl">Location / District</span>
              <strong className="meta-txt">📍 {patient.city || patient.address || "Rural Health Center"}</strong>
            </div>
          </div>

          {/* Vitals Summary */}
          <div className="vitals-row">
            <div className="vital-chip">
              <span className="vital-icon">❤️</span>
              <div>
                <span className="vital-val">74 BPM</span>
                <span className="vital-name">Heart Rate</span>
              </div>
            </div>
            <div className="vital-chip">
              <span className="vital-icon">🩸</span>
              <div>
                <span className="vital-val">120/80</span>
                <span className="vital-name">Blood Pressure</span>
              </div>
            </div>
            <div className="vital-chip">
              <span className="vital-icon">🫁</span>
              <div>
                <span className="vital-val">98%</span>
                <span className="vital-name">SpO2 Oxygen</span>
              </div>
            </div>
            <div className="vital-chip">
              <span className="vital-icon">🌡️</span>
              <div>
                <span className="vital-val">98.4 °F</span>
                <span className="vital-name">Body Temp</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consultations / Appointments History */}
      <div className="glass-panel records-card">
        <h3>📋 Consultation History ({appointments.length})</h3>
        {appointments.length === 0 ? (
          <p className="no-data">No consultations logged in EHR yet.</p>
        ) : (
          <div className="records-list">
            {appointments.map((appt) => (
              <div key={appt._id} className="glass-card-interactive record-item">
                <div className="record-main-info">
                  <h4>Dr. {appt.doctor?.name || "Practitioner"} ({appt.doctor?.specialization || "General Medicine"})</h4>
                  <p className="record-reason"><strong>Chief Complaint:</strong> {appt.reason || "General checkup"}</p>
                  <span className="record-date">
                    📅 Scheduled: {new Date(appt.scheduledAt || appt.appointmentDate).toLocaleString()}
                  </span>
                </div>
                <span className={`status-pill status-${(appt.status || "requested").toLowerCase()}`}>
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Symptom Checker History */}
      <div className="glass-panel records-card">
        <h3>🤖 AI Symptom History ({symptoms.length})</h3>
        {symptoms.length === 0 ? (
          <p className="no-data">No AI symptom checks recorded.</p>
        ) : (
          <div className="records-list">
            {symptoms.map((item) => (
              <div key={item._id} className="glass-card-interactive record-item">
                <div className="record-main-info">
                  <h4>Symptoms: {Array.isArray(item.symptoms) ? item.symptoms.join(", ") : item.symptoms}</h4>
                  <p className="record-reason"><strong>Conditions:</strong> {item.result?.possibleConditions?.join(", ") || "N/A"}</p>
                  <p className="record-advice">{item.result?.recommendation}</p>
                  <span className="record-date">Checked: {new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <span className={`badge-pill ${item.result?.urgency === "High" ? "badge-rose" : "badge-cyan"}`}>
                  {item.result?.urgency || "Moderate"} Priority
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HealthRecords;
