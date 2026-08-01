import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { requireAdmin } from '../../../../lib/auth';

// GET /api/page-content/marka-tescili -> o sayfaya ait esnek içerik bloğu
export async function GET(request, { params }) {
  const content = await prisma.pageContent.findUnique({ where: { page: params.page } });
  return NextResponse.json(content || { page: params.page, data: {} });
}

// PUT /api/page-content/marka-tescili -> admin panelinden JSON içerik güncelleme
export async function PUT(request, { params }) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const body = await request.json();
  const content = await prisma.pageContent.upsert({
    where: { page: params.page },
    update: { data: body.data },
    create: { page: params.page, data: body.data },
  });
  return NextResponse.json(content);
}
