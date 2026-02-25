import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || 'https://rehoboth-backend.onrender.com';

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(saved);
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item._id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}${imagePath}`;
  };

  const styles = {
    container: { padding: '20px', fontFamily: 'sans-serif', background: '#f9f9f9', minHeight: '100vh', paddingBottom: '80px' },
    card: { background: 'white', borderRadius: '12px', padding: '15px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: '15px', alignItems: 'center' },
    image: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' },
    name: { fontWeight: 'bold', fontSize: '15px', margin: '0 0 5px 0' },
    price: { color: '#2C5530', fontWeight: 'bold', margin: '0 0 8px 0' },
    btnRow: { display: 'flex', gap: '8px' },
    viewBtn: { background: '#2C5530', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
    removeBtn: { background: '#fee', color: '#e74c3c', border: '1px solid #e74c3c', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  };

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>←</button>
        <h2 style={{ margin: 0, color: '#2C5530' }}>❤️ My Wishlist</h2>
      </div>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <p style={{ fontSize: '40px' }}>💔</p>
          <p style={{ color: '#888' }}>Your wishlist is empty</p>
          <button onClick={() => navigate('/')} style={{ background: '#2C5530', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Browse Products</button>
        </div>
      ) : (
        wishlist.map(item => (
          <div key={item._id} style={styles.card}>
            <img src={getImageUrl(item.image)} alt={item.name} style={styles.image} onError={e => e.target.style.display='none'} />
            <div style={{ flex: 1 }}>
              <p style={styles.name}>{item.name}</p>
              <p style={styles.price}>GHS {item.price?.toLocaleString()}</p>
              <div style={styles.btnRow}>
                <button onClick={() => navigate(`/product/${item._id}`)} style={styles.viewBtn}>View</button>
                <button onClick={() => removeFromWishlist(item._id)} style={styles.removeBtn}>Remove</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;
