import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SupportButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Get User
  const user = JSON.parse(localStorage.getItem('user'));

  // 2. Hide if Login Page OR if User is Admin
  if (location.pathname === '/login') return null;
  if (user && user.isAdmin === true) return null;

  const styles = {
    button: {
      position: 'fixed',
      bottom: '80px',
      right: '20px',
      backgroundColor: '#2C5530',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '55px',
      height: '55px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      cursor: 'pointer',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontSize: '24px',
      zIndex: 1000,
    }
  };

  return (
    <button style={styles.button} onClick={() => navigate('/support')} title="Contact Support">
      🎧
    </button>
  );
};

export default SupportButton;
