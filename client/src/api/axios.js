import axios from 'axios';

// Update baseURL if backend is deployed
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export default api;
