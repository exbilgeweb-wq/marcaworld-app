// Marka izleme platformu — personel oturumu, yetki, cron ve portal yardımcıları.
// Personel = yönetim paneli kullanıcıları (AdminUser), aynı JWT çereziyle.
// Bu dosya next/headers kullandığı için YALNIZ Next içinden import edilir.
import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken, COOKIE_NAME } from '../auth.js';
import { prisma } from '../db.js';
import { can, effectiveRole } from './permissions.js';

async function loadStaff(token) {
  if (!token) return null;
  const payload = verifyAdminToken(token);
  if (!payload?.id) return null;
  const user = await prisma.adminUser.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, name: true, role: true, izlemeRole: true, active: true },
  });
  if (!user || !user.active) return null;
  return { ...user, platformRole: effectiveRole(user) };
}

/** Route handler içinde: { id, email, name, role, izlemeRole, platformRole } | null */
export async function getStaff(request) {
  return loadStaff(request.cookies.get(COOKIE_NAME)?.value);
}

/** Server component içinde personel bilgisi */
export async function getStaffFromCookies() {
  return loadStaff(cookies().get(COOKIE_NAME)?.value);
}

/**
 * Route handler korumasıyla birlikte: const { staff, error } = await requireStaff(request, 'musteriye.gonder');
 * if (error) return error;
 */
export async function requireStaff(request, action = 'goruntule') {
  const staff = await getStaff(request);
  if (!staff) return { staff: null, error: unauthorized() };
  if (!can(staff, action)) return { staff, error: forbidden() };
  return { staff, error: null };
}

export function unauthorized() {
  return NextResponse.json({ error: 'Oturumunuz sona ermiş. Lütfen yeniden giriş yapın.' }, { status: 401 });
}

export function forbidden(message = 'Bu işlem için yetkiniz yok. Bir yöneticiden yardım isteyin.') {
  return NextResponse.json({ error: message }, { status: 403 });
}

const sha256 = (s) => crypto.createHash('sha256').update(String(s)).digest();

/**
 * Cron uçları: yalnız "Authorization: Bearer <CRON_SECRET>" başlığı (sorgu
 * parametresi kabul edilmez; günlüklere sızar). CRON_SECRET en az 32 karakter.
 */
export function checkCronSecret(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 32) return false;
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return false;
  return crypto.timingSafeEqual(sha256(header.slice(7)), sha256(secret));
}

/** Müşteri portalı: { token (düz, yalnız bir kez gösterilir), hash } */
export function newPortalToken() {
  const token = crypto.randomBytes(24).toString('base64url');
  return { token, hash: hashToken(token) };
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

/** IP'yi düz saklamamak için tuzlu özet (KVKK) */
export function hashIp(ip) {
  if (!ip) return null;
  const salt = process.env.JWT_SECRET || 'izleme';
  return crypto.createHash('sha256').update(salt + ':' + ip).digest('hex').slice(0, 32);
}

/** İstemci IP'si: Vercel'de x-real-ip, VPS'te güvenilir proxy'nin x-forwarded-for son değeri */
export function clientIp(request) {
  return request.headers.get('x-real-ip')
    || (request.headers.get('x-forwarded-for') || '').split(',').map((s) => s.trim()).filter(Boolean).pop()
    || null;
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
export function fail(message, status = 400, extra) {
  return NextResponse.json({ error: message, ...(extra || {}) }, { status });
}

/** İyimser eşzamanlılık: gövdedeki expectedUpdatedAt kayıttan farklıysa 409 yanıtı döner, yoksa null */
export function staleCheck(record, expectedUpdatedAt, who) {
  if (!expectedUpdatedAt || !record?.updatedAt) return null;
  if (new Date(expectedUpdatedAt).getTime() !== new Date(record.updatedAt).getTime()) {
    return fail(`Bu kayıt az önce${who ? ' ' + who + ' tarafından' : ''} değiştirildi. Sayfayı yenileyip tekrar deneyin.`, 409);
  }
  return null;
}
