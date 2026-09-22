const crypto = require("crypto");
const Razorpay = require("razorpay");
const Appointment = require("../models/Appointment");

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

const createPaymentOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server/.env, then restart the server.",
      });
    }
    if (req.user.role !== "patient") return res.status(403).json({ success: false, message: "Only patients can make payments" });

    const appointment = await Appointment.findOne({
      _id: req.params.appointmentId,
      patient: req.user.userId,
    }).populate("doctor", "consultationFee");

    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    // Allow payment if patient has marked their side complete
    const patientCompleted = appointment.completion?.patientCompleted === true;
    const bothCompleted = appointment.status === "completed";
    if (!patientCompleted && !bothCompleted) {
      return res.status(400).json({ success: false, message: "Consultation must be completed before payment" });
    }

    if (appointment.payment?.status === "paid") return res.status(409).json({ success: false, message: "Appointment is already paid" });

    const amount = Number(appointment.doctor?.consultationFee || 0) * 100;
    if (!Number.isInteger(amount) || amount <= 0) return res.status(400).json({ success: false, message: "Doctor consultation fee is not configured" });

    const order = await razorpay.orders.create({ amount, currency: "INR", receipt: `appt_${appointment._id}` });
    appointment.payment = { status: "pending", provider: "razorpay", orderId: order.id };
    await appointment.save();

    res.status(201).json({ success: true, data: { orderId: order.id, amount, currency: "INR", keyId: process.env.RAZORPAY_KEY_ID } });
  } catch (error) {
    console.error("Create payment order error:", error);
    res.status(500).json({ success: false, message: "Unable to create payment order" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const appointment = await Appointment.findOne({ _id: req.params.appointmentId, patient: req.user.userId });
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });
    if (!appointment.payment?.orderId || appointment.payment.orderId !== razorpay_order_id) return res.status(400).json({ success: false, message: "Invalid payment order" });

    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    if (expectedSignature !== razorpay_signature) return res.status(400).json({ success: false, message: "Payment verification failed" });

    appointment.payment.status = "paid";
    appointment.payment.paymentId = razorpay_payment_id;
    appointment.payment.paidAt = new Date();
    await appointment.save();
    res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ success: false, message: "Unable to verify payment" });
  }
};

const confirmDirectPayment = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "patient") {
      return res.status(403).json({ success: false, message: "Only patients can make payments" });
    }

    const { paymentMethod, transactionId } = req.body;
    const trimmedTransactionId = typeof transactionId === "string"
      ? transactionId.trim()
      : "";

    if (!trimmedTransactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required to confirm a direct payment",
      });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.appointmentId,
      patient: req.user.userId,
    }).populate("doctor", "name phone consultationFee specialization");

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Allow payment if the patient has marked their side as completed
    // (even if the doctor hasn't confirmed yet)
    const patientCompleted = appointment.completion?.patientCompleted === true;
    const bothCompleted = appointment.status === "completed";

    if (!patientCompleted && !bothCompleted) {
      return res.status(400).json({ success: false, message: "Consultation must be completed before payment" });
    }

    if (appointment.payment?.status === "paid") {
      return res.status(409).json({ success: false, message: "Appointment is already paid" });
    }

    const method = (paymentMethod || "upi").toLowerCase();
    const providerName = method === "gpay" ? "gpay" : "upi";

    appointment.payment = {
      status: "paid",
      provider: providerName,
      paymentId: trimmedTransactionId,
      paidAt: new Date(),
    };

    await appointment.save();

    res.json({
      success: true,
      message: `Payment of ₹${appointment.doctor?.consultationFee || 0} via ${providerName === "gpay" ? "Google Pay" : "UPI"} confirmed!`,
      data: appointment,
    });
  } catch (error) {
    console.error("Direct payment confirmation error:", error);
    res.status(500).json({ success: false, message: "Unable to confirm payment" });
  }
};

module.exports = { createPaymentOrder, verifyPayment, confirmDirectPayment };