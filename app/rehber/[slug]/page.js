import { prisma } from '../../../lib/db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ArticleDetailPage({ params }) {
  const article = await prisma.article.findUnique({ where: { slug: params.slug } });
  if (!article || !article.published) notFound();

  return (
    <main className="container" style={{ padding: '40px 24px 64px', maxWidth: 760 }}>
      {article.category && <div className="badge" style={{ marginBottom: 12 }}>{article.category}</div>}
      <h1 style={{ fontSize: 29, fontWeight: 800, marginBottom: 20 }}>{article.title}</h1>
      <div
        style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink-soft)' }}
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />
    </main>
  );
}
