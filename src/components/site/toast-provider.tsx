"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type ToastType = "success" | "warning" | "error" | "info";
interface ToastItem {
  id: number;
  title: string;
  message: string;
  type: ToastType;
  leaving?: boolean;
}

const ICONS: Record<ToastType, string> = {
  success: "fa-circle-check",
  warning: "fa-triangle-exclamation",
  error: "fa-circle-xmark",
  info: "fa-circle-info",
};

const ToastContext = createContext<
  ((title: string, message: string, type?: ToastType) => void) | null
>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const startLeave = useCallback(
    (id: number) => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      setTimeout(() => remove(id), 250);
    },
    [remove]
  );

  const showToast = useCallback(
    (title: string, message: string, type: ToastType = "success") => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => startLeave(id), 4000);
    },
    [startLeave]
  );

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="pt-toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pt-toast pt-toast-${t.type}${t.leaving ? " pt-toast-out" : ""}`}
          >
            <div className="pt-toast-icon">
              <i className={`fa-solid ${ICONS[t.type]}`} />
            </div>
            <div className="pt-toast-content">
              <div className="pt-toast-title">{t.title}</div>
              <div className="pt-toast-message">{t.message}</div>
            </div>
            <button
              type="button"
              className="pt-toast-close"
              aria-label="Dismiss"
              onClick={() => startLeave(t.id)}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
