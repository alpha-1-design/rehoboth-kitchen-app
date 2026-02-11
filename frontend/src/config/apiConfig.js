// Production API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://rehoboth-backend.onrender.com';

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  ORDERS: `${API_BASE_URL}/api/orders`,
  BANNERS: `${API_BASE_URL}/api/banners`,
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
  PUSH: `${API_BASE_URL}/api/push`,
  SUPPORT: `${API_BASE_URL}/api/support`,
  VIDEOS: `${API_BASE_URL}/api/videos`,
  SUGGESTIONS: `${API_BASE_URL}/api/suggestions`,
};

export default API_BASE_URL;
