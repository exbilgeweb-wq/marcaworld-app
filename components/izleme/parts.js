// Sunum bileşenleri — hook içermez, hem sunucu hem istemci bileşenlerinde kullanılır.
import { fmtDate, daysLeft, urgency, daysLeftText, fmtNum } from './format.js';

const LEVEL_LABEL = { yuksek: 'Yüksek', orta: 'Orta', dusuk: 'Düşük' };
const LEVEL_COLOR = { yuksek: 'var(--iz-high)', orta: 'var(--iz-mid)', dusuk: 'var(--iz-low)' };

/** Sayfa başlığı: kırıntı, başlık, açıklama, sağda eylemler */
export function PageHeader({ title, description, crumbs, actions }) {
  return (
    <div className="iz-head">
      <div style={{ minWidth: 0 }}>
        {crumbs && crumbs.length > 0 && (
          <nav className="iz-crumbs" aria-label="Konum">
            {crumbs.map((c, i) => (
              <span key={i}>
                {c.href ? <a href={c.href}>{c.label}</a> : c.label}
                {i < crumbs.length - 1 ? ' /' : ''}
              </span>
            ))}
          </nav>
        )}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="iz-actions">{actions}</div>}
    </div>
  );
}

/** Sayı kutusu. tone: 'high' | 'mid' | 'low' */
export function Stat({ label, value, sub, tone, href }) {
  const v = typeof value === 'number' ? fmtNum(value) : value;
  return (
    <div className={`iz-stat${tone ? ` tone-${tone}` : ''}`}>
      <span className="k">{label}</span>
      {href ? <a className="v" href={href}>{v}</a> : <span className="v">{v}</span>}
      {sub && <span className="s">{sub}</span>}
    </div>
  );
}

export function Stats({ children }) {
  return <section className="iz-stats" aria-label="Özet">{children}</section>;
}

/** Risk rozeti + çubuk. level: yuksek | orta | dusuk */
export function LevelPill({ level, score, bar = false }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column' }}>
      <span className={`iz-pill ${level}`}>{LEVEL_LABEL[level] || level}{score !== undefined && score !== null ? ` · ${score}` : ''}</span>
      {bar && score !== undefined && (
        <span className="iz-scorebar" aria-hidden="true"><i style={{ width: `${Math.max(0, Math.min(100, score))}%`, background: LEVEL_COLOR[level] || 'var(--iz-brand)' }} /></span>
      )}
    </span>
  );
}

/** Durum rozeti. list: [{value,label,tone?}] (lib/izleme/constants.js) */
export function StatusBadge({ value, list, tone }) {
  const item = list ? list.find((x) => x.value === value) : null;
  const t = tone || item?.tone || 'muted';
  return <span className={`iz-badge tone-${t}`}>{item?.label || value || '—'}</span>;
}

/** Nice sınıf rozetleri; highlight içindekiler kırmızı */
export function ClassChips({ classes, highlight = [] }) {
  if (!classes || !classes.length) return <span className="iz-muted">—</span>;
  return (
    <span className="iz-classes">
      {classes.map((c) => (
        <span key={c} className={highlight.includes(c) ? 'shared' : ''} title={`Sınıf ${c}`}>{String(c).padStart(2, '0')}</span>
      ))}
    </span>
  );
}

/** Gerekçe etiketleri */
export function Reasons({ reasons }) {
  const list = Array.isArray(reasons) ? reasons : [];
  if (!list.length) return null;
  return <span className="iz-reasons">{list.map((r, i) => <span key={i}>{r}</span>)}</span>;
}

/** Son gün hücresi: tarih + kalan gün, aciliyete göre renk */
export function DeadlineCell({ date, done = false }) {
  if (!date) return <span className="iz-muted">—</span>;
  const d = daysLeft(date);
  const u = done ? 'normal' : urgency(d);
  return (
    <span className={`iz-deadline ${u}`}>
      <b>{fmtDate(date)}</b>
      {!done && <span>{daysLeftText(d)}</span>}
    </span>
  );
}

export function EmptyState({ title, children, action }) {
  return (
    <div className="iz-empty">
      <b>{title}</b>
      {children && <span>{children}</span>}
      {action}
    </div>
  );
}

export function Card({ title, sub, actions, children, flush = false, id }) {
  return (
    <section className={`iz-card${flush ? ' flush' : ''}`} id={id}>
      {(title || actions) && (
        <h2>
          <span>{title}{sub && <> <small>{sub}</small></>}</span>
          {actions && <span className="iz-actions">{actions}</span>}
        </h2>
      )}
      {children}
    </section>
  );
}

export function Field({ label, htmlFor, hint, error, children }) {
  return (
    <div className="iz-field">
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
      {hint && !error && <span className="hint">{hint}</span>}
      {error && <span className="err" role="alert">{error}</span>}
    </div>
  );
}

export function Toolbar({ children }) {
  return <div className="iz-toolbar">{children}</div>;
}

/** Tanım listesi: items = [[etiket, değer], ...] */
export function DefList({ items }) {
  return (
    <dl className="iz-dl">
      {items.filter(Boolean).map(([k, v], i) => (
        <div key={i} style={{ display: 'contents' }}>
          <dt>{k}</dt>
          <dd>{v === null || v === undefined || v === '' ? <span className="iz-muted">—</span> : v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Alert({ tone = 'info', children }) {
  return <div className={`iz-alert ${tone}`} role={tone === 'error' ? 'alert' : 'status'}>{children}</div>;
}

export function Progress({ value }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return <div className="iz-progress" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${v}%` }} /></div>;
}
