import { signIn, signOut } from 'next-auth/react';
import { LoginInput } from '@/schemas/auth.schema';

export async function loginWithCredentials(credentials: LoginInput) {
  return signIn('credentials', {
    redirect: false,
    email: credentials.email,
    password: credentials.password,
  });
}

export async function logoutUser(callbackUrl = '/login') {
  return signOut({ callbackUrl });
}
