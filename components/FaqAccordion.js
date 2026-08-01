'use client';
import { useState } from 'react';

export default function FaqAccordion({ items }) {
  const [openId, setOpenId] = useState(null);

  if (!items || items.length === 0) {
    return <p style={{ color: 'var(--ink-faint)' }}>Henüz soru eklenmedi.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((f) => {
        const open = openId === f.id;
        return (
          <div key={f.id} className="card" style={{ padding: '16px 20px' }}>
            <button
              type="button"
              onClick={() => setOpenId(open ? null : f.id)}
              style={{ appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', fontSize: 14.5, fontWeight: 700, padding: 0 }}
            >
              <span>{f.question}</span>
              <span style={{ color: 'var(--brand)', fontSize: 18 }}>{open ? '−' : '+'}</span>
            </button>
            {open && <p style={{ marginTop: 10, marginBottom: 0, color: 'var(--ink-muted)', lineHeight: 1.6, fontSize: 13.5 }}>{f.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
