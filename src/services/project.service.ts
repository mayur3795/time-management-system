import { apiClient } from '@/lib/api/axios';
import { Project } from '@/types/project';

export async function getProjects(): Promise<Project[]> {
  return apiClient.get<Project[]>('/api/projects');
}
