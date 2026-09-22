import axios from "axios";
import { API_BASE } from "./apiConfig";

const API_URL = `${API_BASE}/availability`;

// Get Doctor Availability
export const getDoctorAvailability =
  async (doctorId) => {
    const response = await axios.get(
      `${API_URL}/${doctorId}`
    );

    return response.data;
  };

// Update Doctor Availability
export const updateDoctorAvailability =
  async (doctorId, availability) => {
    const response = await axios.put(
      `${API_URL}/${doctorId}`,
      {
        availability,
      }
    );

    return response.data;
  };