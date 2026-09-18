import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import { getProjects } from '@/services/project.service';

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: getProjects,
  });
}
