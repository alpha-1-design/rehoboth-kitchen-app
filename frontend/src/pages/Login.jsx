import { useState, useEffect } from 'react';


import { useNavigate } from 'react-router-dom';
import { validateGhanaPhone, validateEmail } from '../utils/validators';
import { authAPI } from '../services/apiService';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', referralCode: '' });
  const [errors, setErrors] = useState({ email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const OWNER_EMAIL = 'gracee14gn@gmail.com';
  const navigate = useNavigate();


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');
    const error = params.get('error');
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ name, email }));
      window.location.href = '/';
    }
    if (error) {
      alert('Google login failed. Please try again.');
    }
  }, []);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const idToken = await result.user.getIdToken();
          const BASE_URL = import.meta.env.VITE_API_URL || 'https://rehoboth-backend.onrender.com';
          const res = await fetch(BASE_URL + '/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
          });
          const data = await res.json();
          if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            if (data.user.email === OWNER_EMAIL) navigate('/dashboard');
            else navigate('/');
          }
        }
      } catch (err) {
        console.error('Redirect error:', err);
      }
    };
    handleRedirect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

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
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return strongRegex.test(password);
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://rehoboth-backend.onrender.com/api/auth/google'\;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && errors.phone) return alert(errors.phone);
    if (errors.email) return alert(errors.email);
    if (!isLogin && formData.password !== formData.confirmPassword) return alert("Passwords do not match!");
    if (!isLogin && !isStrongPassword(formData.password)) return alert("Weak Password! Must be 8+ characters with uppercase and a number.");

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

  const slideImages = [
    "/logo.png"
  ];

  const styles = {
    container: { position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: "'Playfair Display', serif" },
    bgLayer: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 },
    slideTrack: { display: 'flex', flexDirection: 'column', width: '100%', animation: 'slideUp 20s linear infinite' },
    
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#f5f0e8', zIndex: 1, overflow: 'hidden' },
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
          
        </div>
      </div>
      <div style={styles.overlay}>
        <style>{`
          @keyframes slideRight {
            0% { transform: translateX(-100px) rotate(var(--rot)); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateX(120vw) rotate(var(--rot)); opacity: 0; }
          }
          @keyframes slideLeft {
            0% { transform: translateX(120vw) rotate(var(--rot)); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateX(-100px) rotate(var(--rot)); opacity: 0; }
          }
          .rk-text {
            position: absolute;
            white-space: nowrap;
            font-weight: bold;
            color: #2C5530;
            pointer-events: none;
            user-select: none;
          }
        `}</style>
        {[
          { top: '5%', fontSize: '14px', opacity: 0.08, rot: '-20deg', dur: '12s', delay: '0s', dir: 'slideRight' },
          { top: '12%', fontSize: '22px', opacity: 0.06, rot: '15deg', dur: '18s', delay: '2s', dir: 'slideLeft' },
          { top: '20%', fontSize: '11px', opacity: 0.1, rot: '-35deg', dur: '14s', delay: '4s', dir: 'slideRight' },
          { top: '28%', fontSize: '28px', opacity: 0.05, rot: '8deg', dur: '20s', delay: '1s', dir: 'slideLeft' },
          { top: '36%', fontSize: '16px', opacity: 0.09, rot: '-15deg', dur: '16s', delay: '3s', dir: 'slideRight' },
          { top: '44%', fontSize: '20px', opacity: 0.07, rot: '25deg', dur: '22s', delay: '5s', dir: 'slideLeft' },
          { top: '52%', fontSize: '13px', opacity: 0.1, rot: '-40deg', dur: '13s', delay: '0.5s', dir: 'slideRight' },
          { top: '60%', fontSize: '24px', opacity: 0.06, rot: '10deg', dur: '19s', delay: '2.5s', dir: 'slideLeft' },
          { top: '68%', fontSize: '17px', opacity: 0.08, rot: '-22deg', dur: '15s', delay: '4.5s', dir: 'slideRight' },
          { top: '76%', fontSize: '30px', opacity: 0.05, rot: '18deg', dur: '21s', delay: '1.5s', dir: 'slideLeft' },
          { top: '84%', fontSize: '12px', opacity: 0.09, rot: '-30deg', dur: '17s', delay: '3.5s', dir: 'slideRight' },
          { top: '92%', fontSize: '19px', opacity: 0.07, rot: '5deg', dur: '23s', delay: '6s', dir: 'slideLeft' },
        ].map((item, i) => (
          <span
            key={i}
            className="rk-text"
            style={{
              top: item.top,
              fontSize: item.fontSize,
              opacity: item.opacity,
              '--rot': item.rot,
              animation: `${item.dir} ${item.dur} linear ${item.delay} infinite`,
            }}
          >
            Rehoboth Kitchen • Rehoboth Kitchen • Rehoboth Kitchen •
          </span>
        ))}
      </div>

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

              {!isLogin && <input
                name="referralCode"
                placeholder="Referral Code (Optional)"
                value={formData.referralCode}
                onChange={handleChange}
                style={styles.input}
              />}
          {!isLogin && (
          <div style={{position:'relative'}}>
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              style={{...styles.input, paddingRight:'45px'}}
              required
            />
            <span onClick={() => setShowConfirm(!showConfirm)} style={{position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', cursor:'pointer', color:'#888'}}>
              {showConfirm ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </span>
          </div>
        )}

          <button type="submit" style={styles.btn}>{isLogin ? 'Log In' : 'Sign Up'}</button>
        </form>

        <div style={{display:'flex', alignItems:'center', gap:'10px', margin:'15px 0'}}>
          <div style={{flex:1, height:'1px', background:'#ddd'}}></div>
          <span style={{fontSize:'12px', color:'#888'}}>or</span>
          <div style={{flex:1, height:'1px', background:'#ddd'}}></div>
        </div>

        <button type="button" onClick={handleGoogleLogin} style={{width:'100%', padding:'12px', background:'white', border:'2px solid #ddd', borderRadius:'10px', fontSize:'15px', fontWeight:'bold', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', marginBottom:'15px'}}>
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Continue with Google
        </button>

        <p style={{marginTop: '20px', fontSize: '14px'}}>{isLogin ? "New here? " : "Have an account? "}<span onClick={() => setIsLogin(!isLogin)} style={styles.link}>{isLogin ? "Create Account" : "Sign In"}</span></p>

        {isLogin && <button onClick={async () => {
            const email = prompt('Enter your email address:');
            if (!email) return;
            try {
              const BASE_URL = import.meta.env.VITE_API_URL || 'https://rehoboth-backend.onrender.com';
              const res = await fetch(BASE_URL + '/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
              });
              const data = await res.json();
              alert(data.message);
            } catch(e) {
              alert('Failed. Try again.');
            }
          }} style={{background:'none', border:'none', color:'#888', marginTop:'10px'}}>Forgot Password?</button>}
      </div>
    </div>
  );
};

export default Login;
