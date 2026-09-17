import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { UserService } from '@/lib/services/userService';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      const user = await UserService.findUserByEmail(session.user.email);
      if (user) {
        const { password, ...safeUser } = user;
        return NextResponse.json(safeUser, { status: 200 });
      }
    }

    const defaultUser = await UserService.getCurrentUser();
    return NextResponse.json(defaultUser, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details.' },
      { status: 500 }
    );
  }
}
