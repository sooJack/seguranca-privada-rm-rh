import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();
let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((type, title, message, duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (title, message) => addToast("success", title, message),
    error: (title, message) => addToast("error", title, message),
    warning: (title, message) => addToast("warning", title, message),
    info: (title, message) => addToast("info", title, message),
  };

  const icons = { success: "✓", error: "✕", warning: "⚠", info: "ℹ" };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map((toastItem) => (
          <div key={toastItem.id} className={`toast toast-${toastItem.type}`}>
            <span className="toast-icon">{icons[toastItem.type]}</span>
            <div className="toast-content">
              <div className="toast-title">{toastItem.title}</div>
              {toastItem.message && <div className="toast-message">{toastItem.message}</div>}
            </div>
            <button className="toast-close" onClick={() => removeToast(toastItem.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
