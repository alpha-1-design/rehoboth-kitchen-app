import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  const isAdmin = JSON.parse(localStorage.getItem('user'))?.isAdmin === true;

  useEffect(() => {
    axios.get('http://localhost:5000/api/videos').then(res => setVideos(res.data));
  }, []);

  const getUrl = (path) => `http://localhost:5000${path}`;

  const handleDelete = async (id) => {
    if(confirm('Delete video?')) {
      await axios.delete(`http://localhost:5000/api/videos/${id}`);
      window.location.reload();
    }
  };

  const styles = {
    container: { background: 'black', minHeight: '100vh', paddingBottom: '70px' },
    header: { padding: '15px', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' },
    videoCard: { marginBottom: '20px', position: 'relative' },
    video: { width: '100%', borderRadius: '0' },
    overlay: { position: 'absolute', bottom: '20px', left: '15px', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)' },
    addBtn: { background: '#2C5530', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', textDecoration: 'none', color: 'white' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span>📺 Rehoboth TV</span>
        {isAdmin && <span onClick={() => navigate('/add-video')} style={styles.addBtn}>+ Upload</span>}
      </div>

      {videos.length === 0 && <p style={{color:'white', textAlign:'center', marginTop:'50px'}}>No videos yet.</p>}

      {videos.map(v => (
        <div key={v._id} style={styles.videoCard}>
          <video src={getUrl(v.video)} controls style={styles.video} />
          <div style={styles.overlay}>
            <h3>{v.title}</h3>
          </div>
          {isAdmin && <button onClick={() => handleDelete(v._id)} style={{position:'absolute', top:10, right:10, background:'red', color:'white', border:'none', padding:'5px'}}>Del</button>}
        </div>
      ))}
    </div>
  );
};
export default VideoFeed;
