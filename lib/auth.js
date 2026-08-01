const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'gelistirme-ortami-anahtari';
const COOKIE_NAME = 'mw_admin_session';

function signAdminToken(adminUser) {
  return jwt.sign(
    { id: adminUser.id, email: adminUser.email, role: adminUser.role },
    SECRET,
    { expiresIn: '7d' }
  );
}

function verifyAdminToken(token) {
  try {
    return jwt.verify(token, SECRET);
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
