import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Set the base URL for axios in production
// If VITE_API_URL is set (in production), use it. Otherwise, rely on the proxy (in development).
// Set the base URL for axios based on the environment
console.log('Environment:', import.meta.env.MODE);

if (import.meta.env.MODE === 'production') {
  // In production, use the environment variable.
  // If not set, it defaults to the current origin (which won't work if backend is on a different domain).
  // You MUST set VITE_API_URL in your Vercel project settings.
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://your-backend-service.onrender.com';
  console.log('Production: Setting API Base URL to:', axios.defaults.baseURL);
} else {
  // In development, leave baseURL empty to use the Vite proxy defined in vite.config.js
  // or set it explicitly if you prefer.
  axios.defaults.baseURL = '';
  console.log('Development: Using Vite Proxy');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
