import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getDoctorById } from "../../services/doctorService";
import { useToast } from "../../context/ToastContext";
import AuthModal from "../../components/AuthModal";
import "../../styles/DoctorProfile.css";

function DoctorProfile() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { showError } = useToast();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const savedPatient = JSON.parse(localStorage.getItem("currentPatient"));
  const patientId = savedPatient?._id;

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await getDoctorById(doctorId);
        setDoctor(response.data);
      } catch (error) {
        console.error(error);
        showError("Failed to load doctor profile details");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleBookClick = (e) => {
    if (!patientId) {
      e.preventDefault();
      setAuthModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-state glass-panel">
          <div className="pulse-spinner" />
          <p>Loading practitioner credentials & profile...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="profile-page">
        <div className="empty-state glass-panel">
          <h3>Doctor record not found</h3>
          <Link to="/doctors" className="btn-primary">
            Browse All Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div style={{ marginBottom: "18px" }}>
        <Link to="/doctors" className="back-link-pill">
          ← Back to Doctor Directory
        </Link>
      </div>

      <div className="glass-panel profile-card">
        {/* Doctor Header Banner */}
        <div className="profile-top-banner">
          <div className="profile-avatar-box">
            {doctor.image ? (
              <img src={doctor.image} alt={doctor.name} className="profile-image" />
            ) : (
              <div className="profile-placeholder">🩺</div>
            )}
            <span className="profile-online-badge" />
          </div>

          <div className="profile-main-meta">
            <div className="profile-tags-row">
              <span className="badge-pill badge-emerald">Verified Practitioner</span>
              <span className="badge-pill badge-cyan">{doctor.specialization}</span>
              <span className="badge-pill badge-indigo">{doctor.experience}+ Yrs Exp</span>
            </div>

            <h1>Dr. {doctor.name}</h1>
            <p className="profile-sub-title">
              {doctor.qualification} • {doctor.hospitalOrClinicName || "Primary Health Center"}
            </p>
          </div>

          <div className="profile-fee-card">
            <span className="fee-lbl">Consultation Fee</span>
            <div className="fee-val">₹{doctor.consultationFee || 150}</div>
            <span className="fee-sub">Tele-OPD / Clinic</span>
          </div>
        </div>

        {/* Doctor Details Grid */}
        <div className="profile-details-grid">
          <div className="prof-detail-box">
            <span className="prof-detail-label">🎓 Medical Qualification</span>
            <strong className="prof-detail-val">{doctor.qualification || "MBBS, MD"}</strong>
          </div>

          <div className="prof-detail-box">
            <span className="prof-detail-label">🏥 Hospital / Facility</span>
            <strong className="prof-detail-val">{doctor.hospitalOrClinicName || doctor.hospitalType || "Community Health Center"}</strong>
          </div>

          <div className="prof-detail-box">
            <span className="prof-detail-label">📍 District & State</span>
            <strong className="prof-detail-val">{doctor.city || "Rural"}, {doctor.state || "India"}</strong>
          </div>

          <div className="prof-detail-box">
            <span className="prof-detail-label">📞 Emergency Contact</span>
            <strong className="prof-detail-val">{doctor.phone || "Available on consultation"}</strong>
          </div>

          <div className="prof-detail-box full-span">
            <span className="prof-detail-label">📍 Practice Address</span>
            <p className="prof-detail-address">{doctor.address || "Main Village Health Complex, Primary Healthcare Center"}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="profile-actions-row">
          <Link
            to={patientId ? `/book-appointment/${doctor._id}/${patientId}` : "#"}
            onClick={handleBookClick}
            className="btn-primary profile-book-btn"
          >
            ⚡ Book Instant Consultation (₹{doctor.consultationFee || 150})
          </Link>

          <button
            className="btn-secondary"
            onClick={() => navigate(`/doctors/${doctor._id}/edit`)}
          >
            ✏️ Edit Doctor Details
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole="patient"
        onAuthSuccess={(p) => {
          navigate(`/book-appointment/${doctor._id}/${p._id}`);
        }}
      />
    </div>
  );
}

export default DoctorProfile;