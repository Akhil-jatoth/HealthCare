import axios from "axios";

const API_URL =
  "http://localhost:5000/api/notifications";

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