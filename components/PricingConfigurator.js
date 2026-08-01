'use client';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PricingConfigurator({ countries }) {
  const searchParams = useSearchParams();
  const preselect = searchParams.get('ulke');

  const [step, setStep] = useState(1);
  const [countryId, setCountryId] = useState(() => {
    const found = countries.find((c) => c.slug === preselect);
    return found ? found.id : '';
  });
  const [selected, setSelected] = useState({}); // { serviceId: true }
  const [form, setForm] = useState({ name: '', email: '', phone: '', timeline: 'Hemen', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const country = countries.find((c) => c.id === countryId);

  const grouped = useMemo(() => {
    if (!country) return {};
    return country.services.reduce((acc, s) => {
      acc[s.groupName] = acc[s.groupName] || [];
      acc[s.groupName].push(s);
      return acc;
    }, {});
  }, [country]);

  const selectedServices = useMemo(() => {
    if (!country) return [];
    return country.services.filter((s) => selected[s.id] || s.required);
  }, [country, selected]);

  const totals = useMemo(() => {
    if (!country) return { total: 0, secondYear: 0, discount: 0 };
    let total = country.basePrice + country.govFee;
    let secondYear = 0;
    for (const s of selectedServices) {
      total += s.price;
      if (s.yearly) secondYear += s.renewPrice || s.price;
    }
    let discount = 0;
    if (selectedServices.length >= 3) {
      discount = Math.round(total * 0.1 * 100) / 100;
      total -= discount;
    }
    return { total: Math.round(total * 100) / 100, secondYear: Math.round(secondYear * 100) / 100, discount };
  }, [country, selectedServices]);

  function toggleService(id) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  async function submitQuote(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryId,
          selectedServiceIds: selectedServices.map((s) => s.id),
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          activityNote: form.note,
          timeline: form.timeline,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu.');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="card" style={{ maxWidth: 560 }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Teklifiniz hazır 🎉</div>
        <p style={{ color: 'var(--ink-muted)' }}>
          Toplam: <b>{result.currencySym}{result.totalPrice.toLocaleString('tr-TR')}</b>
          {result.secondYearPrice > 0 && <> · İkinci yıl: {result.currencySym}{result.secondYearPrice.toLocaleString('tr-TR')}</>}
        </p>
        <a className="btn btn-primary" href={result.pdfUrl} target="_blank" rel="noreferrer">PDF teklifi görüntüle / indir</a>
        <p style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginTop: 14 }}>
          Ekibimiz kısa süre içinde WhatsApp veya e-posta üzerinden sizinle iletişime geçecek.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Adım göstergesi */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, fontSize: 12.5, fontWeight: 700, color: 'var(--ink-faint)' }}>
        <span style={{ color: step === 1 ? 'var(--brand)' : undefined }}>1. Ülke</span> →
        <span style={{ color: step === 2 ? 'var(--brand)' : undefined }}>2. Hizmetler</span> →
        <span style={{ color: step === 3 ? 'var(--brand)' : undefined }}>3. Bilgileriniz</span>
      </div>

      {step === 1 && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>Hangi ülkede şirket kuracaksınız?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {countries.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => { setCountryId(c.id); setSelected({}); setStep(2); }}
                className="card"
                style={{ textAlign: 'left', cursor: 'pointer', border: countryId === c.id ? '2px solid var(--brand)' : undefined }}
              >
                <div style={{ fontSize: 24 }}>{c.flag}</div>
                <div style={{ fontWeight: 700 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{c.entity} · {c.currencySym}{c.basePrice.toLocaleString('tr-TR')}&apos;den</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && country && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>İhtiyacınız olan hizmetleri ekleyin</h2>
          <p style={{ fontSize: 13, color: 'var(--ink-faint)', marginBottom: 16 }}>{country.flag} {country.name} seçildi · 3 ve üzeri hizmette otomatik %10 indirim uygulanır.</p>

          {Object.entries(grouped).map(([groupName, services]) => (
            <div key={groupName} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{groupName}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {services.map((s) => (
                  <label key={s.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: s.required ? 'default' : 'pointer' }}>
                    <input type="checkbox" checked={!!selected[s.id] || s.required} disabled={s.required} onChange={() => toggleService(s.id)} style={{ width: 'auto' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{s.name} {s.required && <span className="badge">zorunlu</span>}</div>
                      {s.description && <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{s.description}</div>}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap' }}>
                      {country.currencySym}{s.price.toLocaleString('tr-TR')}{s.yearly ? '/yıl' : ''}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="card" style={{ position: 'sticky', bottom: 16, marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
              <span>Toplam</span><b>{country.currencySym}{totals.total.toLocaleString('tr-TR')}</b>
            </div>
            {totals.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--green)' }}>
                <span>Uygulanan indirim</span><span>-{country.currencySym}{totals.discount.toLocaleString('tr-TR')}</span>
              </div>
            )}
            {totals.secondYear > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--ink-faint)' }}>
                <span>İkinci yıl tahmini</span><span>{country.currencySym}{totals.secondYear.toLocaleString('tr-TR')}</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>← Ülkeyi değiştir</button>
              <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>Devam et →</button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && country && (
        <form onSubmit={submitQuote} className="card" style={{ maxWidth: 480 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>Başvurunuzu tamamlayın</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label>Ad Soyad *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
              <label>Ne zaman kurmayı planlıyorsunuz?</label>
              <select value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })}>
                <option>Hemen</option>
                <option>1 ay içinde</option>
                <option>3 ay içinde</option>
                <option>Henüz araştırıyorum</option>
              </select>
            </div>
            <div>
              <label>Faaliyet alanınız (opsiyonel)</label>
              <textarea rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </div>
          </div>
          {error && <p style={{ color: '#B3261E', fontSize: 13, marginTop: 10 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>← Geri</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Gönderiliyor…' : 'Teklifimi oluştur'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
