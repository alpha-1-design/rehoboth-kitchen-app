import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const searchFace = async (imageData) => {
  try {
    const response = await api.post('/api/face/search', { image: imageData });
    return response.data;
  } catch (error) {
    console.warn('Face search error:', error.message);
    throw error;
  }
};

export const searchProduct = async (objectName, location) => {
  try {
    const response = await api.post('/api/product/search', { objectName, location });
    return response.data;
  } catch (error) {
    console.warn('Product search error:', error.message);
    throw error;
  }
};

export const summarizeText = async (text) => {
  try {
    const response = await api.post('/api/summarize/text', { text });
    return response.data;
  } catch (error) {
    console.warn('Summarization error:', error.message);
    throw error;
  }
};

export const generateSlides = async (content, type) => {
  try {
    const response = await api.post('/api/slides/generate', { content, type });
    return response.data;
  } catch (error) {
    console.warn('Slide generation error:', error.message);
    throw error;
  }
};

export default api;
