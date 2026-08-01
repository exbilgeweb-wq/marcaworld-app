import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { prisma } from '../../../../../lib/db';

// GET /api/quote/[id]/pdf -> o teklife ait PDF dosyasını üretip döndürür
export async function GET(request, { params }) {
  const config = await prisma.companyConfiguration.findUnique({
    where: { id: params.id },
    include: { country: true },
  });
  if (!config) return NextResponse.json({ error: 'Teklif bulunamadı.' }, { status: 404 });

  const chunks = [];
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.on('data', (c) => chunks.push(c));

  const sym = config.country?.currencySym || '';

  doc.fontSize(20).fillColor('#1B1917').text('marcaworld', { continued: false });
  doc.moveDown(0.3);
  doc.fontSize(12).fillColor('#6F6A65').text('Şirket kuruluş teklifi');
  doc.moveDown(1);

  doc.fontSize(10).fillColor('#8A8580').text(`Teklif no: ${config.id}`);
  doc.text(`Tarih: ${new Date(config.createdAt).toLocaleDateString('tr-TR')}`);
  doc.moveDown(1);

  doc.fontSize(13).fillColor('#1B1917').text(`Ülke: ${config.country?.name || '-'} (${config.country?.entity || '-'})`);
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor('#4A4643').text(`Müşteri: ${config.customerName}`);
  doc.text(`E-posta: ${config.customerEmail}`);
  if (config.customerPhone) doc.text(`Telefon: ${config.customerPhone}`);
  doc.moveDown(1);

  doc.fontSize(13).fillColor('#1B1917').text('Seçilen kalemler');
  doc.moveDown(0.3);
  doc.fontSize(11).fillColor('#1B1917').text(`Temel kuruluş paketi + resmi harç`, { continued: true });
  doc.text(`   ${sym}${(config.country.basePrice + config.country.govFee).toLocaleString('tr-TR')}`, { align: 'right' });

  const services = Array.isArray(config.selectedServices) ? config.selectedServices : [];
  for (const s of services) {
    doc.text(`${s.name}${s.yearly ? ' (yıllık)' : ''}`, { continued: true });
    doc.text(`   ${sym}${Number(s.price).toLocaleString('tr-TR')}`, { align: 'right' });
  }

  if (config.discountApplied > 0) {
    doc.fillColor('#0F6E56').text('3+ hizmet indirimi (%10)', { continued: true });
    doc.text(`   -${sym}${config.discountApplied.toLocaleString('tr-TR')}`, { align: 'right' });
    doc.fillColor('#1B1917');
  }

  doc.moveDown(1);
  doc.fontSize(14).text(`Toplam: ${sym}${config.totalPrice.toLocaleString('tr-TR')}`, { align: 'right' });
  if (config.secondYearPrice > 0) {
    doc.fontSize(10).fillColor('#8A8580').text(`İkinci yıl tahmini yenileme: ${sym}${config.secondYearPrice.toLocaleString('tr-TR')}`, { align: 'right' });
  }

  doc.moveDown(2);
  doc.fontSize(9).fillColor('#8A8580').text('Bu teklif bilgilendirme amaçlıdır, resmi harç ve kur değişimlerine göre güncellenebilir. Sorularınız için WhatsApp üzerinden bize ulaşabilirsiniz.', { width: 480 });

  doc.end();

  const pdfBuffer = await new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="marcaworld-teklif-${config.id}.pdf"`,
    },
  });
}
