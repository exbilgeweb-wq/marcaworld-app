const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '905074064498';

export default function Header() {
  return (
    <>
      <div style={{ background: '#26244A', color: '#fff' }}>
        <div className="container" style={{ padding: '9px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, fontSize: 12 }}>
          <span><b style={{ fontWeight: 800 }}>9 ülkede</b> şirket kuruluş ve yönetim desteği</span>
          <span style={{ opacity: 0.68 }}>Türkiye · İngiltere · Amerika ofisleri &nbsp;|&nbsp; Pazartesi–Cuma 09:00–18:00</span>
        </div>
      </div>

      <header style={{ borderBottom: '1px solid var(--border)', background: 'rgba(250,249,247,0.92)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="container" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <a href="/" style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ink)' }}>
            marca<span style={{ color: 'var(--brand)' }}>world</span>
          </a>
          <nav style={{ display: 'flex', gap: 24, fontSize: 13.5, fontWeight: 600, flexWrap: 'wrap' }}>
            <a href="/sirket-kurulumu" style={{ color: 'var(--ink-soft)' }}>Şirket kuruluşu</a>
            <a href="/fiyatlandirma" style={{ color: 'var(--ink-soft)' }}>Paketini oluştur</a>
            <a href="/marka-tescili" style={{ color: 'var(--ink-soft)' }}>Marka tescili</a>
            <a href="/wipo-basvuru" style={{ color: 'var(--ink-soft)' }}>WIPO başvurusu</a>
            <a href="/rehber" style={{ color: 'var(--ink-soft)' }}>Rehber</a>
            <a href="/iletisim" style={{ color: 'var(--ink-soft)' }}>İletişim</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <a className="btn btn-whatsapp" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">WhatsApp</a>
            <a className="btn btn-primary" href="/fiyatlandirma">Paketini oluştur</a>
          </div>
        </div>
      </header>
    </>
  );
}
