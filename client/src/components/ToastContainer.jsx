import React from "react";
import "../styles/ToastContainer.css";

const ToastContainer = ({ toasts, modal, removeToast, closeModal }) => {
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <div className="toast-icon-wrapper toast-icon-success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="toast-icon-wrapper toast-icon-error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        );
      case "warning":
        return (
          <div className="toast-icon-wrapper toast-icon-warning">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        );
      case "celebration":
        return (
          <div className="toast-icon-wrapper toast-icon-celebration">
            ✨
          </div>
        );
      default:
        return (
          <div className="toast-icon-wrapper toast-icon-info">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
        );
    }
  };

  return (
    <>
      {/* Toast Notification Container */}
      <div className="toast-master-container" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`glass-toast-card toast-type-${toast.type}`}
          >
            <div className="toast-inner-content">
              {getIcon(toast.type)}
              <div className="toast-text-group">
                {toast.title && <h5 className="toast-title">{toast.title}</h5>}
                <p className="toast-msg">{toast.message}</p>
              </div>
              <button
                className="toast-close-btn"
                onClick={() => removeToast(toast.id)}
                aria-label="Close Notification"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Global Modal */}
      {modal && (
        <div className="glass-modal-overlay" onClick={closeModal}>
          <div
            className={`glass-modal-card modal-type-${modal.type || "info"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-icon-btn" onClick={closeModal}>
              ✕
            </button>

            <div className="modal-header-section">
              <div className="modal-icon-badge">
                {modal.type === "success" && "✓"}
                {modal.type === "error" && "⚠️"}
                {modal.type === "warning" && "🔔"}
                {modal.type === "celebration" && "✨"}
                {modal.type === "info" && "ℹ️"}
                {!["success", "error", "warning", "celebration", "info"].includes(modal.type) && "🩺"}
              </div>
              <h3 className="modal-title">{modal.title || "Notice"}</h3>
            </div>

            <div className="modal-body-content">
              <p className="modal-description">{modal.message}</p>
              {modal.customContent && (
                <div className="modal-custom-slot">{modal.customContent}</div>
              )}
            </div>

            <div className="modal-actions-footer">
              {modal.onCancel && (
                <button
                  className="btn-secondary modal-btn-cancel"
                  onClick={() => {
                    modal.onCancel();
                    closeModal();
                  }}
                >
                  {modal.cancelText || "Cancel"}
                </button>
              )}

              <button
                className="btn-primary modal-btn-confirm"
                onClick={() => {
                  if (modal.onConfirm) modal.onConfirm();
                  closeModal();
                }}
              >
                {modal.confirmText || "Got It"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ToastContainer;
