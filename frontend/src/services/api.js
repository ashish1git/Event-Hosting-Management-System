import axios from 'axios';

// Create an Axios instance with base configuration
const API = axios.create({
  // Base URL is handled by Vite proxy in dev or VITE_API_URL in prod
  // If no VITE_API_URL (and no proxy match), it might be relative
  // Given previous steps, we already set defaults.baseURL in main.jsx
  // But creating a fresh instance here is cleaner.
  // We'll align it with the main.jsx logic or just rely on global defaults?
  // User asked for "API from ../services/api".

  // Let's use the explicit logic or just standard axios create.
  // We'll assume the baseURL is already correctly set or we re-apply it if needed.
  // Safest: Use relative path if proxy is on, or full URL.
  // For now, let's just make it a standard wrapper.
});

// Add a request interceptor to include the Token if available
API.interceptors.request.use(
  (config) => {
    // Check local storage for token (assumed 'userInfo' has token from prev logic)
    // Or maybe just 'token' key?
    // Let's check where we will store it.
    // In userController.js we send back: { _id, fullName, email, role, token }
    // Typical pattern: localStorage.setItem('userInfo', JSON.stringify(data));

    // We will assume storage key 'userInfo'
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
       const { token } = JSON.parse(userInfo);
       if (token) {
         config.headers.Authorization = `Bearer ${token}`;
       }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
