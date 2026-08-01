import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';

// GET /api/services?countryId=xxx
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const countryId = searchParams.get('countryId');
  const services = await prisma.service.findMany({
    where: countryId ? { countryId } : undefined,
    orderBy: { order: 'asc' },
    include: { country: true },
  });
  return NextResponse.json(services);
}

export async function POST(request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const body = await request.json();
  const service = await prisma.service.create({ data: body });
  return NextResponse.json(service, { status: 201 });
}
