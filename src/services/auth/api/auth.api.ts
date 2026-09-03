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

  async me(): Promise<AuthUser> {
    const { data } = await apiClient.get<AuthUser>('/auth/me');

    return data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
};
