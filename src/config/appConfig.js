// Application Configuration
export const APP_VERSION = '1.0.0';
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://rehoboth-backend.onrender.com';
export const ENVIRONMENT = process.env.NODE_ENV || 'production';

// Feature flags
export const FEATURES = {
  PUSH_NOTIFICATIONS: true,
  PWA: true,
  ANALYTICS: false,
};
