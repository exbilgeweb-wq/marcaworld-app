import { prisma } from '../../lib/db';
import TrademarkForm from '../../components/TrademarkForm';

export const dynamic = 'force-dynamic';

export default async function MarkaTesciliPage() {
  const content = await prisma.pageContent.findUnique({ where: { page: 'marka-tescili' } });
  const data = content?.data || {};
  const steps = data.steps || [];

  return (
    <main className="container" style={{ padding: '40px 24px 64px' }}>
      <h1 style={{ fontSize: 29, fontWeight: 700, marginBottom: 8 }}>{data.heroTitle || 'Marka tescili'}</h1>
      <p style={{ color: 'var(--ink-muted)', marginBottom: 32, maxWidth: 620 }}>{data.heroSubtitle}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'start' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Süreç nasıl işliyor?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {steps.map((s) => (
              <div key={s.n} style={{ display: 'flex', gap: 14 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{s.h}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.6 }}>{s.p}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <TrademarkForm applicationType="ulusal" title="Ücretsiz ön araştırma talep edin" />
      </div>
    </main>
  );
}
