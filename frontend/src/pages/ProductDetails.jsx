
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/apiService';
import Icon from '../components/Icons';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review State
  const [rating, setRating] = useState(5);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setInWishlist(saved.some(item => item._id === id));
  }, [id]);

  const toggleWishlist = () => {
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (inWishlist) {
      const updated = saved.filter(item => item._id !== id);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      setInWishlist(false);
    } else {
      saved.push(product);
      localStorage.setItem('wishlist', JSON.stringify(saved));
      setInWishlist(true);
    }
  };
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [answeringIndex, setAnsweringIndex] = useState(null);
  const [comment, setComment] = useState('');
  const [refresh, setRefresh] = useState(false);

  // Calculator State
  const [hours, setHours] = useState(4);
  const KWH_RATE = 1.8;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productAPI.getById(id);
        setProduct(res);
      } catch (err) {
        console.warn('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
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

  const submitQuestion = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to ask a question');
    if (!question.trim()) return alert('Please enter a question');
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || 'https://rehoboth-backend.onrender.com';
      const res = await fetch(BASE_URL + `/api/products/${id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ question, userName: user.name })
      });
      const data = await res.json();
      alert(data.message);
      setQuestion('');
      const updated = await fetch(BASE_URL + `/api/products/${id}`);
      setProduct(await updated.json());
    } catch (err) {
      alert('Failed to submit question');
    }
  };

  const submitAnswer = async (index) => {
    if (!answer.trim()) return alert('Please enter an answer');
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || 'https://rehoboth-backend.onrender.com';
      const res = await fetch(BASE_URL + `/api/products/${id}/questions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ answer, questionIndex: index })
      });
      const data = await res.json();
      alert(data.message);
      setAnswer('');
      setAnsweringIndex(null);
      const updated = await fetch(BASE_URL + `/api/products/${id}`);
      setProduct(await updated.json());
    } catch (err) {
      alert('Failed to submit answer');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return alert("Please Login to write a review");

    try {
      // Note: You may need to add a review endpoint to apiService
      // For now, we'll use a direct fetch or add it to productAPI
      await fetch(`${import.meta.env.VITE_API_URL || 'https://rehoboth-backend.onrender.com'}/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, userName: user.name })
      });
      alert('Review Submitted!');
      setComment('');
      setRefresh(!refresh);
    } catch (err) {
      console.warn('Failed to submit review');
      alert('Failed to submit review');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const API_BASE_URL = 'https://rehoboth-backend.onrender.com';
    return `${API_BASE_URL}${imagePath}`;
  };

  if (loading) return <div style={{padding:'20px', textAlign:'center'}}>Loading...</div>;
  if (!product) return <div style={{padding:'20px', textAlign:'center'}}>Product not found</div>;

  const watts = product.watts || 0;
  const dailyCost = ((watts * hours) / 1000) * KWH_RATE;
  const monthlyCost = dailyCost * 30;

  const styles = {
    container: { fontFamily: 'sans-serif', padding: '20px', background: 'white', minHeight: '100vh', paddingBottom: '80px' },
    image: { width: '100%', height: '300px', objectFit: 'contain', borderRadius: '10px' },
    title: { fontSize: '22px', color: '#333', fontWeight: 'bold' },
    price: { fontSize: '20px', color: '#2C5530', fontWeight: '800' },
    cat: { background: '#eee', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', color: '#555' },
    featureCard: { background: '#f9f9f9', padding: '15px', borderRadius: '12px', marginTop: '15px', borderLeft: '4px solid #2C5530' },
    featureTitle: { fontWeight: 'bold', color: '#2C5530', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' },
    btn: { width: '100%', padding: '15px', background: '#2C5530', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', marginTop: '20px' },
    giftBtn: { width: '100%', padding: '12px', background: 'white', color: '#2C5530', border: '2px solid #2C5530', borderRadius: '10px', fontWeight: 'bold', marginTop: '10px' }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={{background:'none', border:'none', fontSize:'20px', cursor:'pointer'}}>←</button>

      <img src={getImageUrl(product.image)} alt={product.name} style={styles.image} />
      <span style={styles.cat}>{product.category}</span>
      <h1 style={styles.title}>{product.name}</h1>
      <div style={styles.price}>GHS {product.price}</div>
      <p style={{color:'#666', marginTop:'10px'}}>{product.description}</p>

      {product.recipes && (
        <div style={{...styles.featureCard, background: '#fff3cd', borderLeft: '4px solid #f1c40f'}}>
          <div style={{...styles.featureTitle, color:'#d35400'}}>👨‍🍳 Cook with Rehoboth</div>
          <p style={{fontSize:'13px', fontStyle:'italic'}}>Perfect for making:</p>
          <p style={{fontWeight:'bold'}}>{product.recipes}</p>
        </div>
      )}

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

      <div style={{marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
        <h3 style={{color: '#333'}}>Customer Reviews ({product.numReviews || 0})</h3>
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
          <button type="submit" style={{marginTop:'10px', padding:'10px', background:'#2C5530', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}>Submit</button>
        </form>
        {/* Q&A Section */}
      <div style={{marginTop:'30px'}}>
        <h3 style={{color:'#333'}}>❓ Questions & Answers ({(product.questions || []).length})</h3>
        
        <form onSubmit={submitQuestion} style={{marginBottom:'20px', background:'#f0f8f0', padding:'15px', borderRadius:'10px'}}>
          <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>Ask a Question:</label>
          <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="e.g. Does it come with a warranty?" style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd', marginBottom:'10px', minHeight:'70px'}} />
          <button type="submit" style={{background:'#2C5530', color:'white', border:'none', padding:'10px 20px', borderRadius:'8px', fontWeight:'bold'}}>Submit Question</button>
        </form>

        {(product.questions || []).length === 0 ? (
          <p style={{color:'#888'}}>No questions yet. Be the first to ask!</p>
        ) : (
          (product.questions || []).slice().reverse().map((q, i) => (
            <div key={i} style={{background:'white', padding:'15px', borderRadius:'10px', marginBottom:'10px', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'}}>
              <p style={{margin:'0 0 5px 0'}}><strong>Q:</strong> {q.question}</p>
              <p style={{fontSize:'12px', color:'#888', margin:'0 0 10px 0'}}>Asked by {q.askedBy}</p>
              {q.answer ? (
                <p style={{background:'#e8f5e9', padding:'10px', borderRadius:'8px', margin:0}}><strong>A:</strong> {q.answer}</p>
              ) : (
                user?.isAdmin ? (
                  answeringIndex === i ? (
                    <div>
                      <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer..." style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd', marginBottom:'5px'}} />
                      <button onClick={() => submitAnswer((product.questions.length - 1) - i)} style={{background:'#2C5530', color:'white', border:'none', padding:'8px 15px', borderRadius:'8px', marginRight:'5px'}}>Submit</button>
                      <button onClick={() => setAnsweringIndex(null)} style={{background:'#ccc', border:'none', padding:'8px 15px', borderRadius:'8px'}}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setAnsweringIndex(i)} style={{background:'#2980b9', color:'white', border:'none', padding:'8px 15px', borderRadius:'8px'}}>Answer</button>
                  )
                ) : (
                  <p style={{color:'#888', fontSize:'13px', fontStyle:'italic'}}>Awaiting answer from seller...</p>
                )
              )}
            </div>
          ))
        )}
      </div>

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
