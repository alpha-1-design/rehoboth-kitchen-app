import { useToast } from '../components/Toast';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationAPI } from '../services/apiService';

const Notifications = () => {
  const toast = useToast();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) { setLoading(false); return; }

    const fetchNotifications = async () => {
      try {
        const res = await notificationAPI.getAll();
        setNotifs(res);
      } catch (err) {
        console.warn('Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [navigate]);

  const handleClear = async () => {
    try {
      await notificationAPI.deleteAll();
      setNotifs([]);
      toast('All notifications cleared', "success");
    } catch (err) {
      console.warn('Failed to clear notifications');
      toast('Failed to clear notifications', "error");
    }
  };

  const styles = {
    container: { padding: '20px', fontFamily: 'sans-serif', background: '#f9f9f9', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    card: { background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '10px', borderLeft: '5px solid #2C5530', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    date: { fontSize: '10px', color: '#888', marginTop: '5px' }
  };

  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return (
    <div style={{minHeight:'100vh', background:'#f8f8f8', paddingBottom:'80px'}}>
      <div style={{background:'#2C5530', padding:'60px 20px 30px', textAlign:'center'}}>
        <div style={{fontSize:'50px', marginBottom:'10px'}}>🔔</div>
        <h2 style={{color:'white', margin:'0 0 5px'}}>Notifications</h2>
        <p style={{color:'rgba(255,255,255,0.7)', margin:0, fontSize:'14px'}}>Login to see your notifications</p>
      </div>
      <div style={{padding:'30px 20px'}}>
        <button onClick={() => { localStorage.setItem('redirectAfterLogin', '/notifications'); navigate('/login'); }} style={{width:'100%', padding:'16px', background:'#2C5530', color:'white', border:'none', borderRadius:'12px', fontSize:'16px', fontWeight:'bold', cursor:'pointer'}}>
          🔑 Login to Continue
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{color:'#2C5530', margin:0}}>🔔 Notifications</h2>
        {notifs.length > 0 && <button onClick={handleClear} style={{background:'none', border:'none', color:'red', cursor:'pointer', fontWeight:'bold'}}>Clear All</button>}
      </div>

      {loading ? (
        <p style={{textAlign:'center', color:'#888', marginTop:'50px'}}>Loading...</p>
      ) : notifs.length === 0 ? (
        <p style={{textAlign:'center', color:'#888', marginTop:'50px'}}>No new notifications.</p>
      ) : (
        notifs.map((n, i) => (
          <div key={i} style={styles.card}>
            <div>{n.message}</div>
            <div style={styles.date}>{new Date(n.createdAt).toLocaleString()}</div>
          </div>
        ))
      )}
      <button onClick={() => navigate(-1)} style={{marginTop:'20px', width:'100%', padding:'10px', background:'#ddd', border:'none', borderRadius:'5px', cursor:'pointer'}}>Back</button>
    </div>
  );
};

export default Notifications;
