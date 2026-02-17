import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { suggestionAPI } from '../services/apiService';

const Suggestions = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      alert('Please login to send a suggestion');
      return navigate('/login');
    }

    setLoading(true);

    try {
      await suggestionAPI.create({
        name: user.name,
        email: user.email,
        text: text
      });
      alert('Suggestion Sent! Thank you.');
      navigate('/profile');
    } catch (err) {
      console.warn('Failed to send suggestion');
      alert('Failed to send suggestion');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { padding: '20px', fontFamily: 'sans-serif', background: '#fff', minHeight: '100vh' },
    input: { width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ccc', height: '150px', fontSize: '16px', marginBottom: '20px' },
    btn: { width: '100%', padding: '15px', background: '#2C5530', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <h2 style={{color: '#2C5530'}}>💡 Suggestion Box</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>
        Help us improve! Let us know what you want to see in Rehoboth Kitchen.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea 
          placeholder="I wish you sold..." 
          value={text} 
          onChange={e => setText(e.target.value)} 
          style={styles.input} 
          required 
        />
        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? 'Sending...' : 'Send Suggestion'}
        </button>
      </form>
      <button onClick={() => navigate(-1)} style={{marginTop:'15px', width:'100%', background:'none', border:'none', color:'#888', cursor:'pointer'}}>Cancel</button>
    </div>
  );
};

export default Suggestions;
