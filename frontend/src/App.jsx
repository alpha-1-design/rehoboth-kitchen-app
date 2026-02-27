import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AddProduct = lazy(() => import('./pages/AddProduct'));
const AddBanner = lazy(() => import('./pages/AddBanner'));
import Home from './pages/Home';
const Cart = lazy(() => import('./pages/Cart'));
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
import Profile from './pages/Profile';
const About = lazy(() => import('./pages/About'));
const SupportChat = lazy(() => import('./pages/SupportChat'));
const MyReviews = lazy(() => import('./pages/MyReviews'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Suggestions = lazy(() => import('./pages/Suggestions'));
const NotificationSettings = lazy(() => import('./pages/NotificationSettings'));
import BottomNav from './components/BottomNav';
import SupportButton from './components/SupportButton';
import ProtectedRoute from './components/ProtectedRoute';
const Privacy = lazy(() => import('./pages/Privacy'));
import SplashScreen from './components/SplashScreen';
import InstallBanner from './components/InstallBanner';

// VIDEO FEED IMPORTS
const VideoFeed = lazy(() => import('./pages/VideoFeed'));
const AddVideo = lazy(() => import('./pages/AddVideo'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <ScrollToTop />
      <InstallBanner />
      <div style={{ paddingBottom: '70px' }}>
        <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><p>Loading...</p></div>}>
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
      </Suspense>
        <BottomNav />
        <SupportButton />
      </div>
    </Router>
  );
}

export default App;
