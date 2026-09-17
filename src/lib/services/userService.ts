import { User } from '@/types/auth';
import { MOCK_USERS } from '@/lib/mocks/users';

export class UserService {
  static async getCurrentUser(): Promise<User | null> {
    const user = MOCK_USERS[0];
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }

  static async findUserByEmail(email: string) {
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    return user || null;
  }
}
