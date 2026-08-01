'use client';
import { useState } from 'react';

const STATUSES = ['yeni', 'iletisimde', 'kapandi'];

export default function LeadsManager({ initialLeads }) {
  const [leads, setLeads] = useState(initialLeads);

  async function updateStatus(id, status) {
    await fetch(`/api/leads/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
  }

  async function remove(id) {
    if (!confirm('Bu talebi silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    setLeads((ls) => ls.filter((l) => l.id !== id));
  }

  if (leads.length === 0) return <p style={{ color: 'var(--ink-faint)' }}>Henüz talep yok.</p>;

  return (
    <table>
      <thead>
        <tr><th>Tarih</th><th>Ad</th><th>İletişim</th><th>Kaynak</th><th>Mesaj</th><th>Durum</th><th></th></tr>
      </thead>
      <tbody>
        {leads.map((l) => (
          <tr key={l.id}>
            <td style={{ whiteSpace: 'nowrap' }}>{new Date(l.createdAt).toLocaleDateString('tr-TR')}</td>
            <td>{l.name}</td>
            <td>{l.email}{l.email && l.phone ? <br /> : null}{l.phone}</td>
            <td>{l.source}</td>
            <td style={{ maxWidth: 260 }}>{l.subject && <b>{l.subject}: </b>}{l.message}</td>
            <td>
              <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </td>
            <td><button type="button" onClick={() => remove(l.id)} style={{ color: '#B3261E', background: 'none', border: 'none', cursor: 'pointer' }}>Sil</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
