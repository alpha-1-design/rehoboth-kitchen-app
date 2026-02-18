import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supportAPI } from '../services/apiService';

const SupportChat = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchHistory();
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      fetchHistory();
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchHistory = async () => {
    try {
      const res = await supportAPI.getMessages();
      setHistory(res);
    } catch (err) {
      console.warn('Failed to fetch support history');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);

    try {
      await supportAPI.sendMessage({
        name: user.name,
        email: user.email,
        message: message
      });
      setMessage('');
      await fetchHistory();
    } catch (err) {
      console.warn('Failed to send message');
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const styles = {
    container: { padding: '20px', fontFamily: 'sans-serif', height: '100vh', background: '#f4f4f4', paddingBottom: '80px', display: 'flex', flexDirection: 'column' },
    header: { fontSize: '20px', fontWeight: 'bold', color: '#2C5530', marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' },
    chatBox: { flex: 1, background: 'white', borderRadius: '10px', padding: '15px', marginBottom: '15px', overflowY: 'auto' },
    bubbleMe: { background: '#d4edda', padding: '10px', borderRadius: '10px 10px 0 10px', alignSelf: 'flex-end', marginBottom: '10px', maxWidth: '80%', marginLeft: 'auto', border: '1px solid #c3e6cb' },
    bubbleAdmin: { background: '#eee', padding: '10px', borderRadius: '10px 10px 10px 0', alignSelf: 'flex-start', marginBottom: '10px', maxWidth: '80%', border: '1px solid #ddd' },
    inputArea: { display: 'flex', gap: '10px' },
    input: { flex: 1, padding: '15px', borderRadius: '25px', border: '1px solid #ccc', outline: 'none' },
    btn: { background: '#2C5530', color: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', fontSize: '20px', cursor: 'pointer' },
    timestamp: { fontSize: '10px', color: '#888', marginTop: '5px', textAlign: 'right' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>🎧 Support Chat</div>

      <div style={styles.chatBox}>
        <div style={styles.bubbleAdmin}>
          <strong>Support Team:</strong><br/>
          Hi {user?.name}, how can we help you today?
        </div>

        {history.map((h, i) => (
          <div key={i} style={{display:'flex', flexDirection:'column'}}>
            <div style={styles.bubbleMe}>
              {h.message}
              <div style={styles.timestamp}>{new Date(h.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>

            {h.reply && (
              <div style={styles.bubbleAdmin}>
                <strong>Admin:</strong> {h.reply}
                <div style={styles.timestamp}>Rehoboth Support</div>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={styles.inputArea}>
        <input 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type your message..." 
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? '...' : '➤'}
        </button>
      </form>
    </div>
  );
};

export default SupportChat;
