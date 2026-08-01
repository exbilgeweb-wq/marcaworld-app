import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { requireAdmin } from '../../../../lib/auth';

export async function PUT(request, { params }) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const body = await request.json();
  const app = await prisma.trademarkApplication.update({ where: { id: params.id }, data: body });
  return NextResponse.json(app);
}

export async function DELETE(request, { params }) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  await prisma.trademarkApplication.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
