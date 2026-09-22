import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerDoctor } from "../../services/doctorService";
import { useToast } from "../../context/ToastContext";
import "../../styles/DoctorRegister.css";

function DoctorRegister() {
  const navigate = useNavigate();
  const { showCelebration, showError } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    city: "",
    state: "",
    hospitalOrClinicName: "",
    hospitalType: "Hospital",
    address: "",
    image: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.specialization) {
      showError("Please complete all required practitioner fields", "Missing Fields");
      return;
    }

    setLoading(true);
    try {
      const response = await registerDoctor(formData);
      const doctorId = response.data._id;

      localStorage.setItem("doctorId", doctorId);
      localStorage.setItem("userRole", "doctor");
      localStorage.setItem("currentUser", JSON.stringify(response.data));

      showCelebration(
        `Welcome Dr. ${formData.name}! Your medical practice profile has been created and verified.`,
        "Doctor Registration Successful"
      );

      navigate(`/doctors/${doctorId}/appointments`);
    } catch (error) {
      console.error("FULL ERROR:", error);
      const msg = error.response?.data?.message || error.message || "Failed to register doctor";
      showError(msg, "Registration Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      <div className="glass-panel register-card">
        <div className="register-header">
          <div className="badge-pill badge-indigo">
            <span>🩺</span> Practitioner Portal
          </div>
          <h2>Register Medical Practice</h2>
          <p>Join India's dedicated rural telemedicine & community healthcare network</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form-grid">
          <div className="form-section-title">👤 Personal & Contact Info</div>

          <div className="input-row-2">
            <div className="form-group">
              <label>Doctor Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Dr. Priya Sharma"
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
                placeholder="doctor@hospital.org"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-row-2">
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="text"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Specialization *</label>
              <input
                type="text"
                name="specialization"
                placeholder="e.g. General Physician, Pediatrician, Cardiologist"
                value={formData.specialization}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section-title">🏥 Professional Credentials & Hospital</div>

          <div className="input-row-3">
            <div className="form-group">
              <label>Qualification *</label>
              <input
                type="text"
                name="qualification"
                placeholder="MBBS, MD, MS"
                value={formData.qualification}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Experience (Years) *</label>
              <input
                type="number"
                name="experience"
                placeholder="e.g. 8"
                value={formData.experience}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Consultation Fee (₹) *</label>
              <input
                type="number"
                name="consultationFee"
                placeholder="e.g. 150"
                value={formData.consultationFee}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-row-2">
            <div className="form-group">
              <label>Hospital or Clinic Name</label>
              <input
                type="text"
                name="hospitalOrClinicName"
                placeholder="e.g. District PHC / Community Health Center"
                value={formData.hospitalOrClinicName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Facility Type</label>
              <select
                name="hospitalType"
                value={formData.hospitalType}
                onChange={handleChange}
              >
                <option value="Hospital">Hospital</option>
                <option value="Clinic">Clinic</option>
                <option value="PHC">Primary Health Center (PHC)</option>
              </select>
            </div>
          </div>

          <div className="input-row-2">
            <div className="form-group">
              <label>City / District</label>
              <input
                type="text"
                name="city"
                placeholder="e.g. Warangal"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                placeholder="e.g. Telangana"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Complete Address / Location Details</label>
            <textarea
              name="address"
              placeholder="Block number, village, nearest landmark..."
              value={formData.address}
              onChange={handleChange}
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Profile Image URL (Optional)</label>
            <input
              type="text"
              name="image"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-primary register-submit-btn" disabled={loading}>
            {loading ? "Registering Practice..." : "Complete Doctor Registration ➜"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DoctorRegister;