'use client';
import { useState } from 'react';

const emptyCountry = { slug: '', flag: '🏳️', name: '', entity: '', currencySym: '€', basePrice: 0, govFee: 0, days: 1, remote: true, taxNote: '', published: true, order: 0 };
const emptyService = { slug: '', groupName: '', name: '', description: '', price: 0, yearly: false, recurring: false, required: false, published: true, order: 0 };

export default function CountriesManager({ initialCountries }) {
  const [countries, setCountries] = useState(initialCountries);
  const [expanded, setExpanded] = useState(null);
  const [newCountry, setNewCountry] = useState(emptyCountry);
  const [newServiceFor, setNewServiceFor] = useState(null);
  const [newService, setNewService] = useState(emptyService);

  async function updateCountry(id, patch) {
    await fetch(`/api/countries/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) });
    setCountries((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  async function deleteCountry(id) {
    if (!confirm('Bu ülkeyi ve tüm hizmetlerini silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/countries/${id}`, { method: 'DELETE' });
    setCountries((cs) => cs.filter((c) => c.id !== id));
  }

  async function addCountry(e) {
    e.preventDefault();
    const res = await fetch('/api/countries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newCountry) });
    const data = await res.json();
    setCountries((cs) => [...cs, { ...data, services: [] }]);
    setNewCountry(emptyCountry);
  }

  async function updateService(countryId, serviceId, patch) {
    await fetch(`/api/services/${serviceId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) });
    setCountries((cs) => cs.map((c) => c.id === countryId ? { ...c, services: c.services.map((s) => s.id === serviceId ? { ...s, ...patch } : s) } : c));
  }

  async function deleteService(countryId, serviceId) {
    if (!confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/services/${serviceId}`, { method: 'DELETE' });
    setCountries((cs) => cs.map((c) => c.id === countryId ? { ...c, services: c.services.filter((s) => s.id !== serviceId) } : c));
  }

  async function addService(countryId, e) {
    e.preventDefault();
    const res = await fetch('/api/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newService, countryId }) });
    const data = await res.json();
    setCountries((cs) => cs.map((c) => c.id === countryId ? { ...c, services: [...c.services, data] } : c));
    setNewService(emptyService);
    setNewServiceFor(null);
  }

  return (
    <div>
      {countries.map((c) => (
        <div key={c.id} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 22 }}>{c.flag}</span>
            <input style={{ width: 140 }} type="text" value={c.name} onChange={(e) => updateCountry(c.id, { name: e.target.value })} />
            <input style={{ width: 90 }} type="text" value={c.currencySym} onChange={(e) => updateCountry(c.id, { currencySym: e.target.value })} />
            <input style={{ width: 110 }} type="number" value={c.basePrice} onChange={(e) => updateCountry(c.id, { basePrice: parseFloat(e.target.value) || 0 })} />
            <input style={{ width: 90 }} type="number" value={c.govFee} onChange={(e) => updateCountry(c.id, { govFee: parseFloat(e.target.value) || 0 })} />
            <input style={{ width: 70 }} type="number" value={c.days} onChange={(e) => updateCountry(c.id, { days: parseInt(e.target.value) || 0 })} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
              <input type="checkbox" checked={c.published} onChange={(e) => updateCountry(c.id, { published: e.target.checked })} /> Yayında
            </label>
            <button type="button" className="btn btn-outline" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
              {expanded === c.id ? 'Hizmetleri gizle' : `Hizmetler (${c.services.length})`}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => deleteCountry(c.id)} style={{ color: '#B3261E' }}>Sil</button>
          </div>

          {expanded === c.id && (
            <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <table>
                <thead>
                  <tr><th>Grup</th><th>Hizmet</th><th>Fiyat</th><th>Yıllık</th><th>Zorunlu</th><th></th></tr>
                </thead>
                <tbody>
                  {c.services.map((s) => (
                    <tr key={s.id}>
                      <td><input style={{ width: 130 }} type="text" value={s.groupName} onChange={(e) => updateService(c.id, s.id, { groupName: e.target.value })} /></td>
                      <td><input style={{ width: 170 }} type="text" value={s.name} onChange={(e) => updateService(c.id, s.id, { name: e.target.value })} /></td>
                      <td><input style={{ width: 90 }} type="number" value={s.price} onChange={(e) => updateService(c.id, s.id, { price: parseFloat(e.target.value) || 0 })} /></td>
                      <td><input type="checkbox" checked={s.yearly} onChange={(e) => updateService(c.id, s.id, { yearly: e.target.checked })} /></td>
                      <td><input type="checkbox" checked={s.required} onChange={(e) => updateService(c.id, s.id, { required: e.target.checked })} /></td>
                      <td><button type="button" onClick={() => deleteService(c.id, s.id)} style={{ color: '#B3261E', background: 'none', border: 'none', cursor: 'pointer' }}>Sil</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {newServiceFor === c.id ? (
                <form onSubmit={(e) => addService(c.id, e)} style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div><label>Grup</label><input style={{ width: 130 }} value={newService.groupName} onChange={(e) => setNewService({ ...newService, groupName: e.target.value })} /></div>
                  <div><label>Ad</label><input style={{ width: 170 }} value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} /></div>
                  <div><label>Slug</label><input style={{ width: 100 }} value={newService.slug} onChange={(e) => setNewService({ ...newService, slug: e.target.value })} /></div>
                  <div><label>Fiyat</label><input style={{ width: 90 }} type="number" value={newService.price} onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })} /></div>
                  <button type="submit" className="btn btn-primary">Ekle</button>
                  <button type="button" className="btn btn-outline" onClick={() => setNewServiceFor(null)}>Vazgeç</button>
                </form>
              ) : (
                <button type="button" className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => setNewServiceFor(c.id)}>+ Hizmet ekle</button>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 10 }}>+ Yeni ülke ekle</div>
        <form onSubmit={addCountry} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div><label>Bayrak (emoji)</label><input style={{ width: 60 }} value={newCountry.flag} onChange={(e) => setNewCountry({ ...newCountry, flag: e.target.value })} /></div>
          <div><label>Ad</label><input style={{ width: 140 }} value={newCountry.name} onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })} /></div>
          <div><label>Slug</label><input style={{ width: 90 }} value={newCountry.slug} onChange={(e) => setNewCountry({ ...newCountry, slug: e.target.value })} /></div>
          <div><label>Şirket türü</label><input style={{ width: 140 }} value={newCountry.entity} onChange={(e) => setNewCountry({ ...newCountry, entity: e.target.value })} /></div>
          <div><label>Para birimi</label><input style={{ width: 60 }} value={newCountry.currencySym} onChange={(e) => setNewCountry({ ...newCountry, currencySym: e.target.value })} /></div>
          <div><label>Temel fiyat</label><input style={{ width: 100 }} type="number" value={newCountry.basePrice} onChange={(e) => setNewCountry({ ...newCountry, basePrice: parseFloat(e.target.value) || 0 })} /></div>
          <div><label>Gün</label><input style={{ width: 70 }} type="number" value={newCountry.days} onChange={(e) => setNewCountry({ ...newCountry, days: parseInt(e.target.value) || 0 })} /></div>
          <button type="submit" className="btn btn-primary">Ülke ekle</button>
        </form>
      </div>
    </div>
  );
}
