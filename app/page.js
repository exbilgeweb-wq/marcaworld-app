import { prisma } from '../lib/db';
import FaqAccordion from '../components/FaqAccordion';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const countries = await prisma.country.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });
  const faqs = await prisma.faqItem.findMany({ where: { page: 'anasayfa' }, orderBy: { order: 'asc' } });

  return (
    <main>
      <section className="container" style={{ padding: '56px 24px 44px' }}>
        <div style={{ fontSize: 11.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 14 }}>
          Şeffaf fiyat · adım adım kuruluş
        </div>
        <h1 style={{ fontSize: 42, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 16px', maxWidth: 760 }}>
          Yurtdışı şirketinizi paket karmaşası olmadan kurun
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-muted)', margin: '0 0 26px', maxWidth: 560 }}>
          Tek bir temel kuruluş paketi, üstüne yalnızca ihtiyacınız olan hizmetler. Toplamı ve ikinci yıl maliyetini ödeme yapmadan önce görün.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a className="btn btn-primary" href="/fiyatlandirma">Paketini oluştur →</a>
          <a className="btn btn-outline" href="/marka-tescili">Marka tescili</a>
        </div>
      </section>

      <section id="ulkeler" className="container" style={{ padding: '20px 24px 56px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 18 }}>Şirket kurabileceğiniz ülkeler</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {countries.map((c) => (
            <a key={c.id} href={`/fiyatlandirma?ulke=${c.slug}`} className="card" style={{ display: 'block' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{c.flag}</div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{c.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginBottom: 10 }}>{c.entity}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                {c.currencySym}{c.basePrice.toLocaleString('tr-TR')}&apos;den başlayan · {c.days} iş günü
              </div>
              {c.taxNote && <div style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 4 }}>{c.taxNote}</div>}
            </a>
          ))}
        </div>
      </section>

      <section id="sss" className="container" style={{ padding: '20px 24px 64px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 18 }}>Sık sorulan sorular</h2>
        <FaqAccordion items={faqs} />
      </section>
    </main>
  );
}
