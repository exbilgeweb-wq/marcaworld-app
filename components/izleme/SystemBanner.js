// Platform kabuğunun üstünde, kapatılamayan sistem uyarıları (sunucu bileşeni).
import { prisma } from '@/lib/db';

function emailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export default async function SystemBanner() {
  const items = [];
  if (!emailConfigured()) {
    items.push({ tone: 'warn', text: 'E-posta ayarlanmadı: müşterilere ve ekibe bildirim gitmiyor. Ayarlar → Bildirimler bölümündeki adımları izleyin.', href: '/izleme/ayarlar#bildirim' });
  }
  try {
    const failed = await prisma.job.count({ where: { status: 'hata' } });
    if (failed > 0) items.push({ tone: 'error', text: `${failed} arka plan işi hata verdi. Ayrıntılar Ayarlar → İşler bölümünde.`, href: '/izleme/ayarlar#isler' });
    const check = await prisma.bulletin.count({ where: { status: 'kontrol-gerekli' } });
    if (check > 0) items.push({ tone: 'warn', text: `${check} bülten kontrol bekliyor: okunan kayıt sayısı ya da kalite beklenenin altında. Müşteriye otomatik bildirim yapılmadı.`, href: '/izleme/bultenler?status=kontrol-gerekli' });
  } catch {
    items.push({ tone: 'error', text: 'Veritabanına ulaşılamadı. Bağlantı ayarlarını kontrol edin.' });
  }
  if (!items.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((it, i) => (
        <div key={i} className={`iz-alert ${it.tone}`} role="status">
          {it.text} {it.href && <a href={it.href} style={{ fontWeight: 700, color: 'inherit', textDecoration: 'underline' }}>Aç</a>}
        </div>
      ))}
    </div>
  );
}
