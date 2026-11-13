'use client';
import { usePathname } from 'next/navigation';

const GROUPS = [
  { title: 'Çalışma', items: [
    { href: '/izleme', label: 'Pano', exact: true },
    { href: '/izleme/eslesmeler', label: 'Eşleşmeler', countKey: 'newMatches', alert: true },
    { href: '/izleme/takvim', label: 'Süreler', countKey: 'urgentDeadlines', alert: true },
    { href: '/izleme/itirazlar', label: 'İtiraz dosyaları', countKey: 'openOppositions' },
  ] },
  { title: 'Veri', items: [
    { href: '/izleme/bultenler', label: 'Bültenler', countKey: 'runningBulletins' },
    { href: '/izleme/muvekkiller', label: 'Müvekkiller' },
    { href: '/izleme/portfoy', label: 'İzlenen markalar', countKey: 'pendingMarks' },
  ] },
  { title: 'Araçlar', items: [
    { href: '/izleme/arastirma', label: 'Hızlı araştırma' },
    { href: '/izleme/raporlar', label: 'Raporlar' },
    { href: '/izleme/ayarlar', label: 'Ayarlar' },
  ] },
];

export default function Nav({ counts = {} }) {
  const pathname = usePathname() || '';
  return (
    <nav className="iz-nav" aria-label="Platform menüsü">
      {GROUPS.map((g) => (
        <div className="iz-nav-group" key={g.title}>
          <span className="iz-nav-title">{g.title}</span>
          {g.items.map((it) => {
            const active = it.exact ? pathname === it.href : pathname === it.href || pathname.startsWith(it.href + '/');
            const n = it.countKey ? counts[it.countKey] : 0;
            return (
              <a key={it.href} href={it.href} aria-current={active ? 'page' : undefined}>
                <span>{it.label}</span>
                {n > 0 && <span className={`iz-count${it.alert ? ' alert' : ''}`}>{n > 999 ? '999+' : n}</span>}
              </a>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
