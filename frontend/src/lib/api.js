import axios from 'axios';

// Configuration for different environments
const config = {
  development: {
    baseURL: 'http://localhost:5000/api',
  },
  production: {
    baseURL: 'VITE_API_URL',
  }
};

const environment = import.meta.env.MODE || 'production';
const { baseURL } = config[environment];

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;