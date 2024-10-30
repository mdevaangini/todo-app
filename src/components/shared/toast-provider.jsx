import { createContext, useContext, useEffect, useState } from "react";
import { Toast } from "./toast/toast";

export const ToastContext = createContext(() => {});
export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: null, status: null });
  const show = toast.message && toast.status ? true : false;

  useEffect(() => {
    if (!toast.message || !toast.status) return;

    const timer = setTimeout(() => {
      setToast({
        message: null,
        status: null,
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.message, toast.status]);

  return (
    <ToastContext.Provider value={setToast}>
      {children}
      {show ? <Toast message={toast.message} status={toast.status} /> : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
