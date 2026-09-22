import axios from "axios";

const API_URL = "http://localhost:5000/api/payments";

// Create Razorpay payment order
export const createPaymentOrder = async (appointmentId) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/appointments/${appointmentId}/order`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Verify Razorpay payment
export const verifyPayment = async (appointmentId, paymentData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/appointments/${appointmentId}/verify`,
    paymentData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Confirm direct GPay / UPI payment via Doctor Phone
export const confirmDirectPayment = async (appointmentId, paymentMethod, transactionId) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/appointments/${appointmentId}/direct-pay`,
    { paymentMethod, transactionId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

