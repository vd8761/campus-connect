import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { verifyAdminSessionToken } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const session = request.cookies.get('admin_session');
    const isValid = await verifyAdminSessionToken(session?.value);
    
    if (!isValid) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
