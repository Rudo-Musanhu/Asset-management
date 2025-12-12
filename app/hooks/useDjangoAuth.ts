import { useState, useCallback } from 'react';
import { djangoApiClient } from '../lib/django-api';
import { WarrantyLoginRequest, WarrantyLoginResponse } from '../types';

export const useDjangoAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = useCallback(
    async (credentials: WarrantyLoginRequest): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('[useDjangoAuth] Attempting login with credentials:', credentials.username);
        const response: WarrantyLoginResponse = await djangoApiClient.login(credentials);
        console.log('[useDjangoAuth] Login response:', response);
        
        // Store the token
        setAccessToken(response.access);
        djangoApiClient.setAccessToken(response.access);
        
        setIsAuthenticated(true);
        console.log('[useDjangoAuth] Token set, authenticated:', true);
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        console.error('[useDjangoAuth] Login error:', errorMessage);
        setError(errorMessage);
        setIsAuthenticated(false);
        setAccessToken(null);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    console.log('[useDjangoAuth] Logging out');
    djangoApiClient.logout();
    setIsAuthenticated(false);
    setAccessToken(null);
    setError(null);
  }, []);

  const getToken = useCallback(() => {
    return accessToken || djangoApiClient.getAccessToken();
  }, [accessToken]);

  return {
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    getToken,
  };
};
