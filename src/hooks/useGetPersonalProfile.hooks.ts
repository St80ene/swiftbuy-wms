import { usersApi } from '@/services/user/api/users.api';
import { useQuery } from '@tanstack/react-query';

export const useGetPersonalProfile = (id: string) => {
  return useQuery({
    queryKey: ['personal_profile'],
    queryFn: () => usersApi.getById(id),
  });
};
