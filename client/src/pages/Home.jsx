import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";
import AuthModal from "../components/AuthModal";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const { showModal, showInfo, showSuccess } = useToast();
  const { t } = useLanguage();

  const [symptomInput, setSymptomInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState("demo");

  const handleDoctorPortal = () => {
    const doctorId = localStorage.getItem("doctorId");

    if (!doctorId) {
      showModal({
        title: t("doctorTitle", "Doctor Portal") + " - Sign-in Required",
        type: "warning",
        message: "No active doctor session found. Would you like to register your medical practice or try our 1-Click Demo Doctor Account?",
        confirmText: "⚡ Try 1-Click Doctor Demo",
        cancelText: t("doctorBtnRegister", "Register as Doctor"),
        onConfirm: () => {
          setAuthRole("doctor");
          setAuthModalOpen(true);
        },
        onCancel: () => {
          navigate("/doctor/register");
        },
      });
      return;
    }

    navigate(`/doctors/${doctorId}/appointments`);
  };

  const handlePatientPortal = () => {
    const currentPatient = localStorage.getItem("currentPatient");
    if (!currentPatient) {
      showModal({
        title: t("patientTitle", "Patient Portal"),
        type: "info",
        message: "Select your preferred way to proceed: Register a new profile or use our 1-Click Demo Patient account to test immediately.",
        confirmText: "⚡ 1-Click Demo",
        cancelText: t("patientBtnRegister", "Register as Patient"),
        onConfirm: () => {
          setAuthRole("patient");
          setAuthModalOpen(true);
        },
        onCancel: () => {
          navigate("/patients/register");
        }
      });
      return;
    }
    try {
      const p = JSON.parse(currentPatient);
      navigate(`/patients/${p._id || p.id}/appointments`);
    } catch {
      navigate("/doctors");
    }
  };

  const quickSymptoms = [
    {
      id: 1,
      label: t("symptom1_label", "High Fever & Chills"),
      spec: t("symptom1_spec", "General Physician / Internal Medicine"),
      advice: t("symptom1_advice", "Check for viral infection or malaria. Hydrate and consult a general physician.")
    },
    {
      id: 2,
      label: t("symptom2_label", "Chest Discomfort"),
      spec: t("symptom2_spec", "Cardiologist"),
      advice: t("symptom2_advice", "High priority: Rest immediately. Avoid exertion and consult a cardiologist for ECG review.")
    },
    {
      id: 3,
      label: t("symptom3_label", "Child Persistent Cough"),
      spec: t("symptom3_spec", "Pediatrician"),
      advice: t("symptom3_advice", "Ensure adequate fluid intake and consult a pediatrician promptly to check respiratory airways.")
    },
    {
      id: 4,
      label: t("symptom4_label", "Skin Rash & Itching"),
      spec: t("symptom4_spec", "Dermatologist"),
      advice: t("symptom4_advice", "Avoid scratching. Consult a dermatologist for topical soothing and anti-allergen treatment.")
    },
    {
      id: 5,
      label: t("symptom5_label", "Joint & Knee Pain"),
      spec: t("symptom5_spec", "Orthopedic"),
      advice: t("symptom5_advice", "Avoid heavy weight loading. Consult an orthopedic specialist for assessment and mobility guidance.")
    }
  ];

  const runSymptomTriage = (customText) => {
    const currentPatient = localStorage.getItem("currentPatient");
    if (!currentPatient) {
      showModal({
        title: t("patientTitle", "Patient Sign-In Required"),
        type: "info",
        message: "Please sign in or use 1-Click Patient Demo to unlock the interactive AI Symptom Assistant & Triage.",
        confirmText: "⚡ 1-Click Patient Demo",
        cancelText: t("patientBtnRegister", "Register as Patient"),
        onConfirm: () => {
          setAuthRole("patient");
          setAuthModalOpen(true);
        },
        onCancel: () => {
          navigate("/patients/register");
        }
      });
      return;
    }

    const query = customText || symptomInput;
    if (!query.trim()) {
      showInfo("Please enter or select symptoms to analyze", "Symptom Checker");
      return;
    }

    setAnalyzing(true);
    setTriageResult(null);

    setTimeout(() => {
      setAnalyzing(false);
      const lower = query.toLowerCase();
      let match = quickSymptoms.find(q => lower.includes(q.label.toLowerCase()) || lower.includes("fever") || lower.includes("cough") || lower.includes("बुखार") || lower.includes("జ్వరం") || lower.includes("காய்ச்சல்"));
      
      if (lower.includes("chest") || lower.includes("heart") || lower.includes("breath") || lower.includes("सीना") || lower.includes("ఛాతీ") || lower.includes("நெஞ்சு")) {
        match = quickSymptoms[1];
      } else if (lower.includes("child") || lower.includes("baby") || lower.includes("kid") || lower.includes("बच्चा") || lower.includes("పిల్ల") || lower.includes("குழந்தை")) {
        match = quickSymptoms[2];
      } else if (lower.includes("skin") || lower.includes("rash") || lower.includes("itch") || lower.includes("त्वचा") || lower.includes("చర్మం") || lower.includes("தோல்")) {
        match = quickSymptoms[3];
      } else if (lower.includes("joint") || lower.includes("bone") || lower.includes("knee") || lower.includes("back") || lower.includes("जोड़") || lower.includes("కీళ్ళు") || lower.includes("மூட்டு")) {
        match = quickSymptoms[4];
      } else if (!match) {
        match = {
          spec: t("symptom1_spec", "General Physician"),
          advice: t("symptom1_advice", "Initial assessment indicates primary care consultation recommended."),
        };
      }

      setTriageResult({
        symptom: query,
        recommendedSpecialty: match.spec,
        clinicalAdvice: match.advice,
        urgency: (lower.includes("chest") || lower.includes("सीना") || lower.includes("ఛాతీ") || lower.includes("நெஞ்சு")) ? "High" : "Moderate",
      });

      showSuccess(`AI Triage generated: Recommended ${match.spec}`, "Smart Recommendation Ready");
    }, 400);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge-pill">
            <span className="badge-glow-dot" /> {t("heroBadge", "🏆 Hackathon Innovation • Ayushman Bharat Aligned")}
          </div>

          <h1 className="hero-title">
            {t("heroTitlePrefix", "Smart Healthcare for ")}
            <span>{t("heroTitleHighlight", "Rural & Remote")}</span>
            {t("heroTitleSuffix", " Communities")}
          </h1>

          <p className="hero-subtitle">
            {t("heroSubtitle", "Bridging the healthcare divide with AI-assisted triage, instant verified doctor teleconsultations, bilingual medicine management, and digital health records.")}
          </p>

          <div className="hero-action-buttons">
            <button
              className="btn-primary hero-btn-main"
              onClick={() => navigate("/doctors")}
            >
              {t("heroBtnDoctors", "🩺 Browse & Book Doctors ➜")}
            </button>
            <button
              className="btn-secondary hero-btn-demo"
              onClick={() => {
                setAuthRole("demo");
                setAuthModalOpen(true);
              }}
            >
              {t("heroBtnDemo", "⚡ Instant 1-Click Demo Login")}
            </button>
          </div>

          {/* Metric Badges */}
          <div className="hero-stats-row">
            <div className="stat-card glass-panel">
              <div className="stat-num">{t("statSpecialistsNum", "14+")}</div>
              <div className="stat-label">{t("statSpecialistsLabel", "Verified Specialists")}</div>
            </div>
            <div className="stat-card glass-panel">
              <div className="stat-num">{t("statConnectNum", "< 60s")}</div>
              <div className="stat-label">{t("statConnectLabel", "Instant Video Connect")}</div>
            </div>
            <div className="stat-card glass-panel">
              <div className="stat-num">{t("statTriageNum", "100%")}</div>
              <div className="stat-label">{t("statTriageLabel", "Free Triage & SOS")}</div>
            </div>
            <div className="stat-card glass-panel">
              <div className="stat-num">{t("statLanguagesNum", "4+")}</div>
              <div className="stat-label">{t("statLanguagesLabel", "Regional Languages")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI Symptom Triage Widget */}
      <section className="triage-section">
        <div className="glass-panel triage-card">
          <div className="triage-header">
            <div className="triage-icon-badge">🤖</div>
            <div>
              <h3>{t("triageTitle", "AI Symptom Assistant & Triage")}</h3>
              <p>{t("triageSubtitle", "Type your symptoms or select a quick rural health scenario")}</p>
            </div>
          </div>

          <div className="triage-input-wrapper">
            <input
              type="text"
              placeholder={t("triagePlaceholder", "e.g. High fever for 2 days, severe headache and body pain...")}
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSymptomTriage()}
            />
            <button
              className="btn-primary triage-analyze-btn"
              onClick={() => runSymptomTriage()}
              disabled={analyzing}
            >
              {analyzing ? t("triageBtnAnalyzing", "Analyzing...") : t("triageBtnAnalyze", "Analyze Symptoms ⚡")}
            </button>
          </div>

          {/* Quick chips */}
          <div className="quick-chips-row">
            <span className="chips-title">{t("triageQuickTitle", "Try Quick Scenarios:")}</span>
            {quickSymptoms.map((q) => (
              <button
                key={q.id}
                className="chip-btn"
                onClick={() => {
                  setSymptomInput(q.label);
                  runSymptomTriage(q.label);
                }}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Triage Result Box */}
          {triageResult && (
            <div className="triage-result-card">
              <div className="triage-result-header">
                <span className="badge-pill badge-emerald">
                  {t("triageCompleted", "✓ AI Analysis Complete")}
                </span>
                <span className={`badge-pill ${triageResult.urgency === "High" ? "badge-rose" : "badge-cyan"}`}>
                  {t("triagePriority", "Priority:")} {triageResult.urgency}
                </span>
              </div>
              <div className="triage-body">
                <div className="triage-spec-highlight">
                  {t("triageRecommended", "Recommended Specialist:")} <strong>{triageResult.recommendedSpecialty}</strong>
                </div>
                <p className="triage-advice">{triageResult.clinicalAdvice}</p>
                <div className="triage-cta-row">
                  <button
                    className="btn-primary btn-sm"
                    onClick={() => navigate("/doctors")}
                  >
                    {t("triageFindDoctor", "Find Specialist Now ➜")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Role Gateways */}
      <section className="gateways-section">
        <h2 className="section-title">{t("gatewaysTitle", "Select Your Healthcare Path")}</h2>
        <div className="role-selection-grid">
          {/* Patient Card */}
          <div className="glass-card-interactive role-card patient-theme">
            <div className="card-top-icon">👤</div>
            <div className="role-badge">{t("patientBadge", "For Citizens & Patients")}</div>
            <h2>{t("patientTitle", "Patient Portal")}</h2>
            <p>{t("patientDesc", "Connect with certified doctors, get AI prescriptions, receive audio medicine reminders, and keep your rural health history unified.")}</p>
            <ul className="role-features-list">
              <li>✓ {t("patientFeature1", "Instant Tele-consultations with video link")}</li>
              <li>✓ {t("patientFeature2", "AI Medicine Reminders & Dosage Alerts")}</li>
              <li>✓ {t("patientFeature3", "Secure Health Records & Digital Prescriptions")}</li>
            </ul>
            <div className="role-btn-stack">
              <button
                className="btn-primary"
                onClick={() => navigate("/patients/register")}
              >
                {t("patientBtnRegister", "Register as Patient")}
              </button>
              <button
                className="btn-secondary"
                onClick={handlePatientPortal}
              >
                {t("patientBtnDashboard", "My Patient Dashboard")}
              </button>
            </div>
          </div>

          {/* Doctor Card */}
          <div className="glass-card-interactive role-card doctor-theme">
            <div className="card-top-icon">🩺</div>
            <div className="role-badge doctor-badge">{t("doctorBadge", "For Medical Practitioners")}</div>
            <h2>{t("doctorTitle", "Doctor Portal")}</h2>
            <p>{t("doctorDesc", "Deliver care to remote underserved villages. Manage patient appointments, set flexible consultation slots, and review medical history.")}</p>
            <ul className="role-features-list">
              <li>✓ {t("doctorFeature1", "Tele-OPD Queue & Status Management")}</li>
              <li>✓ {t("doctorFeature2", "Interactive Slot & Availability Controller")}</li>
              <li>✓ {t("doctorFeature3", "Verified Digital Badging & Fee Settings")}</li>
            </ul>
            <div className="role-btn-stack">
              <button
                className="btn-primary"
                onClick={() => navigate("/doctor/register")}
              >
                {t("doctorBtnRegister", "Register as Doctor")}
              </button>
              <button
                className="btn-secondary"
                onClick={handleDoctorPortal}
              >
                {t("doctorBtnDashboard", "Doctor Portal Dashboard")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hackathon Features Highlights */}
      <section className="highlights-section">
        <h2 className="section-title">{t("highlightsTitle", "Built for Rural Realities")}</h2>
        <div className="features-grid">
          <div className="glass-panel feature-box">
            <div className="feature-icon">📶</div>
            <h3>{t("feature1Title", "Low-Bandwidth Resilient")}</h3>
            <p>{t("feature1Desc", "Optimized for 2G/3G rural networks with offline data caching and fast responsive interfaces.")}</p>
          </div>

          <div className="glass-panel feature-box">
            <div className="feature-icon">🗣️</div>
            <h3>{t("feature2Title", "Multilingual & Audio-Assisted")}</h3>
            <p>{t("feature2Desc", "Voice-friendly UI with regional language translations in Hindi, Telugu, and Tamil for high rural literacy adoption.")}</p>
          </div>

          <div className="glass-panel feature-box">
            <div className="feature-icon">💳</div>
            <h3>{t("feature3Title", "Integrated Micro-Payments")}</h3>
            <p>{t("feature3Desc", "Seamless Razorpay integration with support for UPI, QR codes, and subsidized rural consultation vouchers.")}</p>
          </div>

          <div className="glass-panel feature-box">
            <div className="feature-icon">🚨</div>
            <h3>{t("feature4Title", "1-Click Emergency SOS")}</h3>
            <p>{t("feature4Desc", "Instant ambulance dispatch, PHC alerts, and emergency helpline routing with real-time GPS telemetry.")}</p>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={authRole}
        onAuthSuccess={() => {
          if (authRole === "doctor") {
            const docId = localStorage.getItem("doctorId");
            if (docId) navigate(`/doctors/${docId}/appointments`);
          } else {
            navigate("/doctors");
          }
        }}
      />
    </div>
  );
}

export default Home;