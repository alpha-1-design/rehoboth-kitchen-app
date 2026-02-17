import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    // Auto hide after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: { icon: '✔', color: '#2ecc71' },
    error: { icon: '✕', color: '#e74c3c' },
    warning: { icon: '⚠', color: '#f39c12' },
    info: { icon: 'ℹ', color: '#3498db' }
  };

  const { icon, color } = typeStyles[type] || typeStyles.success;

  const styles = {
    toast: {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(30, 30, 30, 0.9)',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '50px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      zIndex: 9999,
      fontSize: '14px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      animation: 'slideDown 0.3s ease-out'
    },
    icon: { color }
  };

  return (
    <div style={styles.toast}>
      <span style={styles.icon}>{icon}</span> {message}
      <style>{`
        @keyframes slideDown {
          from { top: -50px; opacity: 0; }
          to { top: 20px; opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
