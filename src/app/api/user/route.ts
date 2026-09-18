import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { UserStore } from '@/server/user-store';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      const user = await UserStore.findUserByEmail(session.user.email);
      if (user) {
        return NextResponse.json(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
          { status: 200 }
        );
      }
    }

    const defaultUser = await UserStore.getCurrentUser();
    return NextResponse.json(defaultUser, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details.' },
      { status: 500 }
    );
  }
}
