import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti'; // Import Confetti

const CheckoutSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('cart');
    
    // TRIGGER EXPLOSION
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

  }, []);

  const styles = {
    container: {
      height: '80vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      background: '#f9f9f9', fontFamily: 'sans-serif', padding: '20px'
    },
    card: {
      background: 'white', padding: '40px', borderRadius: '20px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%',
      animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    },
    icon: { fontSize: '60px', marginBottom: '20px', color: '#2C5530' },
    title: { color: '#2C5530', fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' },
    text: { color: '#555', marginBottom: '30px', lineHeight: '1.5' },
    btn: {
      width: '100%', padding: '15px', background: '#2C5530',
      color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor:'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div style={styles.card}>
        <div style={styles.icon}>✅</div>
        <h1 style={styles.title}>Order Placed!</h1>
        <p style={styles.text}>
          Thank you for ordering with Rehoboth Kitchen. 
          <br/><br/>
          We have received your details. Our team will call you shortly to confirm delivery.
        </p>
        
        <button onClick={() => navigate('/')} style={styles.btn}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
