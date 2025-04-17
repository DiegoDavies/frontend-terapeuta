import axios from 'axios';
import router from '@/router';

const api = axios.create({
  baseURL: 'https://backend-terapeuta-production.up.railway.app', // 🔁 altere se estiver em produção
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      router.push('/login');
    }
    return Promise.reject(error);
  }
)

export default api;
