'use client';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { href: '/admin', label: 'Panel' },
  { href: '/admin/countries', label: 'Ülkeler ve fiyatlar' },
  { href: '/admin/leads', label: 'İletişim talepleri' },
  { href: '/admin/trademark', label: 'Marka / WIPO başvuruları' },
  { href: '/admin/quotes', label: 'Fiyat teklifleri' },
  { href: '/admin/articles', label: 'Rehber yazıları' },
  { href: '/izleme', label: 'Marka izleme platformu →' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '80vh' }}>
      <aside style={{ borderRight: '1px solid var(--border)', padding: '24px 16px', background: '#fff' }}>
        <div style={{ fontWeight: 800, marginBottom: 20, paddingLeft: 8 }}>marca<span style={{ color: 'var(--brand)' }}>world</span></div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                padding: '9px 10px',
                borderRadius: 8,
                fontSize: 13.5,
                fontWeight: 600,
                color: pathname === item.href ? 'var(--brand)' : 'var(--ink-soft)',
                background: pathname === item.href ? 'var(--brand-bg)' : 'transparent',
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button type="button" onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 24 }}>
          Çıkış yap
        </button>
      </aside>
      <div style={{ padding: '28px 32px' }}>{children}</div>
    </div>
  );
}
