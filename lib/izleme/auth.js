// Marka izleme platformu — personel oturumu, cron ve portal yardımcıları.
// Personel = mevcut yönetim paneli kullanıcıları (AdminUser), aynı JWT çereziyle.
import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken, COOKIE_NAME } from '../auth.js';

/** Route handler içinde: geçerli personel → { id, email, role } | null */
export function getStaff(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

/** Server component içinde (next/headers) personel bilgisi */
export function getStaffFromCookies() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function unauthorized() {
  return NextResponse.json({ error: 'Oturumunuz sona ermiş. Lütfen yeniden giriş yapın.' }, { status: 401 });
}

/** Cron uçları: Authorization: Bearer <CRON_SECRET> ya da ?secret=<CRON_SECRET> */
export function checkCronSecret(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get('authorization') || '';
  const fromHeader = header.startsWith('Bearer ') ? header.slice(7) : '';
  const fromQuery = new URL(request.url).searchParams.get('secret') || '';
  const given = fromHeader || fromQuery;
  if (!given || given.length !== secret.length) return false;
  return crypto.timingSafeEqual(Buffer.from(given), Buffer.from(secret));
}

/** Müşteri portalı için tahmin edilemez bağlantı anahtarı (32 karakter) */
export function newPortalToken() {
  return crypto.randomBytes(24).toString('base64url');
}

/** Gövdeyi JSON olarak okur; bozuksa null */
export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

/** Türkçe hata yanıtı */
export function fail(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
