import axios from "axios";

const API_URL =
  "http://localhost:5000/api/availability";

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