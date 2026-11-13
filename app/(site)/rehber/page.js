import { prisma } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export default async function RehberPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <main className="container" style={{ padding: '40px 24px 64px' }}>
      <h1 style={{ fontSize: 29, fontWeight: 700, marginBottom: 8 }}>Rehber</h1>
      <p style={{ color: 'var(--ink-muted)', marginBottom: 28, maxWidth: 620 }}>
        Yurtdışı şirket kuruluşu, marka tescili ve Teknokent/Ar-Ge süreçleri hakkında yazılarımız.
      </p>

      {articles.length === 0 && <p style={{ color: 'var(--ink-faint)' }}>Henüz yayınlanmış yazı yok.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {articles.map((a) => (
          <a key={a.id} href={`/rehber/${a.slug}`} className="card" style={{ display: 'block' }}>
            {a.category && <div className="badge" style={{ marginBottom: 10 }}>{a.category}</div>}
            <div style={{ fontWeight: 700, fontSize: 15.5, marginBottom: 6 }}>{a.title}</div>
            {a.excerpt && <div style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.6 }}>{a.excerpt}</div>}
          </a>
        ))}
      </div>
    </main>
  );
}
