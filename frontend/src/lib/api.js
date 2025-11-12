// src/lib/api.js
import axios from 'axios';

// Always use the proxy path '/api' – never hardcode localhost in the code
const API_BASE_URL = '/api';  // ← Clean & consistent

const api = axios.create({
  baseURL: '/api',  // ← FIXED: Use proxy only (no localhost!)
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-add JWT from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;