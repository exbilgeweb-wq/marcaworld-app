import { prisma } from '../../lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [leadCount, newLeadCount, trademarkCount, quoteCount, articleCount] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'yeni' } }),
    prisma.trademarkApplication.count(),
    prisma.companyConfiguration.count(),
    prisma.article.count(),
  ]);

  const cards = [
    { label: 'Toplam iletişim talebi', value: leadCount },
    { label: 'Yeni / bekleyen talep', value: newLeadCount },
    { label: 'Marka / WIPO başvurusu', value: trademarkCount },
    { label: 'Oluşturulan fiyat teklifi', value: quoteCount },
    { label: 'Rehber yazısı', value: articleCount },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Genel bakış</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        {cards.map((c) => (
          <div key={c.label} className="card">
            <div style={{ fontSize: 26, fontWeight: 800 }}>{c.value}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
