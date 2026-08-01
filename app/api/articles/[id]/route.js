import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { requireAdmin } from '../../../../lib/auth';

export async function PUT(request, { params }) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const body = await request.json();
  if (body.published && !body.publishedAt) body.publishedAt = new Date();
  const article = await prisma.article.update({ where: { id: params.id }, data: body });
  return NextResponse.json(article);
}

export async function DELETE(request, { params }) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  await prisma.article.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
