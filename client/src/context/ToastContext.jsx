import React, { createContext, useContext, useState, useCallback } from "react";
import ToastContainer from "../components/ToastContainer";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);

  // Play subtle visual/audio feedback if available
  const playSoundEffect = (type) => {
    try {
      // Audio synthesis for rich feedback
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "success" || type === "celebration") {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === "error") {
        osc.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
        osc.frequency.setValueAtTime(220, ctx.currentTime + 0.1); // A3
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      // Ignore audio synthesis errors on autoplay policy
    }
  };

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = "info", duration = 4000, title = "") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    playSoundEffect(type);

    const newToast = {
      id,
      message,
      type, // 'success' | 'error' | 'warning' | 'info' | 'celebration'
      duration,
      title: title || (type === "success" ? "Success" : type === "error" ? "Error" : type === "warning" ? "Notice" : "Info"),
    };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const showSuccess = useCallback((message, title = "Success", duration = 4000) => {
    return showToast(message, "success", duration, title);
  }, [showToast]);

  const showError = useCallback((message, title = "Error", duration = 4500) => {
    return showToast(message, "error", duration, title);
  }, [showToast]);

  const showWarning = useCallback((message, title = "Warning", duration = 4000) => {
    return showToast(message, "warning", duration, title);
  }, [showToast]);

  const showInfo = useCallback((message, title = "Information", duration = 4000) => {
    return showToast(message, "info", duration, title);
  }, [showToast]);

  const showCelebration = useCallback((message, title = "Awesome!", duration = 5000) => {
    return showToast(message, "celebration", duration, title);
  }, [showToast]);

  const showModal = useCallback((options) => {
    // options: { title, message, type, confirmText, cancelText, onConfirm, onCancel, icon, details }
    setModal({
      ...options,
      confirmText: options.confirmText || "OK",
      type: options.type || "info",
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showCelebration,
        showModal,
        closeModal,
        removeToast,
      }}
    >
      {children}
      <ToastContainer
        toasts={toasts}
        modal={modal}
        removeToast={removeToast}
        closeModal={closeModal}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if used outside provider
    return {
      showToast: (msg) => console.log(msg),
      showSuccess: (msg) => console.log(msg),
      showError: (msg) => console.error(msg),
      showWarning: (msg) => console.warn(msg),
      showInfo: (msg) => console.info(msg),
      showCelebration: (msg) => console.log(msg),
      showModal: (opts) => console.log(opts),
      closeModal: () => {},
      removeToast: () => {},
    };
  }
  return context;
};

export default ToastContext;
