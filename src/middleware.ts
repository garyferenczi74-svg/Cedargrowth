import { NextResponse, type NextRequest } from 'next/server';
import { KELVIN_COOKIE, verifySessionToken } from '@/lib/kelvinAuth';

// Gate for the KELVIN admin console. Every route under /admin/kelvin requires a
// valid signed session, with one exception: the login page itself. Without a
// session the middleware returns a bare 404, so the route does not announce that
// it exists. The login POST and logout live under /api and are not matched here.

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/admin/kelvin/login') {
    return NextResponse.next();
  }

  const token = req.cookies.get(KELVIN_COOKIE)?.value;
  const ok = await verifySessionToken(token, process.env.KELVIN_SESSION_SECRET);
  if (!ok) {
    return new NextResponse('Not found', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/kelvin', '/admin/kelvin/:path*'],
};
