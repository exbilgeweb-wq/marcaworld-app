import { Suspense } from 'react';
import { prisma } from '../../../lib/db';
import PricingConfigurator from '../../../components/PricingConfigurator';

export const dynamic = 'force-dynamic';

export default async function FiyatlandirmaPage() {
  const countries = await prisma.country.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
    include: { services: { where: { published: true }, orderBy: { order: 'asc' } } },
  });

  return (
    <main className="container" style={{ padding: '40px 24px 64px' }}>
      <h1 style={{ fontSize: 29, fontWeight: 700, letterSpacing: '-0.025em', margin: '0 0 8px' }}>
        Paketinizi kendiniz kurun
      </h1>
      <p style={{ color: 'var(--ink-muted)', marginBottom: 28, maxWidth: 620 }}>
        Ülkenizi seçin, ihtiyacınız olan hizmetleri ekleyin, toplam ve ikinci yıl maliyetini anında görün. Bilgilerinizi girdiğinizde size özel bir PDF teklif oluşturuyoruz.
      </p>
      <Suspense fallback={<div>Yükleniyor…</div>}>
        <PricingConfigurator countries={countries} />
      </Suspense>
    </main>
  );
}
