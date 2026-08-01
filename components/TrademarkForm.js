'use client';
import { useState } from 'react';

export default function TrademarkForm({ applicationType = 'ulusal', title = 'Marka tescil başvurusu' }) {
  const [form, setForm] = useState({ brandName: '', applicantName: '', email: '', phone: '', country: applicationType === 'wipo' ? 'Uluslararası (WIPO)' : 'Türkiye', niceClasses: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      const res = await fetch('/api/trademark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, applicationType }),
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
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Başvurunuz alındı ✓</div>
        <p style={{ color: 'var(--ink-muted)', fontSize: 13.5 }}>Uzmanlarımız sınıf ve benzerlik araştırması için sizinle iletişime geçecek.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 480 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label>Marka adı *</label>
          <input type="text" required value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} />
        </div>
        <div>
          <label>Başvuran ad soyad / firma *</label>
          <input type="text" required value={form.applicantName} onChange={(e) => setForm({ ...form, applicantName: e.target.value })} />
        </div>
        <div>
          <label>E-posta *</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label>Telefon</label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label>{applicationType === 'wipo' ? 'Başvurmak istediğiniz ülkeler' : 'Ülke'}</label>
          <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        </div>
        <div>
          <label>Mal / hizmet sınıfı (biliyorsanız)</label>
          <textarea rows={3} value={form.niceClasses} onChange={(e) => setForm({ ...form, niceClasses: e.target.value })} />
        </div>
      </div>
      {error && <p style={{ color: '#B3261E', fontSize: 13, marginTop: 10 }}>{error}</p>}
      <button type="submit" className="btn btn-primary" style={{ marginTop: 14 }} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Gönderiliyor…' : 'Başvuruyu gönder'}
      </button>
    </form>
  );
}
