import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import { getCurrentUser } from '@/services/user.service';

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.user.current,
    queryFn: getCurrentUser,
  });
}
