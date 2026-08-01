import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';

// GET /api/faq?page=anasayfa
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');
  const items = await prisma.faqItem.findMany({
    where: page ? { page } : undefined,
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(items);
}

export async function POST(request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const body = await request.json();
  const item = await prisma.faqItem.create({ data: body });
  return NextResponse.json(item, { status: 201 });
}
