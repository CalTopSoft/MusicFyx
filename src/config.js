export const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : 'https://musicfyxbackend.onrender.com';

export const SOCKET_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : 'https://musicfyxbackend.onrender.com';
