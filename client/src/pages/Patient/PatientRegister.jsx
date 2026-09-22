import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerPatient } from "../../services/patientService";
import { useToast } from "../../context/ToastContext";
import "../../styles/PatientRegister.css";

function PatientRegister() {
  const navigate = useNavigate();
  const { showCelebration, showError } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    city: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.age || !formData.gender) {
      showError("Please fill in all mandatory patient details", "Incomplete Form");
      return;
    }

    setLoading(true);
    try {
      const response = await registerPatient(formData);
      const patientData = response.data || response.patient || response;

      if (patientData && (patientData._id || patientData.id)) {
        localStorage.setItem("currentPatient", JSON.stringify(patientData));
        localStorage.setItem("userRole", "patient");
        localStorage.setItem("currentUser", JSON.stringify(patientData));

        showCelebration(
          `Welcome, ${formData.name}! Your rural patient digital card is active.`,
          "Patient Registration Successful"
        );

        navigate("/doctors");
      } else {
        showError("Registered, but could not retrieve Patient ID. Please try again.", "Profile Sync Error");
      }
    } catch (error) {
      console.error("Patient Registration Error:", error);
      const msg = error.response?.data?.message || error.message || "Patient registration failed";
      showError(msg, "Registration Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-register-page">
      <div className="glass-panel patient-register-card">
        <div className="register-header">
          <div className="badge-pill badge-emerald">
            <span>👤</span> Digital Patient Onboarding
          </div>
          <h2>Create Patient Health Account</h2>
          <p>Get instant access to teleconsultations, digital prescriptions, and medicine alerts</p>
        </div>

        <form onSubmit={handleSubmit} className="patient-form">
          <div className="form-row-2">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Ramesh Patel"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="ramesh@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label>Mobile Number *</label>
              <input
                type="tel"
                name="phone"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                name="age"
                placeholder="e.g. 35"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Village / Town / City *</label>
              <input
                type="text"
                name="city"
                placeholder="e.g. Rampur Village, Nizamabad"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Street / Block / Landmark</label>
              <input
                type="text"
                name="address"
                placeholder="House No., Near Primary School"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary patient-submit-btn" disabled={loading}>
            {loading ? "Creating Profile..." : "Register & Find Doctors ➜"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PatientRegister;