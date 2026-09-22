import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getDoctorById, updateDoctor } from "../../services/doctorService";
import { useToast } from "../../context/ToastContext";
import "../../styles/DoctorEdit.css";

function DoctorEdit() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { showCelebration, showError } = useToast();

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await getDoctorById(doctorId);
        setFormData(response.data);
      } catch (error) {
        console.error(error);
        showError("Failed to load doctor details");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await updateDoctor(doctorId, formData);
      showCelebration(response.message || "Doctor details updated successfully!", "Profile Saved ✨");
      navigate(`/doctors/${doctorId}`);
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || "Failed to update doctor profile");
    }
  };

  if (loading) {
    return (
      <div className="edit-page">
        <div className="loading-state glass-panel">
          <div className="pulse-spinner" />
          <p>Loading doctor profile for editing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-page">
      <div style={{ marginBottom: "18px" }}>
        <Link to={`/doctors/${doctorId}`} className="back-link-pill">
          ← Back to Doctor Profile
        </Link>
      </div>

      <div className="glass-panel edit-card">
        <div className="edit-header">
          <div className="badge-pill badge-indigo">
            <span>✏️</span> Practice Profile
          </div>
          <h2>Edit Doctor Practice Details</h2>
          <p>Keep your clinical qualifications, fees, and hospital details up to date</p>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="input-row-2">
            <div className="form-group">
              <label>Doctor Full Name</label>
              <input
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-row-2">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Specialization</label>
              <input
                name="specialization"
                value={formData.specialization || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-row-3">
            <div className="form-group">
              <label>Qualification</label>
              <input
                name="qualification"
                value={formData.qualification || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Experience (Years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Consultation Fee (₹)</label>
              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-row-2">
            <div className="form-group">
              <label>City / District</label>
              <input
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                name="state"
                value={formData.state || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-row-2">
            <div className="form-group">
              <label>Hospital / Clinic Name</label>
              <input
                name="hospitalOrClinicName"
                value={formData.hospitalOrClinicName || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Facility Type</label>
              <select
                name="hospitalType"
                value={formData.hospitalType || "Hospital"}
                onChange={handleChange}
              >
                <option value="Hospital">Hospital</option>
                <option value="Clinic">Clinic</option>
                <option value="PHC">Primary Health Center</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Complete Address</label>
            <textarea
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              name="image"
              value={formData.image || ""}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-primary edit-save-btn">
            Save Updated Details 💾
          </button>
        </form>
      </div>
    </div>
  );
}

export default DoctorEdit;