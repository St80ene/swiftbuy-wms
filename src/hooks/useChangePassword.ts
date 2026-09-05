import { authApi } from '@/services/auth/api/auth.api';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const useChangePassword = () => {
  return useMutation<unknown, AxiosError, ChangePasswordPayload>({
    mutationFn: ({ currentPassword, newPassword }) =>
      authApi.changePassword(currentPassword, newPassword),
  });
};
