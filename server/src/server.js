require("dotenv").config({ override: true });

const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");

// Routes
const doctorRoutes = require("./routes/doctorRoutes");
const authRoutes = require("./routes/authRoutes");
const symptomRoutes = require("./routes/symptomRoutes");
const patientRoutes = require("./routes/patientRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const pushRoutes = require("./routes/pushRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const { startMedicineReminderScheduler } = require("./services/medicineReminderService");

// Create Express app
const app = express();

// ==========================================
// Connect to MongoDB
// ==========================================

connectDB();

// ==========================================
// Middleware
// ==========================================

app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());

const frontendRoot = path.resolve(__dirname, "../..");
app.get(["/", "/demo.html"], (req, res) => {
  res.sendFile(path.join(frontendRoot, "demo.html"));
});
app.get("/sw.js", (req, res) => {
  res.sendFile(path.join(frontendRoot, "sw.js"));
});
app.get("/auth.js", (req, res) => {
  res.sendFile(path.join(frontendRoot, "auth.js"));
});

// ==========================================
// Routes
// ==========================================

// Authentication
app.use("/api/auth", authRoutes);

// Doctor
app.use("/api/doctors", doctorRoutes);

// Patient
app.use("/api/patients", patientRoutes);

// Symptoms
app.use("/api/symptoms", symptomRoutes);

// Doctor Availability
app.use("/api/availability", availabilityRoutes);

// Appointments
app.use("/api/appointments", appointmentRoutes);

// Notifications
app.use("/api/notifications", notificationRoutes);
app.use("/api/push", pushRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

// Medicines
const medicineRoutes = require("./routes/medicineRoutes");
app.use("/api/medicines", medicineRoutes);

// ==========================================
// Test Route
// ==========================================

app.get("/ping", (req, res) => {
  res.json({
    status: "ok",
  });
});

// ==========================================
// Start Server
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startMedicineReminderScheduler();
});