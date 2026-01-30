import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddVideo = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', file);

    try {
      await axios.post('http://localhost:5000/api/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Video Uploaded to TV!');
      navigate('/videos');
    } catch (err) { alert('Upload failed'); }
    finally { setLoading(false); }
  };

  const styles = {
    container: { padding: '20px', fontFamily: 'sans-serif' },
    input: { width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #ccc' },
    btn: { width: '100%', padding: '15px', background: '#2C5530', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      <h2>Upload to Rehoboth TV</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Video Title (e.g. How to use Blender)" value={title} onChange={e => setTitle(e.target.value)} style={styles.input} />
        <label>Select Video (Max 30s recommended)</label>
        <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} style={{marginBottom:'20px'}} />
        
        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? 'Uploading... (Wait)' : 'Post Video'}
        </button>
      </form>
    </div>
  );
};
export default AddVideo;
