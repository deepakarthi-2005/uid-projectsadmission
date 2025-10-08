import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import ToastContainer from '../components/ToastContainer';

const ToastContext = createContext(null);

let idCounter = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((type, message, timeout = 3000) => {
    const id = idCounter++;
    setToasts((prev) => [...prev, { id, type, message }]);
    if (timeout) {
      setTimeout(() => remove(id), timeout);
    }
  }, [remove]);

  const api = useMemo(() => ({
    success: (msg, t) => push('success', msg, t),
    error: (msg, t) => push('error', msg, t),
    info: (msg, t) => push('info', msg, t),
    remove,
  }), [push, remove]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastContainer toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};

// no-op internal hook removed
