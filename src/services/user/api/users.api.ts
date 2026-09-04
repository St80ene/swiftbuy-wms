import type { IUser } from '@/interfaces/user.interface';
import apiClient from '@/services/api';

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  role_id: string;
  password: string;
}

export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  role_id?: string;
}

export interface ChangeUserRolePayload {
  role_id: string;
}

export const usersApi = {
  /**
   * Get all users
   */
  getAll: async (): Promise<IUser[]> => {
    const response = await apiClient.get<IUser[]>('/users');

    return response.data;
  },

  /**
   * Get a single user
   */
  getById: async (id: string): Promise<IUser> => {
    const response = await apiClient.get<IUser>(`/users/${id}`);

    return response.data;
  },

  /**
   * Create a user
   */
  create: async (payload: CreateUserPayload): Promise<IUser> => {
    const response = await apiClient.post<IUser>('/users', payload);

    return response.data;
  },

  /**
   * Update a user
   */
  update: async (id: string, payload: UpdateUserPayload): Promise<IUser> => {
    const response = await apiClient.patch<IUser>(`/users/${id}`, payload);

    return response.data;
  },

  /**
   * Change user's role
   */
  changeRole: async (
    id: string,
    payload: ChangeUserRolePayload,
  ): Promise<IUser> => {
    const response = await apiClient.patch<IUser>(`/users/${id}/role`, payload);

    return response.data;
  },

  /**
   * Delete a user
   */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
