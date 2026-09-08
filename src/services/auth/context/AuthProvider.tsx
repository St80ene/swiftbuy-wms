import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { AxiosError } from 'axios';

import { authApi, type LoginPayload } from '../api/auth.api';
import { tokenStorage } from '../utils/token_storage.util';
import { AuthContext } from './AuthContext';
import type { IUser } from '@/interfaces/user.interface';

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const queryClient = useQueryClient();

  const [hasAccessToken, setHasAccessToken] = useState(
    () => !!tokenStorage.getAccessToken(),
  );
  const [user, setUser] = useState<IUser | null>(null);

  // TanStack Query Mutation for login handling state, loading, and network issues
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginPayload) => authApi.login(credentials),
    onSuccess: (response) => {
      tokenStorage.setTokens(response.accessToken, response.refreshToken);
      setHasAccessToken(true);
      setUser(response.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      tokenStorage.clearTokens();
      setHasAccessToken(false);
      setUser(null);
      queryClient.removeQueries({
        queryKey: ['auth'],
      });
    },
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await loginMutation.mutateAsync({ email, password });
      return response.user;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          throw new Error(
            'Network error. Please check your internet connection and try again.',
            { cause: error },
          );
        }
        throw new Error(
          error.response.data?.message || 'Invalid email or password',
          { cause: error },
        );
      }
      throw error;
    }
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: loginMutation.isPending || logoutMutation.isPending,
        isAuthenticated: !!hasAccessToken && !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
