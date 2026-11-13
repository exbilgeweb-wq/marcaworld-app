'use client';
// Etkileşimli ortak bileşenler (istemci). Sunum bileşenleri için parts.js,
// biçimlendirme için format.js kullanın.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

/**
 * API çağrısı: JSON gönderir/alır, hata durumunda sunucunun Türkçe mesajıyla Error fırlatır.
 * body FormData ise Content-Type ayarlanmaz.
 */
export async function api(url, { method = 'GET', body, headers } = {}) {
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  const res = await fetch(url, {
    method,
    headers: isForm || body === undefined ? headers : { 'Content-Type': 'application/json', ...headers },
    body: isForm ? body : body === undefined ? undefined : JSON.stringify(body),
  });
  const type = res.headers.get('content-type') || '';
  const data = type.includes('application/json') ? await res.json().catch(() => null) : null;
  if (res.status === 401) {
    throw new Error('Oturumunuz sona ermiş. Sayfayı yenileyip yeniden giriş yapın.');
  }
  if (!res.ok) throw new Error(data?.error || `İşlem başarısız oldu (HTTP ${res.status}).`);
  return data;
}

/** Dosya indirme (PDF/CSV) — fetch + blob, sunucu hatasını gösterir */
export async function download(url, { method = 'GET', body, fileName } = {}) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || `Dosya hazırlanamadı (HTTP ${res.status}).`);
  }
  const blob = await res.blob();
  const cd = res.headers.get('content-disposition') || '';
  const m = cd.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
  const name = fileName || (m ? decodeURIComponent(m[1] || m[2]) : 'dosya');
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 2000);
}

// ---------- Toast ----------
const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((message, tone = 'ok') => {
    const id = Math.random().toString(36).slice(2);
    setItems((x) => [...x, { id, message, tone }]);
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), tone === 'error' ? 6000 : 3200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="iz-toasts" aria-live="polite">
        {items.map((t) => <div key={t.id} className={`iz-toast${t.tone === 'error' ? ' error' : ''}`}>{t.message}</div>)}
      </div>
    </ToastCtx.Provider>
  );
}

/** const toast = useToast(); toast('Kaydedildi'); toast('Hata', 'error') */
export function useToast() {
  const ctx = useContext(ToastCtx);
  return ctx || ((m) => { if (typeof window !== 'undefined') console.log(m); });
}

/**
 * Bir işlemi çalıştırır: yükleniyor durumu, hata toast'u, başarıda toast + router.refresh().
 * const [run, busy] = useAction();  run(async () => {...}, 'Kaydedildi')
 */
export function useAction() {
  const toast = useToast();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const run = useCallback(async (fn, successMessage, { refresh = true } = {}) => {
    setBusy(true);
    try {
      const out = await fn();
      if (successMessage) toast(successMessage);
      if (refresh) router.refresh();
      return out;
    } catch (e) {
      toast(e.message || 'Beklenmeyen bir hata oluştu.', 'error');
      return undefined;
    } finally {
      setBusy(false);
    }
  }, [toast, router]);
  return [run, busy];
}

// ---------- Modal ----------
export function Modal({ open, title, onClose, children, footer, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    const first = ref.current?.querySelector('input, select, textarea, button');
    first?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="iz-modal-back" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className={`iz-modal${wide ? ' wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} ref={ref}>
        <header>
          <h2>{title}</h2>
          <button type="button" className="iz-btn ghost" onClick={onClose} aria-label="Kapat">Kapat</button>
        </header>
        <div className="body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </div>
    </div>
  );
}

/** İki adımlı onay düğmesi (window.confirm kullanılmaz). */
export function ConfirmButton({ onConfirm, children, confirmText = 'Emin misiniz? Tekrar tıklayın', className = 'iz-btn danger sm', disabled }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return undefined;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <button
      type="button"
      className={`${className}${armed ? ' armed' : ''}`}
      disabled={disabled}
      onClick={() => { if (armed) { setArmed(false); onConfirm(); } else setArmed(true); }}
    >
      {armed ? confirmText : children}
    </button>
  );
}

/** URL sorgu parametrelerini güncelleyen yardımcı (filtreler için) */
export function useQueryUpdater() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return useCallback((changes, { resetPage = true } = {}) => {
    const sp = new URLSearchParams(params?.toString() || '');
    for (const [k, v] of Object.entries(changes)) {
      if (v === undefined || v === null || v === '') sp.delete(k);
      else sp.set(k, String(v));
    }
    if (resetPage && !('page' in changes)) sp.delete('page');
    const s = sp.toString();
    router.push(s ? `${pathname}?${s}` : pathname);
  }, [router, pathname, params]);
}

/** Sayfalama: total, page, pageSize; URL'deki ?page= parametresini değiştirir */
export function Pagination({ total, page, pageSize }) {
  const update = useQueryUpdater();
  const pages = Math.max(1, Math.ceil((total || 0) / (pageSize || 50)));
  if (pages <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <div className="iz-pager">
      <span>{from.toLocaleString('tr-TR')}–{to.toLocaleString('tr-TR')} / {total.toLocaleString('tr-TR')} kayıt</span>
      <span className="iz-actions">
        <button type="button" className="iz-btn sm" disabled={page <= 1} onClick={() => update({ page: page - 1 }, { resetPage: false })}>Önceki</button>
        <span className="iz-mono">{page} / {pages}</span>
        <button type="button" className="iz-btn sm" disabled={page >= pages} onClick={() => update({ page: page + 1 }, { resetPage: false })}>Sonraki</button>
      </span>
    </div>
  );
}

/** Arama kutusu: yazmayı bırakınca (400 ms) ?q= günceller */
export function SearchBox({ placeholder = 'Ara…', param = 'q', initial = '' }) {
  const update = useQueryUpdater();
  const [v, setV] = useState(initial);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return undefined; }
    const t = setTimeout(() => update({ [param]: v.trim() }), 400);
    return () => clearTimeout(t);
  }, [v]); // eslint-disable-line react-hooks/exhaustive-deps
  return <input type="search" value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder} aria-label={placeholder} />;
}

/** Sorgu parametresine bağlı açılır liste filtresi */
export function FilterSelect({ param, value, options, allLabel = 'Tümü', label }) {
  const update = useQueryUpdater();
  return (
    <select value={value || ''} onChange={(e) => update({ [param]: e.target.value })} aria-label={label || allLabel}>
      <option value="">{allLabel}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
