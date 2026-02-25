import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
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

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
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
          <Route path='/suggestions' element={<ProtectedRoute><Suggestions /></ProtectedRoute>} />

          <Route path='/privacy' element={<Privacy />} />
          <Route path='*' element={<Login />} />
        </Routes>
        <BottomNav />
        <SupportButton />
      </div>
    </Router>
  );
}

export default App;
