import { apiClient } from '@/lib/api/axios';
import { User } from '@/types/auth';

export async function getCurrentUser(): Promise<User> {
  return apiClient.get<User>('/api/user');
}
