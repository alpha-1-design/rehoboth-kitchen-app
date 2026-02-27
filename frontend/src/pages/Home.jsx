import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, bannerAPI, notificationAPI } from '../services/apiService';
import Icon from '../components/Icons'; 
import Toast from '../components/Toast'; 

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastMsg, setToastMsg] = useState('');

  const optimizeImage = (url) => {
    if (!url || !url.includes('cloudinary')) return url;
    return url.replace('/upload/', '/upload/w_400,f_auto,q_auto/');
  };
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, banRes] = await Promise.all([
          productAPI.getAll(),
          bannerAPI.getAll()
        ]);
        setProducts(prodRes);
        setFilteredProducts(prodRes);
        setBanners(banRes);

        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          const notifs = await notificationAPI.getAll();
          const unread = notifs.filter(n => !n.read && n.userId === user.email).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.warn('Failed to fetch home data');
      }
      finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = products;
    if (activeCategory !== 'All') result = result.filter(item => item.category === activeCategory);
    if (searchTerm.trim() !== '') result = result.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredProducts(result);
  }, [activeCategory, searchTerm, products]);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      setToastMsg(`Searching for: "${transcript}"`);
    };

    recognition.start();
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    const API_BASE_URL = 'https://rehoboth-backend.onrender.com';
    return `${API_BASE_URL}${imagePath}`;
  };

  const addToCart = (e, product) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    setToastMsg(`${product.name} added to cart!`);
  };

  const loopBanners = banners.length > 0 ? [...banners, ...banners] : [];

  const styles = {
    container: { fontFamily: 'sans-serif', background: '#f5f5f5', minHeight: '100vh', width: '100%', paddingBottom: '80px', overflowX: 'hidden' },
    header: { background: '#2C5530', padding: '15px 20px', color: 'white', position: 'sticky', top: 0, zIndex: 99, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    brand: { fontSize: '18px', fontWeight: 'bold', fontFamily: '"Playfair Display", serif' },
    bellContainer: { position: 'relative', cursor: 'pointer' },
    redDot: { position: 'absolute', top: -2, right: -2, width: '10px', height: '10px', background: 'red', borderRadius: '50%', border: '1px solid #2C5530' },
    heroCard: { background: 'linear-gradient(135deg, #2C5530 0%, #1e3b21 100%)', margin: '20px', padding: '40px 20px', borderRadius: '20px', color: 'white', textAlign: 'center', boxShadow: '0 10px 25px rgba(44, 85, 48, 0.3)' },
    heroTitle: { fontSize: '26px', fontFamily: '"Playfair Display", serif', marginBottom: '10px' },
    heroSub: { fontSize: '14px', opacity: 0.9, letterSpacing: '1px' },
    sliderContainer: { width: '100%', overflow: 'hidden', background: 'white', padding: '15px 0' },
    sliderTrack: { display: 'flex', gap: '15px', width: 'max-content', animation: 'scroll 30s linear infinite' },
    banner: { minWidth: '260px', height: '150px', borderRadius: '12px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
    bannerText: { position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold' },
    searchContainer: { padding: '10px 20px', background: '#2C5530' },
    searchBox: { width: '100%', padding: '12px 40px 12px 15px', borderRadius: '25px', border: 'none', fontSize: '14px', outline: 'none', background: 'white' },
    micIcon: { position: 'absolute', right: '15px', top: '12px', color: isListening ? 'red' : '#2C5530', cursor: 'pointer', transform: isListening ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.2s ease' },
    filterBar: { display: 'flex', gap: '8px', padding: '0 15px 15px 15px', overflowX: 'auto', background: 'white' },
    filterBtn: (isActive) => ({ padding: '6px 12px', borderRadius: '20px', border: '1px solid #2C5530', background: isActive ? '#2C5530' : 'transparent', color: isActive ? 'white' : '#2C5530', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }),
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '15px' },
    card: { background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    img: { width: '100%', height: '120px', objectFit: 'cover', background: '#eee' },
    details: { padding: '8px' },
    name: { fontSize: '13px', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    price: { fontSize: '14px', fontWeight: 'bold', color: '#2C5530' },
    addBtn: { width: '100%', padding: '6px', background: '#f0f0f0', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', color: '#333', cursor: 'pointer' },
    loader: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', color: '#2C5530' },
    spinner: { width: '40px', height: '40px', border: '4px solid #ddd', borderTop: '4px solid #2C5530', borderRadius: '50%', animation: 'spin 1s linear infinite' }
  };

  if (loading) {
    return <div style={styles.container}><div style={styles.loader}><style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style><div style={styles.spinner}></div></div></div>;
  }

  return (
    <div style={styles.container}>
      <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

      <div style={styles.header}>
        <div style={styles.brand}>Rehoboth Kitchen</div>
        <div style={styles.bellContainer} onClick={() => navigate('/notifications')}>
          <Icon name="bell" size={24} color="white" />
          {unreadCount > 0 && <div style={styles.redDot}></div>}
        </div>
      </div>

      <div style={styles.searchContainer}>
        <div style={{position:'relative'}}>
          <input type="text" placeholder={isListening ? "Listening..." : "Search items..."} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchBox} />
          <div style={styles.micIcon} onClick={handleVoiceSearch}>
            {isListening ? (
              <span style={{animation: 'pulse 1s infinite'}}>🎙️</span>
            ) : (
              <Icon name="mic" size={18} color="#2C5530" />
            )}
          </div>
          <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>
        </div>
      </div>

      {loopBanners.length > 0 ? (
        <div style={styles.sliderContainer}>
          <div style={styles.sliderTrack}>
            {loopBanners.map((b, i) => (
              <div key={i} style={{ ...styles.banner, backgroundImage: `url('${b.image ? getImageUrl(b.image) : b.img}')` }}>
                <div style={styles.bannerText}>{b.title || b.text}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={styles.heroCard}>
          <div style={styles.heroTitle}>Culinary Excellence</div>
          <div style={styles.heroSub}>Premium Appliances Delivered to You</div>
        </div>
      )}

      <div style={{background: 'white', paddingBottom: '10px'}}>
        <div style={styles.filterBar}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={styles.filterBtn(activeCategory === cat)}>{cat}</button>
          ))}
        </div>
      </div>

      <div style={styles.grid}>
        {filteredProducts.length === 0 ? (
          <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '30px', color: '#888'}}>
            <h3>😔 No items found</h3>
            <p>Try searching for something else.</p>
          </div>
        ) : (
          filteredProducts.map((item) => (
            <div key={item._id} style={styles.card} onClick={() => navigate(`/product/${item._id}`)}>
              <img src={optimizeImage(getImageUrl(item.image))} loading="lazy" alt={item.name} style={styles.img} onError={(e) => {e.target.src='https://via.placeholder.com/150'}}/>
              <div style={styles.details}>
                <h4 style={styles.name}>{item.name}</h4>
                <div style={styles.price}>GHS {item.price}</div>
                <button onClick={(e) => addToCart(e, item)} style={styles.addBtn}>ADD +</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
