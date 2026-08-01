import CountriesManager from '../../../components/admin/CountriesManager';
import { prisma } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminCountriesPage() {
  const countries = await prisma.country.findMany({
    orderBy: { order: 'asc' },
    include: { services: { orderBy: { order: 'asc' } } },
  });
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Ülkeler ve fiyatlar</h1>
      <CountriesManager initialCountries={countries} />
    </div>
  );
}
