import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseClient(request);
  const { data: { session } } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith('/login');
  const isPortalRoute = pathname.startsWith('/portal');
  const isKioskRoute = pathname.startsWith('/kiosk');
  const isDashboardRoute = !isPortalRoute && !isKioskRoute && !isAuthRoute && !pathname.startsWith('/api/webhook');

  if (!session && (isDashboardRoute || isPortalRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && isAuthRoute) {
    const role = (session.user.user_metadata as any)?.role;
    return NextResponse.redirect(
      new URL(role === 'CUSTOMER' ? '/portal' : '/dashboard', request.url)
    );
  }

  if (session) {
    const role = (session.user.user_metadata as any)?.role;
    if (isPortalRoute && role !== 'CUSTOMER') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (isDashboardRoute && role === 'CUSTOMER') {
      return NextResponse.redirect(new URL('/portal', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
