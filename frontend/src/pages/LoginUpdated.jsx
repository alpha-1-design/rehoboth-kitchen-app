import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateGhanaPhone, validateEmail } from '../utils/validators';
import { authAPI } from '../services/apiService';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });

  // Error States
  const [errors, setErrors] = useState({ email: '', phone: '', password: '' });

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const OWNER_EMAIL = 'gracee14gn@gmail.com';
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // REAL-TIME VALIDATION
    if (name === 'phone') {
      const check = validateGhanaPhone(value);
      setErrors(prev => ({ ...prev, phone: check.isValid ? '' : check.message }));
    }
    if (name === 'email') {
      const check = validateEmail(value);
      setErrors(prev => ({ ...prev, email: check.isValid ? '' : check.message }));
    }
  };

  const isStrongPassword = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    return strongRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final Validation Check before sending
    if (!isLogin && errors.phone) return alert(errors.phone);
    if (errors.email) return alert(errors.email);

    if (!isLogin && formData.password !== formData.confirmPassword) return alert("Passwords do not match!");
    if (!isLogin && !isStrongPassword(formData.password)) return alert("Weak Password! Use 8+ chars, Uppercase, Number & Symbol.");

    try {
      const res = isLogin 
        ? await authAPI.login({ email: formData.email, password: formData.password })
        : await authAPI.signup(formData);
      
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      alert(`Welcome, ${res.user.name}!`);
      if (res.user.email === OWNER_EMAIL) navigate('/dashboard'); 
      else navigate('/'); 
    } catch (err) { 
      alert(err.message || 'Action Failed'); 
    }
  };

  // Sliding Images
  const slideImages = [
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600",
    "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600",
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600",
    "https://images.unsplash.com/photo-1571175443880-49e1d58bca77?w=600",
    "https://images.unsplash.com/photo-1585659722983-3a675bad1180?w=600"
  ];

  const styles = {
    container: { position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: "'Playfair Display', serif" },
    bgLayer: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 },
    slideTrack: { display: 'flex', flexDirection: 'column', width: '100%', animation: 'slideUp 20s linear infinite' },
    bgImage: { width: '100%', height: '250px', objectFit: 'cover', opacity: 0.8 },
    overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.85)', zIndex: 1, backdropFilter: 'blur(3px)' },
    card: { position: 'relative', zIndex: 10, backgroundColor: 'white', borderRadius: '30px', padding: '30px 25px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', textAlign: 'center', borderTop: '6px solid #2C5530', width: '90%', maxWidth: '400px' },
    input: { width: '100%', padding: '15px', marginBottom: '5px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px', backgroundColor: '#fff' },
    btn: { width: '100%', padding: '15px', backgroundColor: '#2C5530', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
    link: { color: '#2C5530', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' },
    error: { color: 'red', fontSize: '12px', textAlign: 'left', marginBottom: '10px', marginLeft: '5px' }
  };

  return (
    <div style={styles.container}>
      <style>{`@keyframes slideUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }`}</style>
      <div style={styles.bgLayer}>
        <div style={styles.slideTrack}>
          {[...slideImages, ...slideImages].map((img, i) => <img key={i} src={img} style={styles.bgImage} alt="bg" />)}
        </div>
      </div>
      <div style={styles.overlay}></div>

      <div style={{position:'absolute', top:0, width:'100%', padding:'15px', display:'flex', justifyContent:'space-between', zIndex:20, fontWeight:'bold'}}>
        <span>{currentTime}</span><span>Rehoboth Kitchen</span>
      </div>

      <div style={styles.card}>
        <h1 style={{color: '#2C5530', margin:0}}>Rehoboth Kitchen</h1>
        <p style={{color: '#A08C5B', fontStyle: 'italic', marginBottom: '20px'}}>Culinary Excellence</p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input name="name" placeholder="Full Name" onChange={handleChange} style={styles.input} required />

              <input name="phone" type="tel" placeholder="Phone (e.g. 024...)" onChange={handleChange} style={styles.input} required />
              {errors.phone && <div style={styles.error}>{errors.phone}</div>}
            </>
          )}

          <input 
            name="email" 
            type="email" 
            placeholder="Email Address" 
            onChange={handleChange} 
            style={styles.input} 
            required 
            autoComplete="username" 
          />
          {errors.email && <div style={styles.error}>{errors.email}</div>}

          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            style={styles.input} 
            required 
            autoComplete={isLogin ? "current-password" : "new-password"} 
          />

          {!isLogin && <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} style={styles.input} required />}

          <button type="submit" style={styles.btn}>{isLogin ? 'Log In' : 'Sign Up'}</button>
        </form>

        <p style={{marginTop: '20px', fontSize: '14px'}}>{isLogin ? "New here? " : "Have an account? "}<span onClick={() => setIsLogin(!isLogin)} style={styles.link}>{isLogin ? "Create Account" : "Sign In"}</span></p>

        {isLogin && <button onClick={() => alert('Password reset link sent (Simulation)')} style={{background:'none', border:'none', color:'#888', marginTop:'10px'}}>Forgot Password?</button>}
      </div>
    </div>
  );
};

export default Login;
