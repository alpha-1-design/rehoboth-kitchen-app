// API Service - Centralized API calls
import API_BASE_URL from '../config/apiConfig';

const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
};

// Auth endpoints
export const authAPI = {
  signup: (data) => apiCall('/api/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiCall('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => apiCall('/api/auth/logout', { method: 'POST' }),
  getProfile: () => apiCall('/api/auth/profile'),
};

// Product endpoints
export const productAPI = {
  getAll: () => apiCall('/api/products'),
  getById: (id) => apiCall(`/api/products/${id}`),
  create: (data) => apiCall('/api/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/api/products/${id}`, { method: 'DELETE' }),
};

// Order endpoints
export const orderAPI = {
  create: (data) => apiCall('/api/orders', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => apiCall('/api/orders'),
  getById: (id) => apiCall(`/api/orders/${id}`),
};

// Banner endpoints
export const bannerAPI = {
  getAll: () => apiCall('/api/banners'),
  create: (data) => apiCall('/api/banners', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/api/banners/${id}`, { method: 'DELETE' }),
};

// Video endpoints
export const videoAPI = {
  getAll: () => apiCall('/api/videos'),
  create: (data) => apiCall('/api/videos', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/api/videos/${id}`, { method: 'DELETE' }),
};

// Notification endpoints
export const notificationAPI = {
  getAll: () => apiCall('/api/notifications'),
  markAsRead: (id) => apiCall(`/api/notifications/${id}`, { method: 'PUT' }),
};

// Support endpoints
export const supportAPI = {
  sendMessage: (data) => apiCall('/api/support', { method: 'POST', body: JSON.stringify(data) }),
  getMessages: () => apiCall('/api/support'),
};

export default apiCall;
