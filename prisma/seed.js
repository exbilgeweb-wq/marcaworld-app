// Marcaworld ilk veri yükleme (seed) script'i
// Çalıştırmak için: npm run prisma:seed
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // --- Admin kullanıcı ---
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@marcaworld.co';
  const adminPassword = process.env.ADMIN_PASSWORD || 'degistirin-bu-sifreyi';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, name: 'Marcaworld Admin', role: 'admin' },
  });

  // --- Ülkeler ---
  const countries = [
    { slug: 'hu', flag: '🇭🇺', name: 'Macaristan', entity: 'Kft. şirket kuruluşu', currencySym: '€', basePrice: 1650, govFee: 0, days: 12, remote: true, taxNote: '%9 kurumlar vergisi', order: 1 },
    { slug: 'uk', flag: '🇬🇧', name: 'İngiltere', entity: 'Ltd. şirket kuruluşu', currencySym: '£', basePrice: 249, govFee: 100, days: 1, remote: true, taxNote: '%19 kurumlar vergisi', order: 2 },
    { slug: 'us', flag: '🇺🇸', name: 'Amerika', entity: 'LLC', currencySym: '$', basePrice: 340, govFee: 100, days: 7, remote: true, taxNote: 'Eyalete göre değişir', order: 3 },
    { slug: 'ge', flag: '🇬🇪', name: 'Gürcistan', entity: 'LLC', currencySym: '$', basePrice: 1500, govFee: 0, days: 5, remote: true, taxNote: '%0-15 (sanal bölge)', order: 4 },
    { slug: 'nl', flag: '🇳🇱', name: 'Hollanda', entity: 'BV', currencySym: '€', basePrice: 1400, govFee: 0, days: 10, remote: true, taxNote: '%25.8 kurumlar vergisi', order: 5 },
    { slug: 'ae', flag: '🇦🇪', name: 'Birleşik Arap Emirlikleri', entity: 'Free Zone LLC', currencySym: '$', basePrice: 2200, govFee: 0, days: 10, remote: false, taxNote: '%0 kurumlar vergisi', order: 6 },
    { slug: 'bg', flag: '🇧🇬', name: 'Bulgaristan', entity: 'OOD', currencySym: '€', basePrice: 850, govFee: 0, days: 10, remote: true, taxNote: '%10 sabit vergi', order: 7 },
    { slug: 'ro', flag: '🇷🇴', name: 'Romanya', entity: 'SRL', currencySym: '€', basePrice: 950, govFee: 0, days: 10, remote: true, taxNote: '%16 kurumlar vergisi', order: 8 },
    { slug: 'tr', flag: '🇹🇷', name: 'Türkiye', entity: 'Ltd. Şti.', currencySym: '₺', basePrice: 25000, govFee: 0, days: 7, remote: false, taxNote: '%25 kurumlar vergisi', order: 9 },
  ];

  const serviceTemplates = {
    hu: [
      { slug: 'address', groupName: 'Adres ve operasyon', name: '1 yıllık kayıtlı ofis', description: 'Yasal şirket adresi ve posta kabulü', price: 1000, yearly: true, required: true },
      { slug: 'mail', groupName: 'Adres ve operasyon', name: 'Posta tarama ve yönlendirme', description: 'Gelen evrakların dijital iletimi', price: 250, yearly: true },
      { slug: 'bank', groupName: 'Banka ve ödeme', name: 'Dijital banka başvuru desteği', description: 'Başvuru evrakı ve süreç takibi', price: 300, recurring: true, days: 5 },
      { slug: 'vat', groupName: 'Vergi ve muhasebe', name: 'KDV aktivasyon desteği', description: 'Faaliyete göre KDV sürecinin başlatılması', price: 250 },
      { slug: 'acct6', groupName: 'Vergi ve muhasebe', name: '6 aylık muhasebe hizmeti', description: 'Aylık kayıt, beyan ve danışmanlık', price: 1300, recurring: true, term: '6 ay', renewPrice: 2600 },
      { slug: 'acct12', groupName: 'Vergi ve muhasebe', name: '12 aylık muhasebe hizmeti', description: 'Yıllık muhasebe ve beyan desteği', price: 2200, yearly: true },
      { slug: 'chamber', groupName: 'Vergi ve muhasebe', name: 'Ticaret odası ilk yıl kaydı', description: 'Kayıt ve ilk yıl üyelik işlemi', price: 150 },
      { slug: 'trademark', groupName: 'Marka ve dijital', name: 'Marka ön araştırması', description: 'Macaristan ve AB için ön tarama', price: 200 },
      { slug: 'web', groupName: 'Marka ve dijital', name: 'Kurumsal web ve e-posta', description: 'Tek sayfa web sitesi ve alan adı e-postası', price: 450 },
      { slug: 'partner', groupName: 'Şirket yapısı', name: 'Ek ortak işlemleri', description: 'İkinci ve sonraki ortak başına', price: 250 },
    ],
    uk: [
      { slug: 'address', groupName: 'Adres ve operasyon', name: '1 yıllık yasal adres', description: 'Companies House kayıtlı ofis adresi', price: 350, yearly: true, required: true },
      { slug: 'directorAddress', groupName: 'Adres ve operasyon', name: 'Yetkili hizmet adresi', description: 'Yönetici adres gizliliği için', price: 180, yearly: true },
      { slug: 'mail', groupName: 'Adres ve operasyon', name: 'Posta yönlendirme', description: 'Resmî postaların taranması ve iletimi', price: 180, yearly: true },
      { slug: 'bank', groupName: 'Banka ve ödeme', name: 'Banka hesabı başvuru desteği', description: 'Fintech veya banka başvuru dosyası', price: 250, recurring: true, days: 5 },
      { slug: 'stripe', groupName: 'Banka ve ödeme', name: 'Stripe / PayPal başvuru desteği', description: 'Ödeme sistemi hesap hazırlığı', price: 220, days: 7 },
      { slug: 'vat', groupName: 'Vergi ve muhasebe', name: 'VAT kayıt başvurusu', description: 'Uygunluk kontrolü ve kayıt işlemi', price: 250 },
      { slug: 'eori', groupName: 'Vergi ve muhasebe', name: 'EORI numarası', description: 'İthalat ve ihracat işlemleri için', price: 150 },
      { slug: 'accounting', groupName: 'Vergi ve muhasebe', name: '12 aylık muhasebe', description: 'Yıllık hesaplar ve beyan desteği', price: 750, recurring: true, yearly: true },
      { slug: 'trademark', groupName: 'Marka ve dijital', name: 'Marka tescil başvurusu (UK)', description: 'IPO sınıf araştırması ve başvurunun yürütülmesi', price: 650 },
      { slug: 'phone', groupName: 'Marka ve dijital', name: '+44 telefon numarası', description: 'İngiltere sanal iş telefonu', price: 120, yearly: true },
      { slug: 'web', groupName: 'Marka ve dijital', name: 'Kurumsal web ve e-posta', description: 'Tek sayfa web sitesi ve e-posta', price: 350 },
    ],
  };

  for (const c of countries) {
    const country = await prisma.country.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    const services = serviceTemplates[c.slug];
    if (services) {
      for (let i = 0; i < services.length; i++) {
        const s = services[i];
        const existing = await prisma.service.findFirst({ where: { countryId: country.id, slug: s.slug } });
        if (!existing) {
          await prisma.service.create({ data: { ...s, countryId: country.id, order: i } });
        }
      }
    }
  }

  // --- SSS örnekleri (anasayfa) ---
  const faqs = [
    { page: 'anasayfa', question: 'Yurtdışında şirket kurmak ne kadar sürer?', answer: 'İngiltere\u2019de aynı gün, Gürcistan\u2019da 5 iş günü, Amerika\u2019da eyalete göre 3-10 iş günü, Macaristan gibi AB ülkelerinde ortalama 12 iş günü sürer.', order: 1 },
    { page: 'anasayfa', question: 'Şirket kurmak için yurtdışına gitmem gerekiyor mu?', answer: 'Çoğu ülkede hayır; süreç vekâletname ve apostilli belgelerle uzaktan yürütülür. Türkiye ve Dubai\u2019de bazı adımlar fiziksel bulunma gerektirebilir.', order: 2 },
    { page: 'anasayfa', question: 'Fiyata resmî harçlar dahil mi?', answer: 'Devlet harçları şeffaflık için ayrı gösterilir. Amerika\u2019da 50-160 USD eyalet ücreti, İngiltere\u2019de 100 GBP kuruluş harcı paket bedeline eklenir.', order: 3 },
    { page: 'anasayfa', question: 'İkinci yıl ne ödeyeceğim?', answer: 'Kayıtlı adres, muhasebe ve telefon gibi hizmetler yıllık yenilenir; kuruluş bedeli tekrar alınmaz.', order: 4 },
  ];
  for (const f of faqs) {
    const existing = await prisma.faqItem.findFirst({ where: { page: f.page, question: f.question } });
    if (!existing) await prisma.faqItem.create({ data: f });
  }

  // --- Marka tescili adımları ve anasayfa hero metni (esnek içerik) ---
  await prisma.pageContent.upsert({
    where: { page: 'marka-tescili' },
    update: {},
    create: {
      page: 'marka-tescili',
      data: {
        heroTitle: 'Markanızı Türkiye ve yurtdışında tescilleyin',
        heroSubtitle: 'Sınıf araştırmasından tescil belgesine kadar tüm süreci sizin adınıza yürütüyoruz.',
        steps: [
          { n: '1', h: 'Sınıf ve benzerlik araştırması', p: 'Markanız hangi sınıfta korunacak, engel olabilecek tescil var mı — önce bunu netleştiriyoruz.' },
          { n: '2', h: 'Başvuru dosyası', p: 'Logo, sınıf listesi ve mal/hizmet tanımları ilgili kuruma uygun biçimde hazırlanır.' },
          { n: '3', h: 'Yayın ve itiraz takibi', p: 'Bültende yayın dönemi ve üçüncü taraf itirazları sizin adınıza izlenir.' },
          { n: '4', h: 'Tescil belgesi', p: 'Onay sonrası belge iletilir; yenileme takvimi sisteme işlenir.' },
        ],
      },
    },
  });

  await prisma.pageContent.upsert({
    where: { page: 'sirket-kurulumu' },
    update: {},
    create: {
      page: 'sirket-kurulumu',
      data: {
        heroTitle: 'Teknokent / Ar-Ge şirket kuruluşu',
        steps: [
          { when: 'Gün 0–3', who: 'Marcaworld', h: 'Ön değerlendirme ve bölge seçimi', p: 'Proje kapsama giriyor mu, hangi bölgenin kriterleri uygun, kuluçka mı ofis mi — bu üç soru ücretsiz olarak yanıtlanır.' },
          { when: 'Gün 3–10', who: 'Ortak çalışma', h: 'Proje dosyasının yazımı', p: 'Yenilikçi yön, teknik risk, iş paketleri, takvim, bütçe ve personel planı hakem diliyle yazılır.' },
          { when: 'Gün 10–12', who: 'Marcaworld', h: 'Yönetici şirkete başvuru', p: 'Bölgenin portalı üzerinden dosya ve ekler yüklenir, başvuru bedeli yatırılır.' },
          { when: '2–6 hafta', who: 'Teknokent', h: 'Hakem incelemesi ve komisyon', p: 'Bağımsız hakem raporu hazırlanır, gerekirse proje sunumu yapılır.' },
          { when: '1 hafta', who: 'Ortak çalışma', h: 'Kabul ve yerleşim sözleşmesi', p: 'Kabul yazısı sonrası kira veya kuluçka sözleşmesi imzalanır.' },
          { when: '3–5 iş günü', who: 'Marcaworld', h: 'Şirket kuruluşu veya adres tescili', p: 'MERSİS başvurusu, esas sözleşme, NACE kodu ve ticaret sicil tescili yapılır.' },
          { when: 'Faaliyet başlangıcı', who: 'Marcaworld', h: 'İstisna kurulumu ve raporlama', p: 'Bordro istisna kodları, gelir ayrımı ve aylık muafiyet raporları kurulur.' },
        ],
      },
    },
  });

  console.log('Seed tamamlandı. Admin girişi:', adminEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
