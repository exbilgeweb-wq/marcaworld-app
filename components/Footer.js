export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: 60, padding: '40px 0', background: '#fff' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, fontSize: 13.5 }}>
        <div>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>marca<span style={{ color: 'var(--brand)' }}>world</span></div>
          <p style={{ color: 'var(--ink-muted)', lineHeight: 1.6 }}>Yurtdışında şirket kuruluşu, marka tescili ve Teknokent/Ar-Ge kuruluş danışmanlığı.</p>
        </div>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Hizmetler</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <a href="/fiyatlandirma">Şirket kuruluş paketleri</a>
            <a href="/marka-tescili">Marka tescili</a>
            <a href="/wipo-basvuru">WIPO uluslararası başvuru</a>
            <a href="/sirket-kurulumu">Teknokent / Ar-Ge kuruluşu</a>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>İletişim</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <a href="/iletisim">İletişim formu</a>
            <a href="/rehber">Rehber yazıları</a>
            <a href="/admin/login" style={{ color: 'var(--ink-faint)' }}>Yönetim paneli</a>
          </div>
        </div>
      </div>
      <div className="container" style={{ marginTop: 24, fontSize: 12, color: 'var(--ink-faint)' }}>© {new Date().getFullYear()} Marcaworld. Tüm hakları saklıdır.</div>
    </footer>
  );
}
