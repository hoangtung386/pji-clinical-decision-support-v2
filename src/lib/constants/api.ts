const isDev = window.location.hostname === 'localhost';

export const API_BASE_URL = isDev
  ? 'http://localhost:8000'
  : 'https://pji-backend.onrender.com';

export const API_V1 = `${API_BASE_URL}/api/v1`;
