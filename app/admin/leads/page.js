import LeadsManager from '../../../components/admin/LeadsManager';
import { prisma } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>İletişim talepleri</h1>
      <LeadsManager initialLeads={leads} />
    </div>
  );
}
