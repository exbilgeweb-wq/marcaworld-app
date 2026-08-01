import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

// GET /api/quote -> admin panelinde tüm teklif taleplerini listeler
export async function GET() {
  const quotes = await prisma.companyConfiguration.findMany({
    orderBy: { createdAt: 'desc' },
    include: { country: true },
  });
  return NextResponse.json(quotes);
}

// POST /api/quote
// body: { countryId, selectedServiceIds: string[], customerName, customerEmail, customerPhone, activityNote, timeline }
// Seçilen ülke + hizmetlere göre toplamı sunucu tarafında hesaplar (istemciden gelen fiyata güvenilmez),
// teklifi veritabanına kaydeder ve indirilebilir bir PDF üretir.
export async function POST(request) {
  const body = await request.json();
  const { countryId, selectedServiceIds = [], customerName, customerEmail, customerPhone, activityNote, timeline } = body;

  if (!countryId || !customerName || !customerEmail) {
    return NextResponse.json({ error: 'Ülke, ad ve e-posta zorunludur.' }, { status: 400 });
  }

  const country = await prisma.country.findUnique({ where: { id: countryId } });
  if (!country) return NextResponse.json({ error: 'Ülke bulunamadı.' }, { status: 404 });

  const services = await prisma.service.findMany({ where: { id: { in: selectedServiceIds } } });

  let total = country.basePrice + country.govFee;
  let secondYear = 0;
  for (const s of services) {
    total += s.price;
    if (s.yearly) secondYear += s.renewPrice || s.price;
  }
  let discount = 0;
  if (services.length >= 3) {
    discount = Math.round(total * 0.1 * 100) / 100;
    total -= discount;
  }

  const config = await prisma.companyConfiguration.create({
    data: {
      countryId,
      selectedServices: services.map((s) => ({ id: s.id, name: s.name, price: s.price, yearly: s.yearly })),
      totalPrice: Math.round(total * 100) / 100,
      secondYearPrice: Math.round(secondYear * 100) / 100,
      discountApplied: discount,
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      activityNote: activityNote || null,
      timeline: timeline || null,
    },
  });

  return NextResponse.json({
    id: config.id,
    totalPrice: config.totalPrice,
    secondYearPrice: config.secondYearPrice,
    discountApplied: config.discountApplied,
    currencySym: country.currencySym,
    pdfUrl: `/api/quote/${config.id}/pdf`,
  }, { status: 201 });
}
