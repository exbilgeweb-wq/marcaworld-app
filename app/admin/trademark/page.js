import TrademarkManager from '../../../components/admin/TrademarkManager';
import { prisma } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminTrademarkPage() {
  const apps = await prisma.trademarkApplication.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Marka / WIPO başvuruları</h1>
      <TrademarkManager initialApps={apps} />
    </div>
  );
}
