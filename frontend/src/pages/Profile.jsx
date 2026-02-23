import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InstallPrompt from '../components/InstallPrompt';
import Icon from '../components/Icons';
import { validateGhanaPhone } from '../utils/validators';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGhanaPost, setEditGhanaPost] = useState('');
  const [editMomo, setEditMomo] = useState('');
  const [editRegion, setEditRegion] = useState('Ashanti');
  const [editFile, setEditFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const regions = [
    "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern",
    "Greater Accra", "North East", "Northern", "Oti", "Savannah",
    "Upper East", "Upper West", "Volta", "Western", "Western North"
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) navigate('/login');
    else {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setEditName(parsed.name);
      setEditPhone(parsed.phone || '');
      setEditGhanaPost(parsed.ghanaPost || '');
      setEditMomo(parsed.momoNumber || '');
      setEditRegion(parsed.region || 'Ashanti');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Rehoboth Kitchen', text: 'Best appliances!', url: window.location.origin });
    } else {
      alert("Link copied: " + window.location.origin);
    }
  };

  const handleSave = async () => {
    if (editPhone) {
        const phoneCheck = validateGhanaPhone(editPhone);
        if (!phoneCheck.isValid) return alert("Contact Phone: " + phoneCheck.message);
    }
    if (editMomo) {
        const momoCheck = validateGhanaPhone(editMomo);
        if (!momoCheck.isValid) return alert("Momo Number: " + momoCheck.message);
    }

    const formData = new FormData();
    formData.append('_id', user._id);
    formData.append('name', editName);
    formData.append('phone', editPhone);
    formData.append('ghanaPost', editGhanaPost);
    formData.append('momoNumber', editMomo);
    formData.append('region', editRegion);
    if (editFile) formData.append('avatar', editFile);

    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL || 'https://rehoboth-backend.onrender.com'}/api/auth/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setIsEditing(false);
      alert("Profile Updated!");
    } catch (err) { alert("Update failed"); }
  };

  if (!user) return null;
  
  const isAdmin = user && user.isAdmin === true;

  const getAvatarUrl = (path) => {
    if (preview) return preview;
    if (!path) return 'https://via.placeholder.com/150?text=User';
    return `${import.meta.env.VITE_API_URL || 'https://rehoboth-backend.onrender.com'}${path}`;
  };

  const styles = {
    container: { fontFamily: 'sans-serif', minHeight: '100vh', paddingBottom: '90px', width: '100%' },
    header: { padding: '30px 20px', textAlign: 'center', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px', marginBottom: '20px' },
    avatar: { width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '4px solid rgba(255,255,255,0.8)', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' },
    editIcon: { position: 'absolute', bottom: '0', right: '0', background: 'white', borderRadius: '50%', padding: '6px', fontSize: '14px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' },
    gridContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '0 20px', marginBottom: '20px' },
    gridItem: { padding: '20px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
    gridText: { fontSize: '12px', fontWeight: 'bold', color: '#555' },
    listPanel: { margin: '0 20px', overflow: 'hidden' },
    listItem: { display: 'flex', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid rgba(0,0,0,0.05)', alignItems: 'center', cursor: 'pointer' },
    listText: { fontSize: '14px', color: '#333', fontWeight: '600' },
    listVal: { fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', fontSize: '14px', color: '#333' },
    label: { display:'block', fontSize:'12px', fontWeight:'bold', color:'#2C5530', marginBottom:'5px', textAlign:'left' },
    saveBtn: { width: '100%', padding: '12px', background: '#2C5530', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', marginTop: '10px' }
  };

  return (
    <div style={styles.container}>
      <div className="glass-header" style={styles.header}>
        <div style={{position:'relative', width: '90px', margin: '0 auto'}}>
          <img src={getAvatarUrl(user.avatar)} style={styles.avatar} alt="Avatar" />
          {isEditing && <label htmlFor="f" style={styles.editIcon}>📷<input id="f" type="file" hidden onChange={e => {setEditFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0]))}} /></label>}
        </div>

        <div style={{marginTop: '15px'}}>
          {isEditing ? (
            <input value={editName} onChange={e => setEditName(e.target.value)} style={{...styles.input, textAlign:'center'}} placeholder="Name" />
          ) : (
            <>
              <h2 style={{margin:0, fontSize:'22px'}}>{user.name} {isAdmin && ' (Admin)'}</h2>
              <p style={{opacity:0.8, fontSize:'13px'}}>{user.email}</p>
              {!isAdmin && <p style={{opacity:0.8, fontSize:'13px'}}>📍 {user.region}, Ghana</p>}
              <button onClick={() => setIsEditing(true)} style={{marginTop:'10px', background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', color:'white', padding:'5px 15px', borderRadius:'15px', fontSize:'12px'}}>Edit Profile</button>
            </>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="glass-panel" style={{margin: '20px', padding: '20px'}}>
          {!isAdmin && (
            <>
              <label style={styles.label}>Region</label>
              <select value={editRegion} onChange={e => setEditRegion(e.target.value)} style={styles.input}>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <label style={styles.label}>GhanaPost GPS</label>
              <input value={editGhanaPost} onChange={e => setEditGhanaPost(e.target.value)} style={styles.input} placeholder="GA-000-0000" />
            </>
          )}
          <label style={styles.label}>Phone Number</label>
          <input value={editPhone} onChange={e => setEditPhone(e.target.value)} style={styles.input} placeholder="020..." />
          {!isAdmin && (
            <>
              <label style={styles.label}>Momo Number</label>
              <input value={editMomo} onChange={e => setEditMomo(e.target.value)} style={styles.input} placeholder="024..." />
            </>
          )}
          <button onClick={handleSave} style={styles.saveBtn}>Save Details</button>
          <button onClick={() => setIsEditing(false)} style={{...styles.saveBtn, background:'#ddd', color:'#333'}}>Cancel</button>
        </div>
      )}

      {!isEditing && (
        <div className="glass-panel" style={{margin: '20px 20px'}}>
          <div style={styles.gridContainer}>
            {!isAdmin ? (
              <>
                <div style={styles.gridItem} onClick={() => navigate('/my-reviews')}><Icon name="star" color="#f39c12" /><span style={styles.gridText}>My Reviews</span></div>
                <div style={styles.gridItem} onClick={() => navigate('/suggestions')}><Icon name="bulb" color="#2980b9" /><span style={styles.gridText}>Suggestions</span></div>
                <div style={styles.gridItem} onClick={() => alert('Susu feature coming soon!')}><Icon name="dashboard" color="#27ae60" /><span style={styles.gridText}>My Susu</span></div>
                <div style={styles.gridItem} onClick={() => navigate('/support')}><Icon name="support" color="#e74c3c" /><span style={styles.gridText}>Support</span></div>
              </>
            ) : (
              <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '10px', color: '#555', fontSize: '13px'}}>
                <Icon name="dashboard" color="#2C5530" size={40} /><p>Welcome, Manager.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!isEditing && (
        <div className="glass-panel" style={styles.listPanel}>
          {!isAdmin && (
            <>
              <div style={styles.listItem} onClick={() => setIsEditing(true)}><span style={styles.listText}>Region & Address</span><span style={styles.listVal}>{user.region} ›</span></div>
              <div style={styles.listItem} onClick={() => setIsEditing(true)}><span style={styles.listText}>Payment Methods</span><span style={styles.listVal}>{user.momoNumber ? 'Saved' : 'Add'} ›</span></div>
            </>
          )}
          <div style={styles.listItem} onClick={() => navigate('/notification-settings')}><span style={styles.listText}>🔔 Push Notifications</span><span style={styles.listVal}>›</span></div>
          <div style={styles.listItem} onClick={() => navigate('/privacy')}>
              <span style={styles.listText}>🔒 Privacy Policy</span>
              <span style={styles.listVal}>›</span>
            </div>
            <div style={styles.listItem} onClick={() => navigate('/about')}><span style={styles.listText}>About Rehoboth</span><span style={styles.listVal}>›</span></div>
          <div style={styles.listItem} onClick={handleShare}><span style={styles.listText}>Share App</span><span style={styles.listVal}><Icon name="arrowRight" size={16} /></span></div>
          {isAdmin && <div style={{...styles.listItem, background:'rgba(44,85,48,0.1)'}} onClick={() => navigate('/dashboard')}><span style={{...styles.listText, color:'#2C5530', fontWeight:'bold'}}>Admin Dashboard</span><span style={styles.listVal}>›</span></div>}
          <div style={{...styles.listItem, borderBottom:'none'}} onClick={handleLogout}><span style={{...styles.listText, color:'red', display:'flex', gap:'10px', alignItems:'center'}}><Icon name="logout" size={18} color="red" /> Sign out</span></div>
        </div>
      )}
      {!isEditing && <div style={{padding:'20px'}}><InstallPrompt /></div>}
    </div>
  );
};

export default Profile;
