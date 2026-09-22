import React, { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import axios from "axios";
import "../styles/AuthModal.css";

const AuthModal = ({ isOpen, onClose, defaultRole = "demo", onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState(defaultRole); // 'patient' | 'doctor' | 'demo'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [availablePatients, setAvailablePatients] = useState([]);
  
  const { showError, showCelebration } = useToast();

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultRole || "demo");
      setEmail("");
      setPassword("");

      // Fetch live doctors and patients from backend
      axios.get("http://localhost:5000/api/doctors")
        .then(res => setAvailableDoctors(res.data.data || []))
        .catch(() => {});

      axios.get("http://localhost:5000/api/patients")
        .then(res => setAvailablePatients(res.data.data || []))
        .catch(() => {});
    }
  }, [isOpen, defaultRole]);

  if (!isOpen) return null;

  const saveAuthSession = (user, token, role) => {
    if (token) localStorage.setItem("token", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("currentUser", JSON.stringify(user));

    if (role === "doctor") {
      const docId = user.doctorId || user._id;
      localStorage.setItem("doctorId", docId);
      localStorage.removeItem("currentPatient");
    } else {
      const patObj = user.patientRecord || user;
      localStorage.setItem("currentPatient", JSON.stringify(patObj));
      localStorage.removeItem("doctorId");
    }

    window.dispatchEvent(new Event("storage"));
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      showError("Please enter your email and password");
      return;
    }

    setLoading(true);
    const targetRole = activeTab === "doctor" ? "doctor" : "patient";

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: email.trim().toLowerCase(),
        password: password.trim(),
        role: targetRole,
      });

      if (res.data.success) {
        const user = res.data.data;
        const token = res.data.token;
        
        saveAuthSession(user, token, targetRole);
        showCelebration(`Welcome back, ${user.name || "User"}! Access granted.`, "Authentication Successful");
        
        if (onAuthSuccess) onAuthSuccess(user);
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. You can use password '123456' or choose 1-Click Demo!";
      showError(msg, "Login Notice");
    } finally {
      setLoading(false);
    }
  };

  const fillAndSubmit = (fillEmail, fillPass, role) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    if (activeTab !== role) setActiveTab(role);

    setLoading(true);
    axios.post("http://localhost:5000/api/auth/login", {
      email: fillEmail.toLowerCase(),
      password: fillPass,
      role: role,
    })
    .then(res => {
      if (res.data.success) {
        const user = res.data.data;
        const token = res.data.token;
        saveAuthSession(user, token, role);
        showCelebration(`Logged in as ${user.name || fillEmail}!`, "Instant Demo Access");
        if (onAuthSuccess) onAuthSuccess(user);
        onClose();
      }
    })
    .catch(() => {
      // Fallback local demo session if backend call fails
      const fallbackUser = {
        name: fillEmail.split("@")[0].toUpperCase(),
        email: fillEmail,
        role: role,
        _id: "demo-" + Date.now(),
      };
      saveAuthSession(fallbackUser, "demo-token-" + Date.now(), role);
      showCelebration(`Logged in as ${fallbackUser.name}!`, "Demo Session");
      if (onAuthSuccess) onAuthSuccess(fallbackUser);
      onClose();
    })
    .finally(() => setLoading(false));
  };

  // Hackathon 1-Click Quick Demo Login
  const handleDemoLogin = (entity, role) => {
    saveAuthSession(entity, "demo-token-" + Date.now(), role);

    if (role === "doctor") {
      showCelebration(`Logged in as Dr. ${entity.name} (${entity.specialization || "Doctor"})`, "Doctor Portal Active");
    } else {
      showCelebration(`Logged in as Patient: ${entity.name}`, "Patient Portal Active");
    }

    if (onAuthSuccess) onAuthSuccess(entity);
    onClose();
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose} aria-label="Close modal">✕</button>

        <div className="auth-header">
          <div className="auth-badge-pill">
            <span>🛡️</span> Swasthya Saathi Auth Portal
          </div>
          <h2>Healthcare Portal Login</h2>
          <p>Sign in with your email or test instantly using 1-Click Demo</p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tab-switch">
          <button
            type="button"
            className={`auth-tab-btn demo-pill ${activeTab === "demo" ? "active" : ""}`}
            onClick={() => setActiveTab("demo")}
          >
            ⚡ 1-Click Demo
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === "patient" ? "active" : ""}`}
            onClick={() => setActiveTab("patient")}
          >
            👤 Patient Login
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === "doctor" ? "active" : ""}`}
            onClick={() => setActiveTab("doctor")}
          >
            🩺 Doctor Login
          </button>
        </div>

        {/* 1-Click Quick Demo Tab */}
        {activeTab === "demo" && (
          <div className="demo-accounts-view">
            <div className="demo-section-title">⚡ Click any profile below for instant 1-second login:</div>
            
            <div className="demo-category">
              <h4>🩺 Verified Doctors</h4>
              <div className="demo-items-grid">
                {(availableDoctors.length > 0 ? availableDoctors.slice(0, 3) : [
                  { _id: "doc1", name: "Dr. Priya Sharma", specialization: "Cardiologist", city: "Rural Health Center", email: "priya@gmail.com" },
                  { _id: "doc2", name: "Dr. Mohammed Shameem", specialization: "General Physician", city: "Hyderabad", email: "mohammedshameem636@gmail.com" }
                ]).map((doc) => (
                  <div
                    key={doc._id}
                    className="demo-person-card"
                    onClick={() => handleDemoLogin(doc, "doctor")}
                  >
                    <div className="demo-avatar">🩺</div>
                    <div className="demo-info">
                      <div className="demo-name">Dr. {doc.name.replace(/^Dr\.\s*/i, "")}</div>
                      <div className="demo-sub">{doc.specialization || "General Physician"} • {doc.city || "Rural Center"}</div>
                    </div>
                    <span className="demo-action-chip">Select ➜</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="demo-category">
              <h4>👤 Patients</h4>
              <div className="demo-items-grid">
                {(availablePatients.length > 0 ? availablePatients.slice(0, 3) : [
                  { _id: "pat1", name: "Sania Begum", age: 24, gender: "Female", city: "Hyderabad", email: "mohammedshameem636@gmail.com" },
                  { _id: "pat2", name: "Rajesh Kumar", age: 34, gender: "Male", city: "Rural District", email: "rajesh@example.com" }
                ]).map((pat) => (
                  <div
                    key={pat._id}
                    className="demo-person-card"
                    onClick={() => handleDemoLogin(pat, "patient")}
                  >
                    <div className="demo-avatar">👤</div>
                    <div className="demo-info">
                      <div className="demo-name">{pat.name}</div>
                      <div className="demo-sub">{pat.gender || "Patient"}, {pat.age || 28} yrs • {pat.city || "Rural"}</div>
                    </div>
                    <span className="demo-action-chip">Select ➜</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Manual Login Form for Patient & Doctor */}
        {activeTab !== "demo" && (
          <div className="auth-form-wrapper">
            {/* Quick Fill Suggestions */}
            <div className="quick-fill-section">
              <span className="quick-fill-label">⚡ Quick Fill Test Account:</span>
              <div className="quick-fill-buttons">
                {activeTab === "patient" ? (
                  <>
                    <button
                      type="button"
                      className="quick-fill-chip"
                      onClick={() => fillAndSubmit("mohammedshameem636@gmail.com", "123456", "patient")}
                    >
                      👤 Sania Begum
                    </button>
                    <button
                      type="button"
                      className="quick-fill-chip"
                      onClick={() => fillAndSubmit("akhiljt166@gmail.com", "123456", "patient")}
                    >
                      👤 Akhil (Patient)
                    </button>
                    <button
                      type="button"
                      className="quick-fill-chip"
                      onClick={() => fillAndSubmit("test@gmail.com", "123456", "patient")}
                    >
                      👤 Test Patient
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="quick-fill-chip"
                      onClick={() => fillAndSubmit("priya@gmail.com", "123456", "doctor")}
                    >
                      🩺 Dr. Priya Sharma
                    </button>
                    <button
                      type="button"
                      className="quick-fill-chip"
                      onClick={() => fillAndSubmit("yash@gmail.com", "123456", "doctor")}
                    >
                      🩺 Dr. Yash
                    </button>
                    <button
                      type="button"
                      className="quick-fill-chip"
                      onClick={() => fillAndSubmit("arjun@gmail.com", "123456", "doctor")}
                    >
                      🩺 Dr. Arjun
                    </button>
                  </>
                )}
              </div>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-input-group">
                <label htmlFor="auth-email-input">Email Address</label>
                <input
                  id="auth-email-input"
                  type="email"
                  placeholder={activeTab === "doctor" ? "priya@gmail.com" : "mohammedshameem636@gmail.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="auth-input-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label htmlFor="auth-password-input">Password</label>
                  <span style={{ fontSize: "0.76rem", color: "#0d9488", fontWeight: 600 }}>Demo: 123456</span>
                </div>
                <input
                  id="auth-password-input"
                  type="password"
                  placeholder="Enter password (e.g. 123456)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                {loading ? "Signing in..." : `Sign in as ${activeTab === "doctor" ? "Doctor" : "Patient"}`}
              </button>
            </form>
          </div>
        )}

        <div className="auth-footer-prompt">
          <span>Need a new account? </span>
          <a
            href={activeTab === "doctor" ? "/doctor/register" : "/patients/register"}
            onClick={onClose}
          >
            Register New {activeTab === "doctor" ? "Doctor" : "Patient"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

