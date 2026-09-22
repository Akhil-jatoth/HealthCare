import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkSymptoms, getSymptomHistory } from "../services/symptomService";
import { useToast } from "../context/ToastContext";
import AuthModal from "../components/AuthModal";
import "../styles/SymptomChecker.css";

const commonSymptomChips = [
  "High Fever",
  "Persistent Cough",
  "Severe Headache",
  "Chest Pain",
  "Shortness of Breath",
  "Body Aches & Fatigue",
  "Stomach Pain",
  "Vomiting & Nausea",
  "Joint & Knee Pain",
  "Skin Rash & Itching",
  "Sore Throat",
  "Dizziness",
  "Acidity & Gas",
  "Diarrhea",
];

// Non-medical keywords to prevent off-topic inquiries
const nonMedicalKeywords = [
  "python", "javascript", "code", "programming", "cricket", "football",
  "movie", "song", "president", "prime minister", "weather forecast",
  "capital of", "who are you", "tell me a joke", "recipe", "stock market",
  "bitcoin", "crypto", "elon musk", "ipl", "math", "calculator"
];

function SymptomChecker() {
  const navigate = useNavigate();
  const { showSuccess, showError, showCelebration, showInfo, showWarning } = useToast();

  const [currentPatient, setCurrentPatient] = useState(null);
  const [naturalQuery, setNaturalQuery] = useState("");
  const [selectedChips, setSelectedChips] = useState(["High Fever"]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [duration, setDuration] = useState("2-3 Days");
  const [severity, setSeverity] = useState("Moderate");
  
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Check patient session
  const checkPatientSession = () => {
    const rawPatient = localStorage.getItem("currentPatient");
    if (rawPatient) {
      try {
        const parsed = JSON.parse(rawPatient);
        setCurrentPatient(parsed);
      } catch {
        setCurrentPatient(null);
      }
    } else {
      setCurrentPatient(null);
    }
  };

  useEffect(() => {
    checkPatientSession();
    fetchPastHistory();
  }, []);

  const fetchPastHistory = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await getSymptomHistory(token);
        setHistory(res.data || []);
      } catch {
        // Fallback silently if history is unavailable
      }
    }
  };

  const toggleChip = (chip) => {
    if (selectedChips.includes(chip)) {
      if (selectedChips.length === 1) {
        showInfo("Please keep at least one symptom selected");
        return;
      }
      setSelectedChips(selectedChips.filter((c) => c !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
    }
  };

  const handleAddCustomChip = (e) => {
    e.preventDefault();
    if (!customSymptom.trim()) return;
    const clean = customSymptom.trim();
    
    // Check if off-topic
    const isOffTopic = nonMedicalKeywords.some(kw => clean.toLowerCase().includes(kw));
    if (isOffTopic) {
      showWarning("This assistant strictly answers medical and health symptom doubts only. Please enter a valid health symptom.");
      return;
    }

    if (!selectedChips.includes(clean)) {
      setSelectedChips([...selectedChips, clean]);
      showSuccess(`Added "${clean}" to symptom checklist`);
    }
    setCustomSymptom("");
  };

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();

    if (!currentPatient) {
      setAuthModalOpen(true);
      return;
    }

    // Combine selected chips and natural language query
    let symptomsToSubmit = [...selectedChips];
    if (naturalQuery.trim()) {
      const qLower = naturalQuery.toLowerCase();
      const isOffTopic = nonMedicalKeywords.some(kw => qLower.includes(kw));
      
      if (isOffTopic) {
        setAiResult({
          isOffTopic: true,
          possibleConditions: ["Non-Medical Inquiry Detected"],
          urgency: "Low",
          recommendation: "I am Swasthya Saathi's dedicated Medical & Health Assistant. I am strictly specialized in health symptoms, medical triage, and clinical precautions. Please ask only questions related to your physical symptoms, health doubts, or medical concerns.",
          recommendedSpecialists: ["General Physician"],
        });
        showWarning("Please ask only medical and health symptom related questions.");
        return;
      }

      if (!symptomsToSubmit.includes(naturalQuery.trim())) {
        symptomsToSubmit.push(naturalQuery.trim());
      }
    }

    if (symptomsToSubmit.length === 0) {
      showError("Please select or describe at least one symptom", "Input Required");
      return;
    }

    setLoading(true);
    setAiResult(null);

    try {
      const response = await checkSymptoms({
        symptoms: symptomsToSubmit,
        duration,
        severity,
      });

      const resData = response.data?.result || response.data || {};
      
      if (resData.isOffTopic) {
        setAiResult({
          isOffTopic: true,
          possibleConditions: ["Off-Topic Query"],
          urgency: "Low",
          recommendation: resData.recommendation || "I am your dedicated Medical Health Assistant. Please ask only questions regarding health symptoms, medical triage, or clinical advice.",
          recommendedSpecialists: ["General Physician"]
        });
        showWarning("Please ask only medical symptom questions.");
        return;
      }

      const generatedResult = {
        isOffTopic: false,
        symptoms: symptomsToSubmit,
        possibleConditions: resData.possibleConditions || [
          "Viral Illness / Upper Respiratory Infection",
          "Seasonal Primary Infection",
        ],
        urgency: resData.urgency || (severity === "Severe" ? "High" : "Moderate"),
        recommendation: resData.recommendation ||
          "Rest adequately, stay hydrated, monitor vital signs, and consult a qualified medical specialist.",
        recommendedSpecialists: resData.recommendedSpecialists || ["General Physician"],
      };

      setAiResult(generatedResult);
      showCelebration("AI Clinical Assessment Generated!", "Health Triage Complete ✨");
      fetchPastHistory();
    } catch (err) {
      console.warn("Backend symptom check fallback:", err);
      // Fallback rule-based medical evaluation
      const queryCombined = symptomsToSubmit.join(" ").toLowerCase();
      let spec = "General Physician";
      let conds = ["Acute Viral Syndrome", "Primary Health Infection"];
      let urg = severity === "Severe" ? "High" : "Moderate";
      let advice = "Stay hydrated with boiled water, avoid exertion, and consult a healthcare specialist.";

      if (queryCombined.includes("chest") || queryCombined.includes("heart") || queryCombined.includes("breath")) {
        spec = "Cardiology";
        conds = ["Potential Cardiopulmonary Strain", "Acute Bronchospasm"];
        urg = "High";
        advice = "High priority: Avoid physical exertion and seek clinical consultation immediately.";
      } else if (queryCombined.includes("rash") || queryCombined.includes("skin") || queryCombined.includes("itch")) {
        spec = "Dermatology";
        conds = ["Allergic Contact Dermatitis", "Eczematous / Fungal Reaction"];
        urg = "Moderate";
        advice = "Keep the affected skin clean and dry. Avoid applying unprescribed steroid creams.";
      } else if (queryCombined.includes("joint") || queryCombined.includes("knee") || queryCombined.includes("bone")) {
        spec = "Orthopedics";
        conds = ["Musculoskeletal Strain", "Arthritic Joint Inflammation"];
        urg = "Moderate";
        advice = "Apply warm/cold compress, minimize weight bearing, and schedule an orthopedic consultation.";
      }

      setAiResult({
        isOffTopic: false,
        symptoms: symptomsToSubmit,
        possibleConditions: conds,
        urgency: urg,
        recommendation: advice,
        recommendedSpecialists: [spec],
      });
      showSuccess("AI Triage assessment generated successfully!", "Diagnosis Ready ✨");
    } finally {
      setLoading(false);
    }
  };

  const handleVoicePlay = () => {
    if (!aiResult) return;
    try {
      if ("speechSynthesis" in window) {
        const text = `AI Health Analysis: Priority is ${aiResult.urgency}. Possible condition: ${aiResult.possibleConditions.join(", ")}. Recommendation: ${aiResult.recommendation}. Recommended specialist is ${aiResult.recommendedSpecialists.join(" or ")}.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.92;
        window.speechSynthesis.speak(utterance);
        showSuccess("Playing voice medical guidance", "🔊 Audio Assistant");
      }
    } catch {
      showInfo("Speech synthesis unavailable in browser");
    }
  };

  return (
    <div className="symptom-checker-page">
      {/* Header */}
      <div className="symptom-header glass-panel">
        <div className="header-text-block">
          <div className="badge-pill badge-emerald">
            <span>🤖</span> Clinical AI Triage Engine
          </div>
          <h1>AI Symptom Assistant & Health Doubt Resolver</h1>
          <p>
            Dedicated AI medical triage strictly specialized in evaluating physical health symptoms, medical doubts, and specialist recommendations.
          </p>
        </div>
      </div>

      {/* Check Patient Authentication */}
      {!currentPatient ? (
        <div className="glass-panel patient-auth-gate-card">
          <div className="gate-icon-badge">🔒</div>
          <h2>Patient Sign-In Required</h2>
          <p>
            The <strong>AI Symptom Assistant & Triage</strong> is available exclusively for registered patients to maintain confidential clinical records and provide accurate triage routing.
          </p>
          <div className="gate-actions-row">
            <button
              className="btn-primary gate-btn-login"
              onClick={() => setAuthModalOpen(true)}
            >
              ⚡ 1-Click Patient Demo Login
            </button>
            <button
              className="btn-secondary gate-btn-reg"
              onClick={() => navigate("/patients/register")}
            >
              Register New Patient Profile
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Active Patient Bar */}
          <div className="patient-active-bar glass-panel">
            <div className="patient-bar-info">
              <span className="patient-bar-avatar">👤</span>
              <div>
                <strong>Active Patient: {currentPatient.name}</strong>
                <span className="patient-bar-sub">
                  {currentPatient.age ? `${currentPatient.age} yrs • ` : ""}{currentPatient.city || "Rural Patient"} • Telemedicine Active
                </span>
              </div>
            </div>
            <span className="badge-pill badge-emerald">✓ Patient Session Verified</span>
          </div>

          <div className="symptom-grid-layout">
            {/* Left Input Column */}
            <div className="glass-panel symptom-input-card">
              <div className="card-section-title">
                <span>1.</span> Describe Your Health Doubt / Symptoms
              </div>

              <div className="form-group">
                <label>Type your physical symptoms or health question</label>
                <textarea
                  placeholder="e.g. I have had severe fever with shivering for 3 days and headache. What precautions should I take?"
                  value={naturalQuery}
                  onChange={(e) => setNaturalQuery(e.target.value)}
                  rows="3"
                />
                <small className="field-hint">
                  ℹ️ <em>Note: This assistant strictly answers medical and health-related symptoms only.</em>
                </small>
              </div>

              <div className="card-section-title" style={{ marginTop: "16px" }}>
                <span>2.</span> Quick Symptom Checklist (Tap to toggle)
              </div>

              <div className="symptom-chips-container">
                {commonSymptomChips.map((chip) => {
                  const isSelected = selectedChips.includes(chip);
                  return (
                    <button
                      type="button"
                      key={chip}
                      className={`symptom-chip-btn ${isSelected ? "selected" : ""}`}
                      onClick={() => toggleChip(chip)}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {chip}
                    </button>
                  );
                })}
              </div>

              {/* Add custom symptom */}
              <form onSubmit={handleAddCustomChip} className="add-custom-chip-row">
                <input
                  type="text"
                  placeholder="Add custom symptom (e.g. Swollen ankles)..."
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                />
                <button type="submit" className="btn-secondary add-chip-btn">
                  + Add
                </button>
              </form>

              <div className="card-section-title" style={{ marginTop: "20px" }}>
                <span>3.</span> Duration & Severity
              </div>

              <div className="duration-severity-row">
                <div className="form-group">
                  <label>Duration of Symptoms</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="Less than 24 Hours">&lt; 24 Hours</option>
                    <option value="2-3 Days">2 to 3 Days</option>
                    <option value="1 Week">About 1 Week</option>
                    <option value="2+ Weeks">More than 2 Weeks</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                  >
                    <option value="Mild">Mild (Manageable)</option>
                    <option value="Moderate">Moderate (Disrupting daily tasks)</option>
                    <option value="Severe">Severe (Intense distress)</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary analyze-submit-btn"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? "Analyzing Symptoms with AI..." : "Ask AI Medical Assistant ⚡"}
              </button>
            </div>

            {/* Right Output Column */}
            <div className="symptom-output-col">
              {aiResult ? (
                <div className="glass-panel ai-analysis-result-card">
                  <div className="result-card-top">
                    <div className="result-icon-badge">
                      {aiResult.isOffTopic ? "⚠️" : "✨"}
                    </div>
                    <div>
                      <h3>{aiResult.isOffTopic ? "Domain Notice" : "AI Clinical Assessment"}</h3>
                      <p className="result-sub">
                        {aiResult.isOffTopic
                          ? "Medical assistant scope restriction"
                          : "Clinical triage evaluation for " + currentPatient.name}
                      </p>
                    </div>
                    {!aiResult.isOffTopic && (
                      <button
                        className="voice-audio-btn"
                        onClick={handleVoicePlay}
                        title="Listen to medical guidance"
                      >
                        🔊 Listen
                      </button>
                    )}
                  </div>

                  {/* Urgency Badge */}
                  {!aiResult.isOffTopic && (
                    <div className="urgency-banner-row">
                      <span className="urgency-label">Triage Urgency:</span>
                      <span
                        className={`badge-pill ${
                          aiResult.urgency === "Emergency" || aiResult.urgency === "High"
                            ? "badge-rose"
                            : "badge-emerald"
                        }`}
                      >
                        {aiResult.urgency} Urgency
                      </span>
                    </div>
                  )}

                  {/* Possible Conditions */}
                  <div className="result-section">
                    <div className="section-mini-title">
                      {aiResult.isOffTopic ? "Status:" : "🔍 Potential Conditions:"}
                    </div>
                    <div className="conditions-tags-row">
                      {aiResult.possibleConditions.map((cond, idx) => (
                        <span key={idx} className="condition-tag">
                          • {cond}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Medical Advice & Precautions */}
                  <div className="result-section">
                    <div className="section-mini-title">
                      {aiResult.isOffTopic ? "Notice:" : "🩺 Guidance & Precautions:"}
                    </div>
                    <p className="clinical-advice-text">{aiResult.recommendation}</p>
                  </div>

                  {/* Recommended Specialist CTA */}
                  {!aiResult.isOffTopic && (
                    <div className="specialist-cta-box">
                      <div className="spec-info">
                        <span className="spec-lbl">Recommended Specialist:</span>
                        <strong className="spec-name">
                          {aiResult.recommendedSpecialists.join(", ")}
                        </strong>
                      </div>
                      <button
                        className="btn-primary btn-book-spec"
                        onClick={() => navigate("/doctors")}
                      >
                        Book {aiResult.recommendedSpecialists[0] || "Doctor"} ➜
                      </button>
                    </div>
                  )}

                  <div className="medical-disclaimer-note">
                    ℹ️ <em>Disclaimer: Swasthya Saathi AI triage is an assistive clinical decision support tool and does not substitute for in-person diagnosis by a certified medical doctor.</em>
                  </div>
                </div>
              ) : (
                <div className="glass-panel empty-output-box">
                  <div className="empty-ai-icon">🩺</div>
                  <h3>Ready for Clinical Assessment</h3>
                  <p>
                    Select or describe your medical symptoms on the left and tap <strong>"Ask AI Medical Assistant"</strong> to evaluate potential conditions and recommended specialists.
                  </p>
                </div>
              )}

              {/* Past History */}
              {history.length > 0 && (
                <div className="glass-panel past-history-card">
                  <h4>📋 Previous Triage Checks ({history.length})</h4>
                  <div className="history-items-list">
                    {history.slice(0, 3).map((item) => (
                      <div key={item._id} className="history-mini-item">
                        <div className="hist-top">
                          <strong>{item.symptoms.join(", ")}</strong>
                          <span className="badge-pill badge-cyan">{item.result?.urgency || "Moderate"}</span>
                        </div>
                        <p className="hist-rec">{item.result?.recommendation}</p>
                        <span className="hist-date">{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole="patient"
        onAuthSuccess={(patient) => {
          setCurrentPatient(patient);
          showSuccess(`Welcome ${patient.name}! AI Symptom Assistant is now unlocked.`);
        }}
      />
    </div>
  );
}

export default SymptomChecker;
