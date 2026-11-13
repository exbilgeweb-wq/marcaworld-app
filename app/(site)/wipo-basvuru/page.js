import TrademarkForm from '../../../components/TrademarkForm';

export default function WipoBasvuruPage() {
  return (
    <main className="container" style={{ padding: '40px 24px 64px' }}>
      <h1 style={{ fontSize: 29, fontWeight: 700, marginBottom: 8 }}>WIPO uluslararası marka başvurusu</h1>
      <p style={{ color: 'var(--ink-muted)', marginBottom: 32, maxWidth: 620 }}>
        Madrid Protokolü kapsamında tek başvuru ile birden fazla ülkede marka koruması sağlayın. Türkiye&apos;deki mevcut veya yeni başvurunuz temel alınarak uluslararası tescil süreci yürütülür.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Neden WIPO / Madrid Protokolü?</div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-muted)', lineHeight: 1.6, margin: 0 }}>
              Tek başvuru dosyası ve tek ücretle, seçtiğiniz üye ülkelerin her birinde ayrı ayrı başvuru yapmak yerine merkezi bir tescil süreci yürütülür.
            </p>
          </div>
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Süreç</div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-muted)', lineHeight: 1.6, margin: 0 }}>
              Türkiye&apos;deki tescilli veya başvuru aşamasındaki markanız temel alınır, hedef ülkeler belirlenir, WIPO üzerinden uluslararası başvuru yapılır ve her ülkenin ulusal ofisince incelenir.
            </p>
          </div>
        </div>
        <TrademarkForm applicationType="wipo" title="WIPO başvuru talebi oluşturun" />
      </div>
    </main>
  );
}
