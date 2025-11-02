import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const supabaseToken = req.cookies.get('sb-access-token')?.value;

  const isAdminPath = req.nextUrl.pathname.startsWith('/admin');
  if (isAdminPath && !supabaseToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
