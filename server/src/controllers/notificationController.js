const Notification =
  require("../models/notification");

const getDoctorNotifications =
  async (req, res) => {

    try {

      const notifications =
        await Notification.find({
          recipient: req.params.doctorId,
          recipientType: "Doctor"
        })
        .populate("appointment")
        .sort({
          createdAt: -1
        });

      res.status(200).json({
        success: true,
        data: notifications
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

// Mark a notification as read (PRD 5.8)
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDoctorNotifications,
  markAsRead,
};