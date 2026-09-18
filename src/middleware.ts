import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'tm_system_7fK9vQ2xLm8Rz4Np6Yt3Ws1Ha9Bc5De0',
  });

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/timesheets')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/timesheets/:path*'],
};
