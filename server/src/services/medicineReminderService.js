const webpush = require("web-push");
const Medicine = require("../models/medicine");
const User = require("../models/User");

const configured = process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT;

if (configured) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

async function sendMedicineReminders() {
  if (!configured) return;

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const medicines = await Medicine.find({
    time: currentTime,
    startDate: { $lte: now },
    endDate: { $gte: now },
    lastReminderSentOn: { $ne: today },
  });

  for (const medicine of medicines) {
    const user = await User.findById(medicine.patientId).select("pushSubscriptions");
    const subscriptions = user?.pushSubscriptions || [];

    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(subscription.toObject(), JSON.stringify({
          title: "Medicine reminder",
          body: `Time to take ${medicine.medicineName} (${medicine.dosage})`,
          url: "/demo.html",
        }));
      } catch (error) {
        if (error.statusCode === 404 || error.statusCode === 410) {
          await User.updateOne(
            { _id: user._id },
            { $pull: { pushSubscriptions: { endpoint: subscription.endpoint } } }
          );
        } else {
          console.error("Medicine push error:", error.message);
        }
      }
    }

    await Medicine.updateOne({ _id: medicine._id }, { $set: { lastReminderSentOn: today } });
  }
}

function startMedicineReminderScheduler() {
  setInterval(() => {
    sendMedicineReminders().catch(error => console.error("Reminder scheduler error:", error.message));
  }, 60000);
}

module.exports = { startMedicineReminderScheduler };