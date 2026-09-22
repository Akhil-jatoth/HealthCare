import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";
import AuthModal from "./AuthModal";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showModal, showInfo, showSuccess } = useToast();
  const { language, setLanguage, t } = useLanguage();

  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState("demo");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync active user state from localStorage
  const syncUser = () => {
    const doctorId = localStorage.getItem("doctorId");
    const patientRaw = localStorage.getItem("currentPatient");
    const role = localStorage.getItem("userRole");

    if (role === "doctor" && doctorId) {
      setCurrentRole("doctor");
      setCurrentUser({ name: "Doctor Portal", id: doctorId });
    } else if (patientRaw) {
      try {
        const patient = JSON.parse(patientRaw);
        setCurrentRole("patient");
        setCurrentUser(patient);
      } catch (e) {
        setCurrentUser(null);
        setCurrentRole(null);
      }
    } else if (doctorId) {
      setCurrentRole("doctor");
      setCurrentUser({ name: "Doctor", id: doctorId });
    } else {
      setCurrentUser(null);
      setCurrentRole(null);
    }
  };

  useEffect(() => {
    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("doctorId");
    localStorage.removeItem("currentPatient");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
    setCurrentUser(null);
    setCurrentRole(null);
    showInfo("You have been signed out.", "Session Closed");
    navigate("/");
  };

  const triggerSOS = () => {
    showModal({
      title: t("sosTitle", "🚨 Rural Emergency SOS Activated"),
      type: "error",
      message: t("sosMessage", "Priority emergency alert triggered. Nearest primary health center (PHC) and community health worker (ASHA) are being notified."),
      confirmText: t("sosCallBtn", "Call 108 Ambulance"),
      cancelText: t("sosCloseBtn", "Close Alert"),
      customContent: (
        <div style={{ background: "rgba(239, 68, 68, 0.08)", padding: "14px", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.2)", marginTop: "10px" }}>
          <div style={{ fontWeight: "700", color: "#b91c1c", marginBottom: "6px" }}>⚡ Emergency Contacts:</div>
          <div style={{ fontSize: "0.9rem", color: "#334155", lineHeight: "1.6" }}>
            <div>• <strong>{t("sosNationalAmb", "National Ambulance")}:</strong> 108 / 102</div>
            <div>• <strong>{t("sosMentalHealth", "Tele-MANAS Mental Health")}:</strong> 14416</div>
            <div>• <strong>{t("sosRuralHotline", "Rural Health Hotline")}:</strong> 104</div>
            <div>• <strong>{t("sosGPS", "GPS Location")}:</strong> Latitude 17.3850° N, 78.4867° E (Simulated)</div>
          </div>
        </div>
      ),
      onConfirm: () => {
        window.open("tel:108");
      }
    });
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    showSuccess(`Language: ${lang === "HI" ? "हिंदी (Hindi)" : lang === "TE" ? "తెలుగు (Telugu)" : lang === "TA" ? "தமிழ் (Tamil)" : "English"}`);
  };

  const openLogin = (role = "demo") => {
    setAuthRole(role);
    setIsAuthOpen(true);
  };

  const getAppointmentsLink = () => {
    if (currentRole === "doctor" && currentUser?.id) {
      return `/doctors/${currentUser.id}/appointments`;
    }
    if (currentRole === "patient" && currentUser?._id) {
      return `/patients/${currentUser._id}/appointments`;
    }
    return "/doctors";
  };

  const getMedicinesLink = () => {
    if (currentUser?._id) {
      return `/patients/${currentUser._id}/medicines`;
    }
    return "/doctors";
  };

  const getRecordsLink = () => {
    if (currentUser?._id) {
      return `/patients/${currentUser._id}/health-records`;
    }
    return "/doctors";
  };

  return (
    <>
      <header className="glass-navbar-header">
        <div className="navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand">
            <div className="brand-icon-aura">
              <span className="brand-cross">✚</span>
            </div>
            <div className="brand-text-block">
              <div className="brand-title">
                {t("brandName", "Swasthya")}<span>{t("brandNameSub", "Saathi")}</span>
              </div>
              <div className="brand-badge-live">
                <span className="live-dot" /> {t("brandTagline", "AI Rural Health Net")}
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className={`navbar-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
            <Link
              to="/"
              className={`nav-link-item ${location.pathname === "/" ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              🏠 {t("navHome", "Home")}
            </Link>

            <Link
              to="/symptom-checker"
              className={`nav-link-item ${location.pathname === "/symptom-checker" ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              🤖 {t("navSymptomChecker", "AI Symptom Checker")}
            </Link>

            <Link
              to="/doctors"
              className={`nav-link-item ${location.pathname === "/doctors" ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              🩺 {t("navFindDoctors", "Find Doctors")}
            </Link>

            <Link
              to="/map"
              className={`nav-link-item ${location.pathname === "/map" ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              🗺️ Map Locator
            </Link>

            <Link
              to={getAppointmentsLink()}
              className={`nav-link-item ${location.pathname.includes("/appointments") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              📅 {currentRole === "doctor" ? t("navDoctorPortal", "Doctor Portal") : t("navAppointments", "Appointments")}
            </Link>

            <Link
              to={getMedicinesLink()}
              className={`nav-link-item ${location.pathname.includes("/medicines") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              💊 {t("navMedicines", "Medicines")}
            </Link>

            <Link
              to={getRecordsLink()}
              className={`nav-link-item ${location.pathname.includes("/health-records") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              📊 {t("navEHR", "EHR")}
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="navbar-actions-group">
            {/* SOS Trigger */}
            <button className="sos-pill-btn" onClick={triggerSOS} title="Emergency SOS Dispatch">
              <span className="sos-pulse-ring" />
              🚨 <span>{t("navSOS", "SOS")}</span>
            </button>

            {/* Language Picker */}
            <div className="lang-picker-wrapper">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="lang-select-glass"
                aria-label="Select Language"
              >
                <option value="EN">🌐 English</option>
                <option value="HI">🌐 हिंदी (Hindi)</option>
                <option value="TE">🌐 తెలుగు (Telugu)</option>
                <option value="TA">🌐 தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* Auth / Profile Pill */}
            {currentUser ? (
              <div className="user-profile-pill">
                <div className="user-avatar-tag">
                  {currentRole === "doctor" ? "🩺" : "👤"}
                </div>
                <div className="user-pill-text">
                  <div className="user-pill-name">
                    {currentUser.name || "Logged In"}
                  </div>
                  <div className="user-pill-role">
                    {currentRole === "doctor" ? t("navLoggedAsDoctor", "Doctor") : t("navLoggedAsPatient", "Patient")}
                  </div>
                </div>
                <button
                  className="user-logout-btn"
                  onClick={handleLogout}
                  title={t("navLogout", "Switch / Log Out")}
                >
                  ↩
                </button>
              </div>
            ) : (
              <div className="auth-action-buttons">
                <button
                  className="btn-secondary nav-login-btn"
                  onClick={() => openLogin("demo")}
                >
                  {t("navDemoLogin", "⚡ Demo Login")}
                </button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      {/* Auth & 1-Click Demo Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultRole={authRole}
        onAuthSuccess={syncUser}
      />
    </>
  );
};

export default Navbar;
