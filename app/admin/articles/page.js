import ArticlesManager from '../../../components/admin/ArticlesManager';
import { prisma } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Rehber yazıları</h1>
      <ArticlesManager initialArticles={articles} />
    </div>
  );
}
