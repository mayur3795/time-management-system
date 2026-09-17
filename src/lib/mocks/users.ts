export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string; // For dummy authentication
  role: string;
  avatar: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'Frontend Developer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
];
