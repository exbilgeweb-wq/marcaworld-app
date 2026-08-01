'use client';
import { useState } from 'react';

export default function LeadForm({ source = 'iletisim', title = 'Bize ulaşın' }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | done | error
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu.');
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="card" style={{ maxWidth: 480 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Teşekkürler, mesajınız iletildi ✓</div>
        <p style={{ color: 'var(--ink-muted)', fontSize: 13.5 }}>Ekibimiz en kısa sürede sizinle iletişime geçecek.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 480 }}>
      {title && <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>{title}</h2>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label>Ad Soyad *</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label>E-posta</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label>Telefon</label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label>Konu</label>
          <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        </div>
        <div>
          <label>Mesajınız</label>
          <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
      </div>
      {error && <p style={{ color: '#B3261E', fontSize: 13, marginTop: 10 }}>{error}</p>}
      <button type="submit" className="btn btn-primary" style={{ marginTop: 14 }} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Gönderiliyor…' : 'Gönder'}
      </button>
    </form>
  );
}
