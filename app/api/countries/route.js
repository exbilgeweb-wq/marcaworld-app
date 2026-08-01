import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';

// GET /api/countries -> yayınlanmış tüm ülkeleri ve hizmetlerini döndürür
export async function GET() {
  const countries = await prisma.country.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
    include: { services: { where: { published: true }, orderBy: { order: 'asc' } } },
  });
  return NextResponse.json(countries);
}

// POST /api/countries -> admin panelinden yeni ülke ekler
export async function POST(request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const body = await request.json();
  const country = await prisma.country.create({ data: body });
  return NextResponse.json(country, { status: 201 });
}
