import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const styles = {
    container: { padding: '20px', fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh', paddingBottom: '80px' },
    backBtn: { background: 'none', border: 'none', fontSize: '16px', color: '#2C5530', marginBottom: '15px', cursor: 'pointer', fontWeight: 'bold' },
    
    // HERO SECTION
    hero: { background: '#2C5530', padding: '40px 20px', borderRadius: '15px', color: 'white', marginBottom: '25px', textAlign: 'center', boxShadow: '0 4px 15px rgba(44, 85, 48, 0.3)' },
    heroTitle: { fontSize: '28px', fontFamily: '"Playfair Display", serif', margin: 0 },
    heroSub: { fontSize: '14px', opacity: 0.9, marginTop: '5px', letterSpacing: '1px' },
    
    // CARD STYLE
    card: { background: 'white', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderLeft: '5px solid #2C5530' },
    cardTitle: { color: '#2C5530', fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' },
    text: { color: '#555', lineHeight: '1.8', fontSize: '15px', marginBottom: '15px' },
    highlight: { fontWeight: 'bold', color: '#333' },
    
    // FOUNDER SECTION
    founderImg: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px', marginBottom: '15px', background: '#eee' }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
      
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Rehoboth Kitchen</h1>
        <p style={styles.heroSub}>EST. 2019</p>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>📖 Our Story</div>
        <p style={styles.text}>
          Rehoboth Kitchen Ventures was born out of a desire for freedom and excellence. 
        </p>
        <p style={styles.text}>
          Founded in 2019 by <span style={styles.highlight}>Mrs. Grace Uddih</span>, the vision was clear: to break free from the constraints of working for others and build a legacy that prioritizes quality and customer satisfaction above all else.
        </p>
        <p style={styles.text}>
          Starting as a small venture, we have grown into a trusted name in Ghana, ensuring that every household has access to premium kitchen appliances and electronics that stand the test of time.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>🎯 Our Mission</div>
        <p style={styles.text}>
          To empower Ghanaian homes with modern, durable, and affordable appliances. We believe the kitchen is the heart of the home, and it deserves the best tools.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>📍 Contact & Location</div>
        <p style={styles.text}>
          <strong>Manager:</strong> Mrs. Grace Uddih<br/>
          <strong>Phone:</strong> +233 20 015 9500<br/>
          <strong>Email:</strong> gracee14.gn@gmail.com<br/>
          <strong>Location:</strong> Kumasi, Ghana
        </p>
        <button onClick={() => window.open('https://wa.me/233200159500', '_blank')} style={{width:'100%', padding:'12px', background:'#2C5530', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', marginTop:'10px'}}>
          Chat with the CEO
        </button>
      </div>
      
      <p style={{textAlign:'center', color:'#aaa', fontSize:'12px', marginTop:'20px'}}>
        &copy; {new Date().getFullYear()} Rehoboth Kitchen Ventures.
      </p>
    </div>
  );
};

export default About;
