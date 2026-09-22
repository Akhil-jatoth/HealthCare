import axios from "axios";

const API_URL =
  "http://localhost:5000/api/patients";

// Register Patient
export const registerPatient = async (
  patientData
) => {
  const response = await axios.post(
    `${API_URL}/register`,
    patientData
  );

  return response.data;
};

// Get All Patients
export const getAllPatients = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};