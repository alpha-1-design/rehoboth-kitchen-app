import { useToast } from '../components/Toast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoAPI } from '../services/apiService';

const VideoFeed = () => {
  const toast = useToast();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.email === 'gracee14gn@gmail.com';

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await videoAPI.getAll();
        setVideos(res);
      } catch (err) {
        console.warn('Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const getUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const API_BASE_URL = 'https://rehoboth-backend.onrender.com';
    return `${API_BASE_URL}${path}`;
  };

  const handleDelete = async (id) => {
    if (confirm('Delete video?')) {
      try {
        await videoAPI.delete(id);
        setVideos(videos.filter(v => v._id !== id));
        toast('Video deleted', "success");
      } catch (err) {
        console.warn('Failed to delete video');
        toast('Failed to delete video', "error");
      }
    }
  };

  const styles = {
    container: { background: 'black', minHeight: '100vh', paddingBottom: '70px' },
    header: { padding: '15px', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    videoCard: { marginBottom: '20px', position: 'relative' },
    video: { width: '100%', borderRadius: '0' },
    overlay: { position: 'absolute', bottom: '20px', left: '15px', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)' },
    addBtn: { background: '#2C5530', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', textDecoration: 'none', color: 'white', cursor: 'pointer', border: 'none' }
  };

  if (loading) {
    return <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><p style={{color:'white'}}>Loading...</p></div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span>📺 Rehoboth TV</span>
        {isAdmin && <button onClick={() => navigate('/add-video')} style={styles.addBtn}>+ Upload</button>}
      </div>

      {videos.length === 0 && <p style={{color:'white', textAlign:'center', marginTop:'50px'}}>No videos yet.</p>}

      {videos.map(v => (
        <div key={v._id} style={styles.videoCard}>
          <video src={getUrl(v.video)} controls style={styles.video} />
          <div style={styles.overlay}>
            <h3>{v.title}</h3>
          </div>
          {isAdmin && <button onClick={() => handleDelete(v._id)} style={{position:'absolute', top:10, right:10, background:'red', color:'white', border:'none', padding:'5px', cursor:'pointer'}}>Del</button>}
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;
