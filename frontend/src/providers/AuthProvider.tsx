'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [authState, setAuthState] = useState<{
    user: User | null;
    token: string | null;
  }>({
    user: null,
    token: null,
  });

  const handleLogout = useCallback(() => {
    setAuthState({ user: null, token: null });
    
    Cookies.remove('token', { path: '/' });
    Cookies.remove('user');
    
    router.push('/login');
  }, [router]);

  useEffect(() => {
    const token = Cookies.get('token');
    const userStr = Cookies.get('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({ user, token });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: unknown) {
        handleLogout();
      }
    }
    
    setIsLoading(false);
  }, [handleLogout]);

  useEffect(() => {
    if (!isLoading) {
      const publicPaths = ['/', '/login', '/register'];
      const isPublicPath = publicPaths.includes(pathname);

      if (!authState.token && !isPublicPath) {
        router.replace('/login');
      } else if (authState.token && isPublicPath) {
        router.replace('/chat');
      }
    }
  }, [isLoading, authState.token, pathname, router]);

  const handleLogin = async (user: User, token: string) => {    
    setAuthState({ user, token });
    
    Cookies.set('token', token, { 
      expires: 7, // 7 days
      path: '/'
    });
    Cookies.set('user', JSON.stringify(user));

    router.push('/chat');
  };

  const value = {
    user: authState.user,
    token: authState.token,
    isAuthenticated: !!authState.token,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 