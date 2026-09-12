import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/user/api/users.api';

export const useGetPersonalProfile = (id: string) => {
  return useQuery({
    queryKey: ['personal_profile'],
    queryFn: () => usersService.getById(id),
  });
};
