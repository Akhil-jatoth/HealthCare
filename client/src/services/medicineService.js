import axios from "axios";

const API_URL = "http://localhost:5000/api/medicines";

// Get all medicines for a specific patient
export const getMedicinesByPatient = async (patientId) => {
  return await axios.get(`${API_URL}/patient/${patientId}`);
};

// Add a new medicine
export const addMedicine = async (medicineData) => {
  return await axios.post(API_URL, medicineData);
};

// Update a medicine
export const updateMedicine = async (medicineId, medicineData) => {
  return await axios.put(`${API_URL}/${medicineId}`, medicineData);
};

// Delete a medicine
export const deleteMedicine = async (medicineId) => {
  return await axios.delete(`${API_URL}/${medicineId}`);
};
