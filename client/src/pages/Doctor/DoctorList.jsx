import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDoctors } from "../../services/doctorService";
import { useToast } from "../../context/ToastContext";
import AuthModal from "../../components/AuthModal";
import GoogleHealthMap from "../../components/GoogleHealthMap";
import "../../styles/DoctorList.css";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("ALL");
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'map'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  const navigate = useNavigate();
  const { showError, showModal, showSuccess } = useToast();

  const fetchDoctors = async () => {
    try {
      const response = await getAllDoctors();
      const list = response.data || [];
      setDoctors(list);
      setFilteredDoctors(list);
    } catch (error) {
      console.error("Error loading doctors:", error);
      showError("Failed to load doctor listings from server", "Network Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Filter logic
  useEffect(() => {
    let list = [...doctors];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.specialization?.toLowerCase().includes(q) ||
          d.city?.toLowerCase().includes(q) ||
          d.hospitalOrClinicName?.toLowerCase().includes(q)
      );
    }
    if (selectedSpecialty !== "ALL") {
      list = list.filter((d) => d.specialization === selectedSpecialty);
    }
    setFilteredDoctors(list);
  }, [searchQuery, selectedSpecialty, doctors]);

  // Unique specialties
  const specialties = ["ALL", ...new Set(doctors.map((d) => d.specialization).filter(Boolean))];

  // ==============================
  // BOOK APPOINTMENT
  // ==============================
  const handleBook = (doctorId) => {
    const savedPatient = JSON.parse(localStorage.getItem("currentPatient"));

    if (!savedPatient || !savedPatient._id) {
      setSelectedDoctorForBooking(doctorId);
      showModal({
        title: "Patient Verification",
        type: "info",
        message: "Please select a patient profile or try 1-Click Demo Login to proceed with appointment booking.",
        confirmText: "⚡ 1-Click Demo Login",
        cancelText: "Register as Patient",
        onConfirm: () => {
          setAuthModalOpen(true);
        },
        onCancel: () => {
          navigate("/patients/register");
        },
      });
      return;
    }

    navigate(`/book-appointment/${doctorId}/${savedPatient._id}`);
  };

  // ==============================
  // VIEW DOCTOR PROFILE
  // ==============================
  const handleView = (doctorId) => {
    navigate(`/doctors/${doctorId}`);
  };

  // ==============================
  // MY APPOINTMENTS
  // ==============================
  const handleMyAppointments = () => {
    const savedPatient = JSON.parse(localStorage.getItem("currentPatient"));

    if (!savedPatient || !savedPatient._id) {
      showModal({
        title: "Patient Sign-In Required",
        type: "warning",
        message: "Sign in to view your booked consultations and medical prescriptions.",
        confirmText: "⚡ Sign In / Demo",
        cancelText: "Register Patient",
        onConfirm: () => setAuthModalOpen(true),
        onCancel: () => navigate("/patients/register"),
      });
      return;
    }

    navigate(`/patients/${savedPatient._id}/appointments`);
  };

  return (
    <div className="doctor-list-page">
      {/* Top Header */}
      <div className="doctor-list-header glass-panel">
        <div className="header-text-block">
          <div className="badge-pill badge-emerald">
            <span>🩺</span> Verified Practitioners
          </div>
          <h1>Find Rural Health Specialists</h1>
          <p>
            Connect with verified doctors across primary health centers, clinics, and district hospitals.
          </p>
        </div>

        <div className="header-action-block">
          <div className="view-mode-toggle-pill" style={{ display: "inline-flex", background: "#f1f5f9", padding: "4px", borderRadius: "10px", gap: "4px" }}>
            <button
              className={`layer-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "700",
                cursor: "pointer",
                background: viewMode === "list" ? "#ffffff" : "transparent",
                color: viewMode === "list" ? "#0f172a" : "#64748b",
                boxShadow: viewMode === "list" ? "0 2px 6px rgba(15,23,42,0.08)" : "none"
              }}
            >
              📋 Directory List
            </button>
            <button
              className={`layer-btn ${viewMode === "map" ? "active" : ""}`}
              onClick={() => setViewMode("map")}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "700",
                cursor: "pointer",
                background: viewMode === "map" ? "#0d9488" : "transparent",
                color: viewMode === "map" ? "#ffffff" : "#64748b",
                boxShadow: viewMode === "map" ? "0 2px 6px rgba(13,148,136,0.25)" : "none"
              }}
            >
              🗺️ Google Map View
            </button>
          </div>

          <button className="btn-primary" onClick={handleMyAppointments}>
            📅 My Appointments
          </button>
        </div>
      </div>

      {/* Map View or List View */}
      {viewMode === "map" ? (
        <GoogleHealthMap
          initialSpecialty={selectedSpecialty}
          onSelectDoctor={(docId) => handleBook(docId)}
        />
      ) : (
        <>
          {/* Filter & Search Bar */}
          <div className="doctor-search-bar glass-panel">
            <div className="search-input-field">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by doctor name, specialty, district, or hospital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
                  ✕
                </button>
              )}
            </div>

            <div className="specialty-filter-pills">
              {specialties.slice(0, 6).map((spec) => (
                <button
                  key={spec}
                  className={`spec-pill-btn ${selectedSpecialty === spec ? "active" : ""}`}
                  onClick={() => setSelectedSpecialty(spec)}
                >
                  {spec === "ALL" ? "All Specialties" : spec}
                </button>
              ))}
            </div>
          </div>

      {/* Main Doctor Grid */}
      {loading ? (
        <div className="loading-state glass-panel">
          <div className="pulse-spinner" />
          <p>Connecting with rural health network doctors...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="empty-state glass-panel">
          <div className="empty-icon">🩺</div>
          <h3>No doctors matching criteria</h3>
          <p>Try resetting the search filter or browse all specialties.</p>
          <button
            className="btn-secondary"
            onClick={() => {
              setSearchQuery("");
              setSelectedSpecialty("ALL");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="doctor-grid">
          {filteredDoctors.map((doctor) => (
            <div className="glass-card-interactive doctor-card" key={doctor._id}>
              <div className="doctor-card-top">
                <div className="doctor-avatar-wrapper">
                  {doctor.image ? (
                    <img src={doctor.image} alt={doctor.name} className="doctor-img" />
                  ) : (
                    <div className="doctor-avatar-fallback">
                      <span>🩺</span>
                    </div>
                  )}
                  <span className="online-badge-dot" title="Telehealth Available" />
                </div>

                <div className="doctor-primary-info">
                  <div className="doctor-tag-row">
                    <span className="badge-pill badge-emerald">Verified MD</span>
                    <span className="badge-pill badge-cyan">{doctor.specialization || "General"}</span>
                  </div>
                  <h3 className="doctor-name">Dr. {doctor.name}</h3>
                  <div className="doctor-qual">{doctor.qualification || "MBBS, MD"}</div>
                </div>
              </div>

              <div className="doctor-details-body">
                <div className="detail-item">
                  <span className="detail-label">🏥 Hospital / Clinic</span>
                  <span className="detail-val">{doctor.hospitalOrClinicName || doctor.hospitalType || "District Primary Health Center"}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">📍 Location & City</span>
                  <span className="detail-val">{doctor.city || "Rural Center"}, {doctor.state || "State"}</span>
                </div>

                <div className="detail-item-row">
                  <div>
                    <span className="detail-label">⏳ Experience</span>
                    <span className="detail-highlight">{doctor.experience || 5}+ Years</span>
                  </div>
                  <div className="fee-box">
                    <span className="detail-label">Consultation</span>
                    <span className="fee-tag">₹{doctor.consultationFee || 150}</span>
                  </div>
                </div>
              </div>

              <div className="doctor-card-footer">
                <button
                  className="btn-primary card-btn-book"
                  onClick={() => handleBook(doctor._id)}
                >
                  ⚡ Book Slot
                </button>
                <button
                  className="btn-secondary card-btn-profile"
                  onClick={() => handleView(doctor._id)}
                >
                  Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </>
      )}

      {/* Auth Modal for booking */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole="patient"
        onAuthSuccess={(patient) => {
          if (selectedDoctorForBooking && patient._id) {
            navigate(`/book-appointment/${selectedDoctorForBooking}/${patient._id}`);
          }
        }}
      />
    </div>
  );
}

export default DoctorList;