import { useToast } from '../components/Toast';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToPush, isSubscribed, unsubscribeFromPush } from '../utils/pushNotifications';

const NotificationSettings = () => {
  const toast = useToast();
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.isAdmin === true;

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    const status = await isSubscribed();
    setSubscribed(status);
    setLoading(false);
  };

  const handleToggle = async () => {
    setLoading(true);
    
    if (subscribed) {
      const success = await unsubscribeFromPush();
      if (success) {
        setSubscribed(false);
        toast('Push notifications disabled ✓', "error");
      }
    } else {
      const user = JSON.parse(localStorage.getItem('user'));
      const success = await subscribeToPush(user?.email || 'guest');
      
      if (success) {
        setSubscribed(true);
        toast('Push notifications enabled! You\'ll get alerts even when the app is closed 🔔', "success");
      } else {
        toast('Failed to enable notifications. Please check browser permissions.', "warning");
      }
    }
    
    setLoading(false);
  };

  const styles = {
    container: { 
      padding: '20px', 
      fontFamily: 'sans-serif', 
      background: '#f9f9f9', 
      minHeight: '100vh' 
    },
    card: {
      background: 'white',
      padding: '20px',
      borderRadius: '15px',
      marginBottom: '15px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    toggle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      background: subscribed ? '#e8f5e9' : '#fff3e0',
      borderRadius: '10px',
      marginBottom: '10px'
    },
    button: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px'
    },
    enableBtn: {
      background: subscribed ? '#ef5350' : '#2C5530',
      color: 'white'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{color:'#2C5530', marginBottom: '20px'}}>🔔 Push Notification Settings</h2>

      <div style={styles.card}>
        <div style={styles.toggle}>
          <div>
            <h3 style={{margin: 0, fontSize: '16px'}}>
              {subscribed ? '✅ Enabled' : '🔕 Disabled'}
            </h3>
            <p style={{margin: '5px 0 0 0', fontSize: '12px', color: '#666'}}>
              Get alerts even when app is closed
            </p>
          </div>
          <button 
            onClick={handleToggle} 
            disabled={loading}
            style={{...styles.button, ...styles.enableBtn}}
          >
            {loading ? '...' : subscribed ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={{fontSize: '14px', marginTop: 0}}>ℹ️ What are Push Notifications?</h3>
        <p style={{fontSize: '13px', color: '#666', lineHeight: '1.6'}}>
          {isAdmin ? (
            <>
              • Get instant alerts for new orders<br/>
              • Get notified when customers send support messages<br/>
              • Receive alerts for new product reviews<br/>
              • Works even when the admin panel is closed
            </>
          ) : (
            <>
              • Get instant alerts when your order is confirmed<br/>
              • Receive delivery updates even when app is closed<br/>
              • Never miss replies from our support team<br/>
              • Works even after you install the app on your home screen
            </>
          )}
        </p>
      </div>

      <button 
        onClick={() => navigate(-1)} 
        style={{
          ...styles.button,
          width: '100%',
          background: '#ddd',
          color: '#333'
        }}
      >
        ← Back
      </button>
    </div>
  );
};

export default NotificationSettings;
