// Centralized API Base URL for both Local Development and Render Production Deployment
export const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.port === "5173"
    ? "http://localhost:5000/api"
    : "/api");

export default API_BASE;
