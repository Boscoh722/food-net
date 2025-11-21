import axios from 'axios';

// Configuration for different environments
const config = {
  development: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  },
  production: {
    baseURL: import.meta.env.VITE_API_URL, 
  },
};

// Determine current environment
const environment = import.meta.env.MODE || 'production';
const { baseURL } = config[environment];

// Create Axios instance
const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: add token automatically from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
