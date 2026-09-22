const User = require("../models/User");

exports.getPublicKey = (req, res) => {
  if (!process.env.VAPID_PUBLIC_KEY) {
    return res.status(503).json({ message: "Phone notifications are not configured" });
  }

  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};

exports.saveSubscription = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ message: "A valid push subscription is required" });
    }

    await User.findByIdAndUpdate(req.user.userId, {
      $addToSet: { pushSubscriptions: { endpoint, keys } },
    });

    res.status(201).json({ message: "Phone notifications enabled" });
  } catch (error) {
    console.error("Save push subscription error:", error);
    res.status(500).json({ message: "Unable to enable phone notifications" });
  }
};