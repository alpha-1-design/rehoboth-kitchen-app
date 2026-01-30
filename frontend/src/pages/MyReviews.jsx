import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchReviews = async () => {
      try {
        // Fetch all products to find user's reviews
        const res = await axios.get('http://localhost:5000/api/products');
        const allProducts = res.data;
        
        const userReviews = [];

        // Loop through products and filter reviews by User Name
        allProducts.forEach(product => {
          if (product.reviews && product.reviews.length > 0) {
            const myProductReviews = product.reviews.filter(r => r.name === user.name);
            
            // Add product details to the review so we know what we reviewed
            myProductReviews.forEach(r => {
              userReviews.push({
                ...r,
                productName: product.name,
                productImage: product.image,
                productId: product._id
              });
            });
          }
        });

        setReviews(userReviews.reverse()); // Show newest first
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [navigate]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const styles = {
    container: { padding: '20px', fontFamily: 'sans-serif', background: '#f9f9f9', minHeight: '100vh', paddingBottom: '80px' },
    header: { color: '#2C5530', borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '20px' },
    card: { background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', gap: '15px' },
    img: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px', background: '#eee' },
    content: { flex: 1 },
    productTitle: { fontSize: '14px', fontWeight: 'bold', margin: '0 0 5px 0' },
    stars: { color: '#f39c12', fontSize: '12px' },
    comment: { fontSize: '13px', color: '#555', marginTop: '5px', fontStyle: 'italic' },
    date: { fontSize: '10px', color: '#aaa', marginTop: '5px', textAlign: 'right' }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>My Ratings & Reviews</h2>

      {loading ? (
        <p>Loading...</p>
      ) : reviews.length === 0 ? (
        <div style={{textAlign: 'center', marginTop: '50px', color: '#888'}}>
          <p>You haven't written any reviews yet.</p>
          <button onClick={() => navigate('/')} style={{marginTop: '10px', padding: '10px', background: '#2C5530', color: 'white', border: 'none', borderRadius: '5px'}}>Start Shopping</button>
        </div>
      ) : (
        reviews.map((rev, index) => (
          <div key={index} style={styles.card}>
            <img src={getImageUrl(rev.productImage)} alt="product" style={styles.img} />
            <div style={styles.content}>
              <div style={styles.productTitle}>{rev.productName}</div>
              <div style={styles.stars}>
                {'⭐'.repeat(rev.rating)} <span style={{color:'#ccc'}}>({rev.rating}/5)</span>
              </div>
              <div style={styles.comment}>"{rev.comment}"</div>
              <div style={styles.date}>{new Date(rev.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyReviews;
