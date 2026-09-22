import axios from "axios";
import { API_BASE } from "./apiConfig";

const API_URL = `${API_BASE}/doctors`;

// Register Doctor
export const registerDoctor = async (doctorData) => {
  const response = await axios.post(
    `${API_URL}/register`,
    doctorData
  );

  return response.data;
};

// Get All Doctors
export const getAllDoctors = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};

// Get Doctor By ID
export const getDoctorById = async (id) => {
  const response = await axios.get(
    `${API_URL}/${id}`
  );

  return response.data;
};

// Update Doctor
export const updateDoctor = async (
  id,
  doctorData
) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    doctorData
  );

  return response.data;
};

// Delete Doctor
export const deleteDoctor = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`
  );

  return response.data;
};