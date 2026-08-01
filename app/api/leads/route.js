import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

// GET /api/leads -> admin panelinde tüm iletişim taleplerini listeler
export async function GET() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(leads);
}

// POST /api/leads -> sitedeki iletişim formundan gelen kayıt
export async function POST(request) {
  const body = await request.json();
  if (!body.name || (!body.email && !body.phone)) {
    return NextResponse.json({ error: 'Ad ve en az bir iletişim bilgisi (e-posta veya telefon) gerekli.' }, { status: 400 });
  }
  const lead = await prisma.lead.create({
    data: {
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      subject: body.subject || null,
      message: body.message || null,
      source: body.source || 'iletisim',
    },
  });
  return NextResponse.json(lead, { status: 201 });
}
