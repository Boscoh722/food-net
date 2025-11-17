import axios from 'axios';

// Configuration for different environments
const config = {
  development: {
    baseURL: 'http://localhost:5000/api',
  },
  production: {
    baseURL: '/api',
  }
};

const environment = import.meta.env.MODE || 'development';
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