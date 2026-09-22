import axios from "axios";
import { API_BASE } from "./apiConfig";

const API_URL = `${API_BASE}/notifications`;

export const getDoctorNotifications =
  async (doctorId) => {

    const response = await axios.get(
      `${API_URL}/doctor/${doctorId}`
    );

    return response.data;
  };

// Mark a notification as read (PRD 5.8)
export const markNotificationAsRead =
  async (notificationId) => {
    const response = await axios.patch(
      `${API_URL}/${notificationId}/read`
    );
    return response.data;
  };