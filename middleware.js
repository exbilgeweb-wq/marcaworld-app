import { NextResponse } from 'next/server';

// Not: Next.js middleware Edge runtime'da çalışır, bu yüzden burada
// jsonwebtoken yerine sadece cookie varlığını kontrol ediyoruz.
// Gerçek doğrulama (imza kontrolü) ilgili admin sayfalarının/route'ların
// sunucu tarafında (lib/auth.js -> verifyAdminToken) tekrar yapılır.
const COOKIE_NAME = 'mw_admin_session';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login');

  if (isAdminRoute || isAdminApi) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
      }
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
