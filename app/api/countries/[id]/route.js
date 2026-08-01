import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { requireAdmin } from '../../../../lib/auth';

export async function GET(request, { params }) {
  const country = await prisma.country.findUnique({
    where: { id: params.id },
    include: { services: { orderBy: { order: 'asc' } } },
  });
  if (!country) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  return NextResponse.json(country);
}

export async function PUT(request, { params }) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const body = await request.json();
  const country = await prisma.country.update({ where: { id: params.id }, data: body });
  return NextResponse.json(country);
}

export async function DELETE(request, { params }) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  await prisma.country.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
