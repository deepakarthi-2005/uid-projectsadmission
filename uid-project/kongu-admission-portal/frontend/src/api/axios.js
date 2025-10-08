import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: '/', // proxy is set to backend in package.json
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
