// Biçimlendirme yardımcıları — sunucu ve istemci bileşenlerinde güvenle kullanılabilir
// (bu dosyada 'use client' YOK; hook içermez).

const DAY = 86400000;

/** Gün bazlı tarih (UTC 00:00 saklanır) → 'GG.AA.YYYY' */
export function fmtDate(d) {
  if (!d) return '—';
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return '—';
  return dt.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
}

/** Zaman damgası (gerçek an) → 'GG.AA.YYYY SS:DD' Türkiye saatiyle */
export function fmtDateTime(d) {
  if (!d) return '—';
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return '—';
  return dt.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
}

/** Göreli zaman: "3 dk önce", "dün", "5 gün önce" */
export function fmtAgo(d, now = new Date()) {
  if (!d) return '—';
  const dt = d instanceof Date ? d : new Date(d);
  const s = Math.round((now - dt) / 1000);
  if (s < 60) return 'az önce';
  if (s < 3600) return `${Math.floor(s / 60)} dk önce`;
  if (s < 86400) return `${Math.floor(s / 3600)} sa önce`;
  const days = Math.floor(s / 86400);
  if (days === 1) return 'dün';
  if (days < 30) return `${days} gün önce`;
  return fmtDate(dt);
}

export function fmtNum(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return '—';
  return Number(n).toLocaleString('tr-TR');
}

export function fmtMoney(n) {
  if (n === null || n === undefined || n === '') return '—';
  return Number(n).toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' TL';
}

/** Türkiye saatine göre bugünün UTC 00:00 karşılığı */
export function todayTRDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  return new Date(parts + 'T00:00:00Z');
}

/** Bugünden hedef güne kalan gün (negatif: geçti) */
export function daysLeft(d, now = new Date()) {
  if (!d) return null;
  const dt = d instanceof Date ? d : new Date(d);
  const day = Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate());
  return Math.round((day - todayTRDate(now).getTime()) / DAY);
}

/** 'gecti' | 'kritik' (≤7) | 'yakin' (≤30) | 'normal' */
export function urgency(days) {
  if (days === null || days === undefined) return 'normal';
  if (days < 0) return 'gecti';
  if (days <= 7) return 'kritik';
  if (days <= 30) return 'yakin';
  return 'normal';
}

export function daysLeftText(days) {
  if (days === null || days === undefined) return '';
  if (days < 0) return `${-days} gün geçti`;
  if (days === 0) return 'bugün son gün';
  if (days === 1) return 'yarın son gün';
  return `${days} gün kaldı`;
}

/** Basit sorgu dizesi oluşturucu: boş değerleri atar */
export function qs(params) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params || {})) {
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) continue;
    sp.set(k, Array.isArray(v) ? v.join(',') : String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

export function truncate(s, n = 80) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
