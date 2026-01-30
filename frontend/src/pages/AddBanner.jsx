import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddBanner = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);

    setLoading(true);
    try {
      await axios.post('/api/banners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Banner Added to Slider!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to upload banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add New Banner</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Banner Title (Optional)</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Select Image (From Phone)</label>
          <input 
            type="file" 
            onChange={handleImageChange} 
            accept="image/*"
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', padding: '15px', background: '#2E7D32', color: 'white', 
            border: 'none', borderRadius: '5px', fontSize: '16px' 
          }}
        >
          {loading ? 'Uploading...' : 'Add to Slider'}
        </button>
      </form>
    </div>
  );
};

export default AddBanner;
