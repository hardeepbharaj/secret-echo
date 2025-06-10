import axios, { InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || 'unknown endpoint';
    console.error('API Error:', requestUrl, error.message);
    if (error.response?.status === 401) {
      // Clear token on 401 responses
      Cookies.remove('token', { path: '/' });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
); 