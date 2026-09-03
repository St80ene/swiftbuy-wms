import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

import { authApi } from '../api/auth.api';
import { tokenStorage } from '../utils/token_storage.util';
import { AuthContext } from './AuthContext';

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const queryClient = useQueryClient();

  // Keep token existence in React state so changes trigger a re-render
  const [hasAccessToken, setHasAccessToken] = useState(
    () => !!tokenStorage.getAccessToken(),
  );

  const { data: user = null, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    enabled: hasAccessToken,
    retry: false,
  });

  const login = async (email: string, password: string) => {
    const response = await authApi.login({
      email,
      password,
    });

    // Save tokens
    tokenStorage.setTokens(response.accessToken, response.refreshToken);

    // Tell React that authentication now exists
    setHasAccessToken(true);

    // Cache the user returned by login
    queryClient.setQueryData(['auth', 'me'], response.user);

    return response.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      // Clear authentication first
      tokenStorage.clearTokens();

      // Update React state
      setHasAccessToken(false);

      // Remove authenticated user
      queryClient.removeQueries({
        queryKey: ['auth', 'me'],
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: hasAccessToken && isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
