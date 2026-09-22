import axios from "axios";
import { API_BASE } from "./apiConfig";

const API_URL = `${API_BASE}/appointments`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Book Appointment
export const bookAppointment = async (appointmentData) => {
  const response = await axios.post(
    `${API_URL}/book`,
    appointmentData,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Get All Appointments
export const getAllAppointments = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};

// Get Doctor Appointments
export const getDoctorAppointments = async (doctorId) => {
  const response = await axios.get(
    `${API_URL}/doctor/${doctorId}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Get Patient Appointments
export const getPatientAppointments = async (patientId) => {
  const response = await axios.get(
    `${API_URL}/patient/${patientId}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Update Appointment Status
export const updateAppointmentStatus = async (id, status) => {
  const response = await axios.put(
    `${API_URL}/${id}/status`,
    { status },
    { headers: getAuthHeaders() }
  );
  return response.data;
};