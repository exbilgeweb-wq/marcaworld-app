import LeadForm from '../../components/LeadForm';

export default function IletisimPage() {
  return (
    <main className="container" style={{ padding: '40px 24px 64px' }}>
      <h1 style={{ fontSize: 29, fontWeight: 700, marginBottom: 8 }}>İletişim</h1>
      <p style={{ color: 'var(--ink-muted)', marginBottom: 28, maxWidth: 560 }}>
        Sorularınız için formu doldurun ya da WhatsApp üzerinden doğrudan yazın.
      </p>
      <LeadForm source="iletisim" title="Mesaj gönderin" />
    </main>
  );
}
