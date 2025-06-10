import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { User } from '@/types/auth';
import { ApiError } from '@/types/api';
import { apiClient } from '@/lib/api/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        setUser(null);
        return;
      }

      const response = await apiClient.get('/auth/me');
      setUser(response.data.user);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Authentication failed');
      setUser(null);
      Cookies.remove('token');
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      setUser(response.data.user);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
    } finally {
      setUser(null);
      Cookies.remove('token');
      router.push('/login');
    }
  };

  return { user, error, login, logout };
} 