import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  const apps = await prisma.trademarkApplication.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(apps);
}

// POST /api/trademark -> marka tescili veya WIPO başvuru formundan gelen kayıt
export async function POST(request) {
  const body = await request.json();
  if (!body.brandName || !body.applicantName || !body.email) {
    return NextResponse.json({ error: 'Marka adı, başvuran adı ve e-posta zorunludur.' }, { status: 400 });
  }
  const app = await prisma.trademarkApplication.create({
    data: {
      brandName: body.brandName,
      applicantName: body.applicantName,
      email: body.email,
      phone: body.phone || '',
      country: body.country || 'Türkiye',
      niceClasses: body.niceClasses || null,
      applicationType: body.applicationType || 'ulusal',
      note: body.note || null,
    },
  });
  return NextResponse.json(app, { status: 201 });
}
