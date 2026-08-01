import { prisma } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminQuotesPage() {
  const quotes = await prisma.companyConfiguration.findMany({
    orderBy: { createdAt: 'desc' },
    include: { country: true },
  });

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Fiyat teklifleri</h1>
      {quotes.length === 0 ? (
        <p style={{ color: 'var(--ink-faint)' }}>Henüz teklif oluşturulmadı.</p>
      ) : (
        <table>
          <thead>
            <tr><th>Tarih</th><th>Müşteri</th><th>Ülke</th><th>Toplam</th><th>Durum</th><th>PDF</th></tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{new Date(q.createdAt).toLocaleDateString('tr-TR')}</td>
                <td>{q.customerName}<br /><span style={{ color: 'var(--ink-faint)', fontSize: 12 }}>{q.customerEmail}</span></td>
                <td>{q.country ? `${q.country.flag} ${q.country.name}` : '-'}</td>
                <td>{q.country?.currencySym}{q.totalPrice.toLocaleString('tr-TR')}</td>
                <td>{q.status}</td>
                <td><a href={`/api/quote/${q.id}/pdf`} target="_blank" rel="noreferrer">Görüntüle</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
