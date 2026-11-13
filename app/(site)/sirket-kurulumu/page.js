import { prisma } from '../../../lib/db';
import LeadForm from '../../../components/LeadForm';

export const dynamic = 'force-dynamic';

export default async function SirketKurulumuPage() {
  const content = await prisma.pageContent.findUnique({ where: { page: 'sirket-kurulumu' } });
  const data = content?.data || {};
  const steps = data.steps || [];

  return (
    <main className="container" style={{ padding: '40px 24px 64px' }}>
      <h1 style={{ fontSize: 29, fontWeight: 700, marginBottom: 8 }}>{data.heroTitle || 'Teknokent / Ar-Ge şirket kuruluşu'}</h1>
      <p style={{ color: 'var(--ink-muted)', marginBottom: 32, maxWidth: 620 }}>
        Ön değerlendirmeden istisna kurulumuna kadar tüm adımları birlikte yürütüyoruz.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'start' }}>
        <div>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
              <div style={{ width: 90, flexShrink: 0, fontSize: 11.5, fontWeight: 700, color: 'var(--brand)', paddingTop: 2 }}>{s.when}</div>
              <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: 16, paddingBottom: 4 }}>
                <div style={{ fontSize: 10.5, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{s.who}</div>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{s.h}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.6 }}>{s.p}</div>
              </div>
            </div>
          ))}
        </div>
        <LeadForm source="sirket-kurulumu" title="Ön değerlendirme talep edin" />
      </div>
    </main>
  );
}
