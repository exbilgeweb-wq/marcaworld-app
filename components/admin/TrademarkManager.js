'use client';
import { useState } from 'react';

const STATUSES = ['basvuru-alindi', 'arastirma-yapiliyor', 'basvuru-yapildi', 'tescil-edildi', 'reddedildi'];

export default function TrademarkManager({ initialApps }) {
  const [apps, setApps] = useState(initialApps);

  async function updateStatus(id, status) {
    await fetch(`/api/trademark/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    setApps((as) => as.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  async function remove(id) {
    if (!confirm('Bu başvuruyu silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/trademark/${id}`, { method: 'DELETE' });
    setApps((as) => as.filter((a) => a.id !== id));
  }

  if (apps.length === 0) return <p style={{ color: 'var(--ink-faint)' }}>Henüz başvuru yok.</p>;

  return (
    <table>
      <thead>
        <tr><th>Tarih</th><th>Marka</th><th>Başvuran</th><th>İletişim</th><th>Tür</th><th>Ülke</th><th>Durum</th><th></th></tr>
      </thead>
      <tbody>
        {apps.map((a) => (
          <tr key={a.id}>
            <td style={{ whiteSpace: 'nowrap' }}>{new Date(a.createdAt).toLocaleDateString('tr-TR')}</td>
            <td><b>{a.brandName}</b></td>
            <td>{a.applicantName}</td>
            <td>{a.email}<br />{a.phone}</td>
            <td>{a.applicationType === 'wipo' ? 'WIPO' : 'Ulusal'}</td>
            <td>{a.country}</td>
            <td>
              <select value={a.status} onChange={(e) => updateStatus(a.id, e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </td>
            <td><button type="button" onClick={() => remove(a.id)} style={{ color: '#B3261E', background: 'none', border: 'none', cursor: 'pointer' }}>Sil</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
