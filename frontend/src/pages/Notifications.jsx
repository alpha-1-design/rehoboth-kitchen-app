import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifs, setNotifs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return navigate('/login');

    axios.get(`http://localhost:5000/api/extras/notifications?email=${user.email}`)
      .then(res => setNotifs(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleClear = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    await axios.delete(`http://localhost:5000/api/extras/notifications?email=${user.email}`);
    setNotifs([]);
  };

  const styles = {
    container: { padding: '20px', fontFamily: 'sans-serif', background: '#f9f9f9', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    card: { background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '10px', borderLeft: '5px solid #2C5530', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    date: { fontSize: '10px', color: '#888', marginTop: '5px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{color:'#2C5530', margin:0}}>🔔 Notifications</h2>
        {notifs.length > 0 && <button onClick={handleClear} style={{background:'none', border:'none', color:'red'}}>Clear All</button>}
      </div>

      {notifs.length === 0 ? <p style={{textAlign:'center', color:'#888', marginTop:'50px'}}>No new notifications.</p> : (
        notifs.map((n, i) => (
          <div key={i} style={styles.card}>
            <div>{n.message}</div>
            <div style={styles.date}>{new Date(n.createdAt).toLocaleString()}</div>
          </div>
        ))
      )}
      <button onClick={() => navigate(-1)} style={{marginTop:'20px', width:'100%', padding:'10px', background:'#ddd', border:'none', borderRadius:'5px'}}>Back</button>
    </div>
  );
};
export default Notifications;
