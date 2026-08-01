import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';

// GET /api/articles -> yayınlanmış yazılar (public sitede kullanılır)
// GET /api/articles?all=1 -> admin panelinde tüm yazılar (taslak dahil)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all');
  const articles = await prisma.article.findMany({
    where: all ? undefined : { published: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(articles);
}

export async function POST(request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const body = await request.json();
  if (!body.title || !body.slug) {
    return NextResponse.json({ error: 'Başlık ve slug zorunludur.' }, { status: 400 });
  }
  const article = await prisma.article.create({
    data: {
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt || null,
      contentHtml: body.contentHtml || '',
      category: body.category || null,
      published: !!body.published,
      publishedAt: body.published ? new Date() : null,
    },
  });
  return NextResponse.json(article, { status: 201 });
}
