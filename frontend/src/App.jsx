import { useEffect, useState } from 'react';
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
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path='/add-product' element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          <Route path='/edit-product/:id' element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
          <Route path='/add-banner' element={<ProtectedRoute><AddBanner /></ProtectedRoute>} />

          {/* VIDEO ROUTES */}
          <Route path='/videos' element={<VideoFeed />} />
          <Route path='/add-video' element={<ProtectedRoute><AddVideo /></ProtectedRoute>} />
        <Route path='/wishlist' element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

          {/* NOTIFICATION SETTINGS */}
          <Route path="/notification-settings" element={<NotificationSettings />} />

          {/* OTHER ROUTES */}
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/success' element={<ProtectedRoute><CheckoutSuccess /></ProtectedRoute>} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/about' element={<About />} />
          <Route path='/support' element={<ProtectedRoute><SupportChat /></ProtectedRoute>} />
          <Route path='/my-reviews' element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/suggestions' element={<ProtectedRoute><Suggestions /></ProtectedRoute>} />

          <Route path='/privacy' element={<Privacy />} />
          <Route path='*' element={<Home />} />
        </Routes>
        {isLoggedIn && <BottomNav />}
        {isLoggedIn && <SupportButton />}
      </div>
    </Router>
  );
}

export default App;
