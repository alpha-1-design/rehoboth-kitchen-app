import { useEffect, useState } from 'react';
import versionData from '../version.json';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import AddBanner from './pages/AddBanner';
import Home from './pages/Home';
import Cart from './pages/Cart';
import CheckoutSuccess from './pages/CheckoutSuccess';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import About from './pages/About';
import SupportChat from './pages/SupportChat';
import MyReviews from './pages/MyReviews';
import Notifications from './pages/Notifications';
import Suggestions from './pages/Suggestions';
import NotificationSettings from './pages/NotificationSettings';
import BottomNav from './components/BottomNav';
import SupportButton from './components/SupportButton';
import ProtectedRoute from './components/ProtectedRoute';
import Privacy from './pages/Privacy';
import SplashScreen from './components/SplashScreen';
import InstallBanner from './components/InstallBanner';

// VIDEO FEED IMPORTS
import VideoFeed from './pages/VideoFeed';
import AddVideo from './pages/AddVideo';
import Wishlist from './pages/Wishlist';
import MyOrders from './pages/MyOrders';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available — show toast with reload button
              const toast = document.createElement('div');
              toast.innerHTML = '🔄 New update available! <button onclick="window.location.reload()" style="margin-left:10px;background:white;color:#2C5530;border:none;border-radius:6px;padding:4px 10px;font-weight:bold;cursor:pointer;font-size:12px;">Reload</button>';
              toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#2C5530;color:white;padding:12px 20px;border-radius:12px;font-size:13px;z-index:9999;max-width:92%;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.3);font-family:sans-serif;display:flex;align-items:center;gap:6px;white-space:nowrap;';
              document.body.appendChild(toast);
            }
          });
        });
      });
    }
  }, []);

  useEffect(() => {
    const lastVersion = localStorage.getItem('appVersion');
    const showToast = (msg, isNew) => {
      setTimeout(() => {
        const toast = document.createElement('div');
        toast.innerText = msg;
        toast.style.cssText = `position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:${isNew ? '#2C5530' : '#1a3a2a'};color:white;padding:12px 20px;border-radius:12px;font-size:13px;z-index:9999;max-width:90%;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.3);font-family:sans-serif;transition:opacity 0.5s;`;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 3000);
      }, 2000);
    };
    if (!lastVersion || lastVersion !== versionData.version) {
      localStorage.setItem('appVersion', versionData.version);
      const changelog = versionData.changelog?.[versionData.version] || 'New updates available';
      showToast('🎉 Updated to v' + versionData.version + ' — ' + changelog, true);
    } else {
      showToast('✅ You are on the latest version (v' + versionData.version + ')', false);
    }
  }, []);
  return null;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', checkAuth);
    const interval = setInterval(checkAuth, 500);
    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <ScrollToTop />
      <InstallBanner />
      <div style={{ paddingBottom: '70px' }}>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path='/add-product' element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          <Route path='/edit-product/:id' element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
          <Route path='/add-banner' element={<ProtectedRoute><AddBanner /></ProtectedRoute>} />

          {/* VIDEO ROUTES */}
          <Route path='/videos' element={<ProtectedRoute><VideoFeed /></ProtectedRoute>} />
          <Route path='/add-video' element={<ProtectedRoute><AddVideo /></ProtectedRoute>} />
        <Route path='/wishlist' element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

          {/* NOTIFICATION SETTINGS */}
          <Route path="/notification-settings" element={<NotificationSettings />} />

          {/* OTHER ROUTES */}
          <Route path='/product/:id' element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path='/success' element={<ProtectedRoute><CheckoutSuccess /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/about' element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path='/support' element={<ProtectedRoute><SupportChat /></ProtectedRoute>} />
          <Route path='/my-reviews' element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />
          <Route path='/notifications' element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path='/my-orders' element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path='/suggestions' element={<ProtectedRoute><Suggestions /></ProtectedRoute>} />

          <Route path='/privacy' element={<Privacy />} />
          <Route path='*' element={<Login />} />
        </Routes>
        {isLoggedIn && <BottomNav />}
        {isLoggedIn && <SupportButton />}
      </div>
    </Router>
  );
}

export default App;
