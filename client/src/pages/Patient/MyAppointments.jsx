import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientAppointments } from "../../services/appointmentService";
import { confirmDirectPayment, createPaymentOrder, verifyPayment } from "../../services/paymentService";
import { useToast } from "../../context/ToastContext";
import "../../styles/MyAppointment.css";

function MyAppointments() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { showCelebration, showSuccess, showError, showInfo } = useToast();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Payment Modal state
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState("gpay");
  const [txnIdInput, setTxnIdInput] = useState("");
  const [payMessage, setPayMessage] = useState("");

  const fetchAppointments = async () => {
    try {
      const response = await getPatientAppointments(patientId);
      setAppointments(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!patientId) return;

    fetchAppointments();

    const interval = setInterval(() => {
      fetchAppointments();
    }, 6000);

    return () => clearInterval(interval);
  }, [patientId]);

  const handleJoinConsultation = (meetLink) => {
    if (!meetLink) {
      showInfo("The consultation video room is being configured by the doctor.", "Connecting Soon");
      return;
    }
    showSuccess("Launching secure telemedicine video consultation room...", "Telehealth Active");
    window.open(meetLink, "_blank", "noopener,noreferrer");
  };

  const handleOpenPayment = (appt) => {
    setSelectedAppointment(appt);
    setActiveTab("gpay");
    setTxnIdInput("");
    setPayMessage("");
  };

  const handleClosePayment = () => {
    setSelectedAppointment(null);
    setPayMessage("");
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showSuccess(`Copied to clipboard: ${text}`, "Copied");
  };

  const handleConfirmDirectPay = async (method) => {
    if (!selectedAppointment) return;
    try {
      setPayMessage("Processing payment confirmation...");
      const res = await confirmDirectPayment(selectedAppointment._id, method, txnIdInput);
      showCelebration(res.message || "Payment recorded successfully!", "Payment Successful 🎉");
      handleClosePayment();
      fetchAppointments();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Payment confirmation failed";
      setPayMessage(msg);
      showError(msg);
    }
  };

  const handleRazorpayPay = async () => {
    if (!selectedAppointment) return;
    if (!window.Razorpay) {
      showError("Razorpay checkout is loading. Please check internet connection.", "Gateway Error");
      return;
    }

    try {
      setPayMessage("Initializing Razorpay secure checkout...");
      const orderRes = await createPaymentOrder(selectedAppointment._id);
      const { orderId, amount, currency, keyId } = orderRes.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Swasthya Saathi Rural Health",
        description: "Telemedicine consultation fee",
        order_id: orderId,
        handler: async (response) => {
          try {
            await verifyPayment(selectedAppointment._id, response);
            showCelebration("Payment verified successfully via Razorpay!", "Transaction Complete 💳");
            handleClosePayment();
            fetchAppointments();
          } catch (vErr) {
            const vMsg = vErr.response?.data?.message || "Payment verification failed";
            showError(vMsg, "Verification Error");
          }
        },
        theme: { color: "#0d9488" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      const errM = err.response?.data?.message || err.message || "Unable to start Razorpay";
      setPayMessage(errM);
      showError(errM);
    }
  };

  if (loading) {
    return (
      <div className="patient-appointments-page">
        <div className="loading-state glass-panel">
          <div className="pulse-spinner" />
          <p>Loading patient consultation timeline...</p>
        </div>
      </div>
    );
  }

  const doctorPhone = selectedAppointment?.doctor?.phone || "";
  const cleanPhone = doctorPhone ? doctorPhone.replace(/\D/g, "") : "";
  const doctorUpi = cleanPhone ? `${cleanPhone}@upi` : "doctor@upi";
  const doctorFee = selectedAppointment?.doctor?.consultationFee || 0;
  const doctorName = selectedAppointment?.doctor?.name || "Doctor";
  const upiUrl = cleanPhone
    ? `upi://pay?pa=${encodeURIComponent(doctorUpi)}&pn=${encodeURIComponent("Dr " + doctorName)}&am=${doctorFee}&cu=INR`
    : "#";

  return (
    <div className="patient-appointments-page">
      {/* Header */}
      <div className="appointments-header glass-panel">
        <div className="header-text-block">
          <div className="badge-pill badge-emerald">
            <span>📅</span> Patient Consultations
          </div>
          <h1>My Telemedicine Consultations</h1>
          <p>Track your appointment status, connect to video OPD, and download digital prescriptions</p>
        </div>

        <button className="btn-primary" onClick={() => navigate("/doctors")}>
          ➕ Book New Doctor
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="empty-state glass-panel">
          <div className="empty-icon">📅</div>
          <h3>No consultations yet</h3>
          <p>You haven't scheduled any consultations with our rural health specialists.</p>
          <button className="btn-primary" onClick={() => navigate("/doctors")}>
            Browse Available Doctors ➜
          </button>
        </div>
      ) : (
        <div className="patient-appointment-list">
          {appointments.map((appointment) => {
            const isCompleted = appointment.status?.toLowerCase() === "completed";
            const isPaid = appointment.payment?.status === "paid";
            const statusKey = appointment.status?.toLowerCase();

            return (
              <div className="glass-panel patient-appointment-card" key={appointment._id}>
                {/* Top Row */}
                <div className="appointment-top">
                  <div className="doc-avatar-and-name">
                    <div className="doc-avatar-pill">🩺</div>
                    <div>
                      <h2>Dr. {appointment.doctor?.name || "Practitioner"}</h2>
                      <p className="doc-spec-sub">{appointment.doctor?.specialization || "General Medicine"}</p>
                    </div>
                  </div>

                  <span className={`status-pill status-${statusKey}`}>
                    {appointment.status === "Pending" && "⏳ Pending Confirmation"}
                    {appointment.status === "Confirmed" && "✅ Confirmed"}
                    {appointment.status === "Completed" && "✨ Completed"}
                    {appointment.status === "Rejected" && "❌ Declined"}
                    {appointment.status === "Cancelled" && "🚫 Cancelled"}
                    {!["Pending", "Confirmed", "Completed", "Rejected", "Cancelled"].includes(appointment.status) && appointment.status}
                  </span>
                </div>

                {/* Appointment Info Grid */}
                <div className="appointment-info-grid">
                  <div className="info-cell">
                    <span className="info-cell-label">📅 Date</span>
                    <span className="info-cell-val">
                      {new Date(appointment.appointmentDate || appointment.scheduledAt).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>

                  <div className="info-cell">
                    <span className="info-cell-label">⏰ Time Slot</span>
                    <span className="info-cell-val">{appointment.appointmentTime || "Scheduled Time"}</span>
                  </div>

                  <div className="info-cell">
                    <span className="info-cell-label">💳 Fee</span>
                    <span className="info-cell-val fee-highlight">₹{appointment.doctor?.consultationFee || 0}</span>
                  </div>

                  <div className="info-cell full-width">
                    <span className="info-cell-label">🩺 Chief Health Concern</span>
                    <span className="info-cell-val">{appointment.reason || "General Consultation"}</span>
                  </div>
                </div>

                {/* Status Specific Action Bars */}
                {appointment.status === "Pending" && (
                  <div className="appointment-status-banner banner-pending">
                    <p>⏳ Request submitted to doctor. You will receive an SMS and push alert once accepted.</p>
                  </div>
                )}

                {appointment.status === "Confirmed" && (
                  <div className="appointment-status-banner banner-confirmed">
                    <div className="banner-text">
                      <strong>✅ Appointment Accepted!</strong>
                      <p>Dr. {appointment.doctor?.name} is ready for your teleconsultation.</p>
                    </div>
                    {appointment.meetLink ? (
                      <button
                        className="btn-primary join-video-btn"
                        onClick={() => handleJoinConsultation(appointment.meetLink)}
                      >
                        🎥 Launch Video OPD ➜
                      </button>
                    ) : (
                      <button
                        className="btn-secondary join-video-btn"
                        onClick={() => handleJoinConsultation(`https://meet.google.com/new`)}
                      >
                        🎥 Open Video Room
                      </button>
                    )}
                  </div>
                )}

                {isCompleted && (
                  <div className="appointment-status-banner banner-completed">
                    <div className="banner-text">
                      <strong>✨ Teleconsultation Completed</strong>
                      {isPaid ? (
                        <span className="badge-pill badge-emerald">✓ Paid (Verified)</span>
                      ) : (
                        <span className="badge-pill badge-amber">Payment Pending</span>
                      )}
                    </div>

                    {!isPaid && (
                      <button
                        className="btn-primary pay-btn"
                        onClick={() => handleOpenPayment(appointment)}
                      >
                        💳 Pay ₹{appointment.doctor?.consultationFee || 0}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Glassmorphic Payment Selection Modal */}
      {selectedAppointment && (
        <div className="payment-modal-overlay" onClick={handleClosePayment}>
          <div className="glass-panel payment-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="payment-close-btn" onClick={handleClosePayment}>✕</button>

            <div className="payment-modal-header">
              <div className="payment-badge-pill">💳 Instant Micro-Payment</div>
              <h3>Consultation Fee Checkout</h3>
            </div>

            <div className="doctor-fee-box">
              <div className="fee-doc-title">Dr. {doctorName}</div>
              <div className="fee-amount-row">
                <span>Total Due:</span>
                <span className="fee-big">₹{doctorFee}</span>
              </div>
              <div className="fee-phone-sub">📞 Practitioner: {doctorPhone || "Verified Rural PHC"}</div>
            </div>

            {payMessage && (
              <div className="pay-message-banner">
                {payMessage}
              </div>
            )}

            {/* Payment Method Switch */}
            <div className="pay-tab-switch">
              <button
                className={`pay-tab-btn ${activeTab === "gpay" ? "active" : ""}`}
                onClick={() => setActiveTab("gpay")}
              >
                📲 GPay
              </button>
              <button
                className={`pay-tab-btn ${activeTab === "upi" ? "active" : ""}`}
                onClick={() => setActiveTab("upi")}
              >
                💸 Any UPI
              </button>
              <button
                className={`pay-tab-btn ${activeTab === "razorpay" ? "active" : ""}`}
                onClick={() => setActiveTab("razorpay")}
              >
                💳 Razorpay
              </button>
            </div>

            {activeTab === "gpay" && (
              <div className="pay-method-view">
                <p className="pay-instruction">Pay directly to Doctor's Google Pay mobile number:</p>
                <div className="copyable-pill-box">
                  <span className="pill-code">{doctorPhone || "9876501234"}</span>
                  <button className="btn-copy" onClick={() => handleCopy(doctorPhone || "9876501234")}>
                    Copy
                  </button>
                </div>
                <a href={upiUrl} target="_blank" rel="noreferrer" className="btn-gpay-launch">
                  🚀 Open GPay App
                </a>
                <input
                  type="text"
                  placeholder="Transaction Ref / UTR / Order ID (Optional)"
                  value={txnIdInput}
                  onChange={(e) => setTxnIdInput(e.target.value)}
                  className="glass-input txn-input"
                />
                <button
                  className="btn-primary pay-confirm-btn"
                  onClick={() => handleConfirmDirectPay("gpay")}
                >
                  ✅ Confirm GPay Payment
                </button>
              </div>
            )}

            {activeTab === "upi" && (
              <div className="pay-method-view">
                <p className="pay-instruction">Pay via PhonePe, Paytm, BHIM, or any Bank UPI ID:</p>
                <div className="copyable-pill-box">
                  <span className="pill-code">{doctorUpi}</span>
                  <button className="btn-copy" onClick={() => handleCopy(doctorUpi)}>
                    Copy VPA
                  </button>
                </div>
                <a href={upiUrl} target="_blank" rel="noreferrer" className="btn-upi-launch">
                  📱 Open Any UPI App
                </a>
                <input
                  type="text"
                  placeholder="UPI UTR Number (Optional)"
                  value={txnIdInput}
                  onChange={(e) => setTxnIdInput(e.target.value)}
                  className="glass-input txn-input"
                />
                <button
                  className="btn-primary pay-confirm-btn"
                  onClick={() => handleConfirmDirectPay("upi")}
                >
                  ✅ Confirm UPI Payment
                </button>
              </div>
            )}

            {activeTab === "razorpay" && (
              <div className="pay-method-view">
                <p className="pay-instruction">Pay securely via Credit/Debit Cards, NetBanking, or QR code.</p>
                <button
                  className="btn-primary pay-confirm-btn razorpay-btn"
                  onClick={handleRazorpayPay}
                >
                  💳 Launch Razorpay Gateway ➜
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAppointments;