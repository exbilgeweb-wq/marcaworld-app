import './izleme.css';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getStaffFromCookies } from '@/lib/izleme/auth.js';
import Nav from '@/components/izleme/Nav.js';
import { ToastProvider } from '@/components/izleme/interactive.js';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Marka İzleme — Marcaworld',
  robots: { index: false, follow: false },
};

async function loadCounts() {
  const in7 = new Date(Date.now() + 7 * 86400000);
  try {
    const [newMatches, urgentDeadlines, openOppositions, runningBulletins, pendingMarks] = await Promise.all([
      prisma.watchMatch.count({ where: { status: 'yeni' } }),
      prisma.deadline.count({ where: { status: 'acik', dueDate: { lte: in7 } } }),
      prisma.opposition.count({ where: { status: { in: ['hazirlaniyor', 'dosyalandi', 'karsi-gorus', 'karar-bekleniyor', 'yidk-itiraz', 'dava'] } } }),
      prisma.bulletin.count({ where: { status: { in: ['bekliyor', 'indiriliyor', 'ayristiriliyor', 'taraniyor'] } } }),
      prisma.watchedMark.count({ where: { pendingApproval: true } }),
    ]);
    return { newMatches, urgentDeadlines, openOppositions, runningBulletins, pendingMarks };
  } catch {
    return {};
  }
}

export default async function IzlemeLayout({ children }) {
  const staff = getStaffFromCookies();
  if (!staff) redirect('/admin/login?next=/izleme');
  const counts = await loadCounts();
  return (
    <ToastProvider>
      <div className="iz-root">
        <aside className="iz-side">
          <a href="/izleme" className="iz-brand" style={{ textDecoration: 'none' }}>
            <b>marca<span>world</span></b>
            <small>Marka izleme platformu</small>
          </a>
          <Nav counts={counts} />
          <div className="iz-side-foot">
            <span title={staff.email}>{staff.email}</span>
            <a href="/admin">Yönetim paneline dön</a>
          </div>
        </aside>
        <main className="iz-main" id="icerik">{children}</main>
      </div>
    </ToastProvider>
  );
}
