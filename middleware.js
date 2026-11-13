import { NextResponse } from 'next/server';

// Not: Next.js middleware Edge runtime'da çalışır, bu yüzden burada
// jsonwebtoken yerine sadece cookie varlığını kontrol ediyoruz.
// Gerçek doğrulama (imza kontrolü) ilgili admin sayfalarının/route'ların
// sunucu tarafında (lib/auth.js -> verifyAdminToken) tekrar yapılır.
const COOKIE_NAME = 'mw_admin_session';

// Marka izleme platformunda giriş gerektirmeyen uçlar:
//  - cron: CRON_SECRET ile korunur
//  - portal: müşteriye özel gizli bağlantı (token) ile korunur
//  - public: sitedeki "ücretsiz izleme" formu
const IZLEME_PUBLIC_API = ['/api/izleme/cron/', '/api/izleme/portal/', '/api/izleme/public/'];

export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login');
  const isIzlemeRoute = pathname === '/izleme' || pathname.startsWith('/izleme/');
  const isIzlemeApi = pathname.startsWith('/api/izleme/') && !IZLEME_PUBLIC_API.some((p) => pathname.startsWith(p));

  if (isAdminRoute || isAdminApi || isIzlemeRoute || isIzlemeApi) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      if (isAdminApi || isIzlemeApi) {
        return NextResponse.json({ error: 'Oturum bulunamadı. Lütfen yeniden giriş yapın.' }, { status: 401 });
      }
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname + (search || ''));
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/izleme', '/izleme/:path*', '/api/izleme/:path*'],
};
