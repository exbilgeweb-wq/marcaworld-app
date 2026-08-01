import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { requireAdmin } from '../../../../lib/auth';

export async function PUT(request, { params }) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const body = await request.json();
  const item = await prisma.faqItem.update({ where: { id: params.id }, data: body });
  return NextResponse.json(item);
}

export async function DELETE(request, { params }) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  await prisma.faqItem.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
