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
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `API Error: ${response.status}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      console.warn(`Network error: ${endpoint}`);
    }
    throw error;
  }
};

// Auth endpoints
export const authAPI = {
  signup: (data) => apiCall('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
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
  update: (id, data) => apiCall(`/api/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
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
  getAll: () => apiCall('/api/extras/notifications'),
  markAsRead: (id) => apiCall(`/api/extras/notifications/${id}`, { method: 'PUT' }),
  deleteAll: () => apiCall('/api/extras/notifications', { method: 'DELETE' }),
  delete: (id) => apiCall(`/api/extras/notifications/${id}`, { method: 'DELETE' }),
};

// Support endpoints
export const supportAPI = {
  sendMessage: (data) => apiCall('/api/support', { method: 'POST', body: JSON.stringify(data) }),
  getMessages: () => apiCall('/api/support'),
  deleteMessage: (id) => apiCall(`/api/support/${id}`, { method: 'DELETE' }),
};

// Suggestion endpoints
export const suggestionAPI = {
  create: (data) => apiCall('/api/suggestions', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => apiCall('/api/suggestions'),
};

// Push notification endpoints
export const pushAPI = {
  subscribe: (data) => apiCall('/api/push/subscribe', { method: 'POST', body: JSON.stringify(data) }),
  unsubscribe: (data) => apiCall('/api/push/unsubscribe', { method: 'POST', body: JSON.stringify(data) }),
};

export default apiCall;
