const jwt = require('jsonwebtoken');

// Canlı ortamda JWT_SECRET zorunludur; yoksa bilinen varsayılan anahtarla
// herkes oturum çerezi üretebilirdi. Hata, modül yüklenirken değil (derleme
// sırasında env olmayabilir) ilk kullanımda verilir.
function secret() {
  const s = process.env.JWT_SECRET;
  if (!s && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET ortam değişkeni tanımlı değil.');
  }
  return s || 'gelistirme-ortami-anahtari';
}
const COOKIE_NAME = 'mw_admin_session';

function signAdminToken(adminUser) {
  return jwt.sign(
    { id: adminUser.id, email: adminUser.email, role: adminUser.role },
    secret(),
    { expiresIn: '7d' }
  );
}

function verifyAdminToken(token) {
  try {
    return jwt.verify(token, secret());
  } catch (e) {
    return null;
  }
}

// API route'ları içinde admin doğrulaması için kullanılır.
// Kullanım: const admin = requireAdmin(request); if (!admin) return 401;
function requireAdmin(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

module.exports = { signAdminToken, verifyAdminToken, requireAdmin, COOKIE_NAME };
