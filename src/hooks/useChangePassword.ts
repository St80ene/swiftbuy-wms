import { authApi } from '@/services/auth/api/auth.api';
import { useMutation } from '@tanstack/react-query';

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: ChangePasswordPayload) =>
      authApi.changePassword(currentPassword, newPassword),
  });
};
