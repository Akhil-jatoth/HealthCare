import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getMedicinesByPatient,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} from "../../services/medicineService";
import { useToast } from "../../context/ToastContext";
import "../../styles/PatientMedicine.css";

const emptyForm = {
  medicineName: "",
  dosage: "",
  frequency: "Twice a day",
  time: "09:00",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
};

function PatientMedicine() {
  const { patientId } = useParams();
  const { showSuccess, showError, showCelebration, showModal, showInfo } = useToast();

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);

  // Inline editing
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await getMedicinesByPatient(patientId);
      setMedicines(res.data || []);
    } catch (error) {
      console.error("Failed to load medicines", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchMedicines();
    }
  }, [patientId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  // Add new medicine
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.medicineName || !form.dosage) {
      showError("Please provide medicine name and dosage");
      return;
    }

    try {
      await addMedicine({ patientId, ...form });
      showCelebration(`Medicine reminder for ${form.medicineName} saved!`, "Pill Reminder Scheduled 💊");
      setForm(emptyForm);
      fetchMedicines();
    } catch (error) {
      console.error(error);
      showError("Failed to add medicine reminder");
    }
  };

  const handleEdit = (med) => {
    setEditingId(med._id);
    setEditForm({
      medicineName: med.medicineName,
      dosage: med.dosage,
      frequency: med.frequency,
      time: med.time,
      startDate: med.startDate?.split("T")[0] || "",
      endDate: med.endDate?.split("T")[0] || "",
    });
  };

  const handleEditSave = async (id) => {
    try {
      await updateMedicine(id, editForm);
      setEditingId(null);
      showSuccess("Medicine reminder updated successfully!");
      fetchMedicines();
    } catch (error) {
      console.error(error);
      showError("Failed to update medicine reminder");
    }
  };

  const handleDelete = (id, name) => {
    showModal({
      title: "Delete Medicine Reminder?",
      type: "warning",
      message: `Are you sure you want to stop reminders for ${name || "this medicine"}?`,
      confirmText: "Yes, Remove",
      cancelText: "Keep",
      onConfirm: async () => {
        try {
          await deleteMedicine(id);
          showSuccess("Reminder removed.");
          fetchMedicines();
        } catch (error) {
          showError("Failed to delete reminder");
        }
      },
    });
  };

  // Rural accessibility: Simulated Voice / Audio Reminder
  const handlePlayVoiceReminder = (med) => {
    try {
      if ("speechSynthesis" in window) {
        const text = `Namaste. Time to take your medicine: ${med.medicineName}, dosage ${med.dosage}. Please take with clean water after food.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
        showSuccess(`Playing audio reminder for ${med.medicineName}`, "🔊 Voice Assistant");
      } else {
        showInfo(`Reminder: Take ${med.medicineName} (${med.dosage}) at ${med.time}`);
      }
    } catch {
      showInfo(`Reminder: Take ${med.medicineName} (${med.dosage}) at ${med.time}`);
    }
  };

  if (loading) {
    return (
      <div className="medicine-page">
        <div className="loading-state glass-panel">
          <div className="pulse-spinner" />
          <p>Loading your medicine schedule & reminders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="medicine-page">
      <div className="medicine-top-nav">
        <Link to={`/patients/${patientId}`} className="back-link-pill">
          ← Back to Patient Profile
        </Link>
      </div>

      {/* Header */}
      <div className="medicine-header glass-panel">
        <div className="header-text-block">
          <div className="badge-pill badge-emerald">
            <span>💊</span> Smart Prescriptions & Dosages
          </div>
          <h1>Medicine Reminder & Pill Schedule</h1>
          <p>Never miss a dose with automated audio cues and rural SMS alert scheduling</p>
        </div>
      </div>

      {/* Add Medicine Form Card */}
      <div className="glass-panel medicine-add-card">
        <h3>➕ Add New Medicine Schedule</h3>
        <form className="medicine-form" onSubmit={handleSubmit}>
          <div className="form-row-2">
            <div className="form-group">
              <label>Medicine Name *</label>
              <input
                type="text"
                name="medicineName"
                required
                value={form.medicineName}
                onChange={handleChange}
                placeholder="e.g. Paracetamol / Amoxicillin / Metformin"
              />
            </div>
            <div className="form-group">
              <label>Dosage & Unit *</label>
              <input
                type="text"
                name="dosage"
                required
                value={form.dosage}
                onChange={handleChange}
                placeholder="e.g. 1 Tablet (500mg) after food"
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Frequency</label>
              <select
                name="frequency"
                required
                value={form.frequency}
                onChange={handleChange}
              >
                <option value="Once a day">Once a day (Morning)</option>
                <option value="Twice a day">Twice a day (Morning & Night)</option>
                <option value="Three times a day">Three times a day (After meals)</option>
                <option value="As needed">As needed (SOS / Pain)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Daily Reminder Time</label>
              <input
                type="time"
                name="time"
                required
                value={form.time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                required
                value={form.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Course End Date</label>
              <input
                type="date"
                name="endDate"
                required
                value={form.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary med-submit-btn">
            Set Medicine Reminder ⏰
          </button>
        </form>
      </div>

      {/* Medicines Active List */}
      <div className="glass-panel medicine-list-card">
        <h3>📋 Active Medicine Regimen ({medicines.length})</h3>
        {medicines.length === 0 ? (
          <div className="empty-meds">
            <span>💊</span>
            <p>No active medicine reminders. Add your first prescription above.</p>
          </div>
        ) : (
          <div className="medicine-items-grid">
            {medicines.map((med) => (
              <div key={med._id} className="glass-card-interactive med-item-box">
                {editingId === med._id ? (
                  <div className="med-edit-mode">
                    <input
                      type="text"
                      name="medicineName"
                      value={editForm.medicineName}
                      onChange={handleEditChange}
                      className="glass-input"
                    />
                    <input
                      type="text"
                      name="dosage"
                      value={editForm.dosage}
                      onChange={handleEditChange}
                      className="glass-input"
                    />
                    <div className="edit-btn-row">
                      <button className="btn-primary btn-sm" onClick={() => handleEditSave(med._id)}>
                        Save
                      </button>
                      <button className="btn-secondary btn-sm" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="med-box-top">
                      <div className="med-icon-tag">💊</div>
                      <div>
                        <h4>{med.medicineName}</h4>
                        <span className="med-dosage-sub">{med.dosage}</span>
                      </div>
                      <button
                        className="voice-reminder-btn"
                        onClick={() => handlePlayVoiceReminder(med)}
                        title="Play Audio Reminder"
                      >
                        🔊 Audio
                      </button>
                    </div>

                    <div className="med-meta-list">
                      <div>
                        <strong>⏰ Schedule:</strong> {med.frequency} at {med.time}
                      </div>
                      <div>
                        <strong>📅 Course:</strong> {new Date(med.startDate).toLocaleDateString()} – {new Date(med.endDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="med-action-footer">
                      <button className="btn-secondary btn-sm" onClick={() => handleEdit(med)}>
                        Edit
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(med._id, med.medicineName)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientMedicine;
