import { useState, useEffect, createContext, useContext, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div style={{
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '10px',
        width: '90%', maxWidth: '380px', pointerEvents: 'none'
      }}>
        {toasts.map(toast => (
          <div key={toast.id} onClick={() => removeToast(toast.id)} style={{
            pointerEvents: 'all',
            padding: '14px 18px',
            borderRadius: '14px',
            fontSize: '14px',
            fontWeight: '600',
            color: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            animation: 'slideDown 0.3s ease',
            background: toast.type === 'success' ? 'linear-gradient(135deg, #2C5530, #4a7c59)'
              : toast.type === 'error' ? 'linear-gradient(135deg, #c0392b, #e74c3c)'
              : toast.type === 'warning' ? 'linear-gradient(135deg, #e67e22, #f39c12)'
              : 'linear-gradient(135deg, #2980b9, #3498db)',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <span style={{ fontSize: '18px' }}>
              {toast.type === 'success' ? '✅'
                : toast.type === 'error' ? '❌'
                : toast.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            {toast.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
