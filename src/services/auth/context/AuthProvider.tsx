import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { authApi } from '../api/auth.api';
import { tokenStorage } from '../utils/token_storage.util';
import { AuthContext } from './AuthContext';

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const queryClient = useQueryClient();

  const accessToken = tokenStorage.getAccessToken();

  const { data: user = null, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    enabled: !!accessToken,
    retry: false,
  });

  const login = async (email: string, password: string) => {
    const response = await authApi.login({
      email,
      password,
    });

    // Save tokens
    tokenStorage.setTokens(response.accessToken, response.refreshToken);

    // Store the user returned by the login API
    queryClient.setQueryData(['auth', 'me'], response.user);

    return response.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      tokenStorage.clearTokens();

      queryClient.removeQueries({
        queryKey: ['auth', 'me'],
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: accessToken ? isLoading : false,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
