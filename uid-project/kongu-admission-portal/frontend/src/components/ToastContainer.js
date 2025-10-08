import React from 'react';
import './ToastContainer.css';

const icons = {
  success: '✅',
  error: '⚠️',
  info: 'ℹ️',
};

const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`} onClick={() => onClose(t.id)}>
          <span className="icon">{icons[t.type] || 'ℹ️'}</span>
          <span className="message">{t.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
