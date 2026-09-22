import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getDoctorNotifications,
  markNotificationAsRead,
} from "../../services/notificationService";
import { useToast } from "../../context/ToastContext";
import "../../styles/Notification.css";

function Notification() {
  const { doctorId } = useParams();
  const { showSuccess, showError } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await getDoctorNotifications(doctorId);
      setNotifications(response.data || []);
    } catch (error) {
      console.error(error);
      showError("Failed to load notifications", "Notification Hub");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [doctorId]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      showSuccess("Notification marked as read");
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    try {
      await Promise.all(unread.map((n) => markNotificationAsRead(n._id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showSuccess("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="loading-state glass-panel">
          <div className="pulse-spinner" />
          <p>Syncing notification center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div style={{ marginBottom: "18px" }}>
        <Link to={`/doctors/${doctorId}/appointments`} className="back-link-pill">
          ← Back to Appointments Queue
        </Link>
      </div>

      <div className="notifications-header glass-panel">
        <div className="header-text-block">
          <div className="badge-pill badge-indigo">
            <span>🔔</span> Real-Time Activity Feed
          </div>
          <h1>Doctor Notifications</h1>
          <p>Instant alerts for new patient booking requests, cancellations, and teleconsultation updates</p>
        </div>

        {unreadCount > 0 && (
          <button className="btn-secondary mark-all-read-btn" onClick={handleMarkAllAsRead}>
            Mark all read ({unreadCount})
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state glass-panel">
          <div className="empty-icon">📭</div>
          <h3>All caught up!</h3>
          <p>No new notifications or alerts for your practice.</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((notification) => (
            <div
              className={`glass-panel notification-card ${
                notification.isRead ? "read-card" : "unread-card"
              }`}
              key={notification._id}
            >
              <div className="notif-icon-tag">
                {notification.isRead ? "📭" : "🔔"}
              </div>

              <div className="notification-body">
                <p className="notif-msg">{notification.message}</p>
                <span className="notif-time">
                  📅 {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>

              {!notification.isRead && (
                <button
                  className="btn-primary mark-read-btn"
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;