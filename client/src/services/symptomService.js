import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Check symptoms with AI
export const checkSymptoms = async ({ symptoms, duration, severity }) => {
  const response = await axios.post(
    `${BASE_URL}/symptoms/check`,
    { symptoms, duration, severity },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Get symptom history for the logged-in patient
export const getSymptomHistory = async (token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : getAuthHeaders();
  const response = await axios.get(`${BASE_URL}/symptoms/history`, {
    headers,
  });
  return response.data;
};
