import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Icon from '../components/Icons'; 

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  
  // Review State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [refresh, setRefresh] = useState(false);
  
  // Calculator State
  const [hours, setHours] = useState(4); 
  const KWH_RATE = 1.8; 

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id, refresh]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  const addToGiftList = () => {
    alert("🎁 Added to your Gift Registry!\n\n(Share your 'Me' profile link with friends to let them buy this for you!)");
  };

  const submitReview = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user) return alert("Please Login to write a review");

    try {
      await axios.post(`http://localhost:5000/api/products/${id}/reviews`, {
        rating, comment, userName: user.name
      });
      alert('Review Submitted!');
      setComment('');
      setRefresh(!refresh);
    } catch (err) { alert('Failed'); }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (!product) return <div>Loading...</div>;

  const watts = product.watts || 0;
  const dailyCost = ((watts * hours) / 1000) * KWH_RATE;
  const monthlyCost = dailyCost * 30;

  const styles = {
    container: { fontFamily: 'sans-serif', padding: '20px', background: 'white', minHeight: '100vh', paddingBottom: '80px' },
    image: { width: '100%', height: '300px', objectFit: 'contain', borderRadius: '10px' },
    title: { fontSize: '22px', color: '#333', fontWeight: 'bold' },
    price: { fontSize: '20px', color: '#2C5530', fontWeight: '800' },
    cat: { background: '#eee', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', color: '#555' },
    
    // Feature Cards
    featureCard: { background: '#f9f9f9', padding: '15px', borderRadius: '12px', marginTop: '15px', borderLeft: '4px solid #2C5530' },
    featureTitle: { fontWeight: 'bold', color: '#2C5530', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' },
    
    btn: { width: '100%', padding: '15px', background: '#2C5530', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', marginTop: '20px' },
    giftBtn: { width: '100%', padding: '12px', background: 'white', color: '#2C5530', border: '2px solid #2C5530', borderRadius: '10px', fontWeight: 'bold', marginTop: '10px' }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={{background:'none', border:'none', fontSize:'20px'}}>←</button>
      
      <img src={getImageUrl(product.image)} alt={product.name} style={styles.image} />
      <span style={styles.cat}>{product.category}</span>
      <h1 style={styles.title}>{product.name}</h1>
      <div style={styles.price}>GHS {product.price}</div>
      <p style={{color:'#666', marginTop:'10px'}}>{product.description}</p>

      {/* 1. RECIPE CARD (Only for Kitchen) */}
      {product.recipes && (
        <div style={{...styles.featureCard, background: '#fff3cd', borderLeft: '4px solid #f1c40f'}}>
            <div style={{...styles.featureTitle, color:'#d35400'}}>👨‍🍳 Cook with Rehoboth</div>
            <p style={{fontSize:'13px', fontStyle:'italic'}}>Perfect for making:</p>
            <p style={{fontWeight:'bold'}}>{product.recipes}</p>
        </div>
      )}

      {/* 2. ECG POWER CHECK */}
      {watts > 0 && (
        <div style={styles.featureCard}>
            <div style={styles.featureTitle}>⚡ ECG Power Check</div>
            <p style={{fontSize:'12px', color:'#555'}}>
                Cost to run ({watts}W): <strong>GHS {monthlyCost.toFixed(2)}</strong> / month 
                <br/>(if used {hours} hours daily)
            </p>
            <input type="range" min="1" max="24" value={hours} onChange={(e) => setHours(e.target.value)} style={{width:'100%', accentColor:'#2C5530'}} />
        </div>
      )}

      <button onClick={addToCart} style={styles.btn}>Add to Cart</button>
      <button onClick={addToGiftList} style={styles.giftBtn}>🎁 Add to Gift Registry</button>

      {/* REVIEWS SECTION */}
      <div style={{marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
        <h3 style={{color: '#333'}}>Customer Reviews ({product.numReviews})</h3>
        <form onSubmit={submitReview} style={{marginBottom: '20px', background: '#f0f8f0', padding: '15px', borderRadius: '10px'}}>
          <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>Write a Review:</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)} style={{padding:'8px', borderRadius:'5px', border:'1px solid #ddd', width:'100%'}}>
            <option value="5">5 Stars - Excellent</option>
            <option value="4">4 Stars - Good</option>
            <option value="3">3 Stars - Okay</option>
            <option value="2">2 Stars - Poor</option>
            <option value="1">1 Star - Bad</option>
          </select>
          <textarea placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} style={{width:'100%', padding:'10px', marginTop:'10px', borderRadius:'5px', border:'1px solid #ddd'}} required />
          <button type="submit" style={{marginTop:'10px', padding:'10px', background:'#2C5530', color:'white', border:'none', borderRadius:'5px'}}>Submit</button>
        </form>
        {(!product.reviews || product.reviews.length === 0) ? (
          <p style={{color: '#888'}}>No reviews yet.</p>
        ) : (
          product.reviews.slice().reverse().map((r, i) => (
            <div key={i} style={{background: '#f9f9f9', padding: '10px', borderRadius: '10px', marginBottom: '10px'}}>
              <strong>{r.name}</strong> <span style={{color: '#f39c12'}}>{'⭐'.repeat(r.rating)}</span>
              <p style={{margin:0, color: '#555', fontSize:'13px'}}>{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
