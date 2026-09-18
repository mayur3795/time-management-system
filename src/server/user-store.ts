import { User } from '@/types/auth';
import { INITIAL_USERS } from '@/constants/users';

export class UserStore {
  static async getCurrentUser(): Promise<User | null> {
    const user = INITIAL_USERS[0];
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };
  }

  static async findUserByEmail(email: string) {
    const user = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    return user || null;
  }
}
