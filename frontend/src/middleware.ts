import { NextRequest, NextResponse } from 'next/server';

// Lightweight middleware. Does NOT import TypeORM / DB code (runs on Edge).
// We just check cookie existence; full JWT verification happens in API routes.

const AUTH_COOKIE = 'receptify_token';
const PROTECTED_PREFIXES = ['/dashboard', '/customers', '/campaigns', '/scripts', '/analytics', '/templates', '/calls', '/settings', '/billing', '/compliance', '/help'];
const AUTH_PAGES = ['/login', '/signup'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE)?.value;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const isAuthPage = AUTH_PAGES.includes(pathname);

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && token) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|audio/|images/).*)'],
};
