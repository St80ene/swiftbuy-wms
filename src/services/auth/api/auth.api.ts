import apiClient from '@/services/api';
import type {
  AuthUser,
  LoginResponse,
  RefreshResponse,
} from '../types/auth.type';

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>(
      '/auth/login',
      payload,
    );

    return data;
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const { data } = await apiClient.post<RefreshResponse>('/auth/refresh', {
      refreshToken,
    });

    return data;
  },

  async profile(): Promise<AuthUser> {
    const { data } = await apiClient.get<AuthUser>('/auth/profile');

    return data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};
