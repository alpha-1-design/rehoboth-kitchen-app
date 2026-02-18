import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icons';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/login') return null;

  const isActive = (path) => location.pathname === path;
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.email === 'gracee14gn@gmail.com';

  const handleAccountClick = () => {
    if (!user) navigate('/login');
    else navigate('/profile');
  };

  const styles = {
    nav: {
      position: 'fixed', bottom: 0, left: 0, width: '100%', height: '65px',
      backgroundColor: 'white', borderTop: '1px solid #eee',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 1000, paddingBottom: '5px'
    },
    btn: (active) => ({
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      border: 'none', background: 'transparent',
      color: active ? '#2C5530' : '#aaa',
      fontSize: '10px', fontWeight: active ? 'bold' : '500',
      cursor: 'pointer', width: '25%'
    })
  };

  return (
    <div style={styles.nav}>
      <button onClick={() => navigate('/')} style={styles.btn(isActive('/'))}>
        <Icon name="home" size={22} color={isActive('/') ? '#2C5530' : '#aaa'} />
        Home
      </button>

      {/* NEW TV BUTTON */}
      <button onClick={() => navigate('/videos')} style={styles.btn(isActive('/videos'))}>
        <span style={{fontSize:'22px'}}>📺</span>
        TV
      </button>

      {isAdmin ? (
        <button onClick={() => navigate('/dashboard')} style={styles.btn(isActive('/dashboard'))}>
          <Icon name="dashboard" size={22} color={isActive('/dashboard') ? '#2C5530' : '#aaa'} />
          Admin
        </button>
      ) : (
        <button onClick={() => navigate('/cart')} style={styles.btn(isActive('/cart'))}>
          <Icon name="cart" size={22} color={isActive('/cart') ? '#2C5530' : '#aaa'} />
          Cart
        </button>
      )}

      <button onClick={handleAccountClick} style={styles.btn(isActive('/profile'))}>
        <Icon name="user" size={22} color={isActive('/profile') ? '#2C5530' : '#aaa'} />
        {user ? 'Me' : 'Account'}
      </button>
    </div>
  );
};

export default BottomNav;
