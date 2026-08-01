'use client';
import { useState } from 'react';

const empty = { slug: '', title: '', excerpt: '', contentHtml: '', category: '', published: false };

function slugify(text) {
  const map = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', Ç: 'c', Ğ: 'g', İ: 'i', Ö: 'o', Ş: 's', Ü: 'u' };
  return text
    .split('').map((ch) => map[ch] || ch).join('')
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function ArticlesManager({ initialArticles }) {
  const [articles, setArticles] = useState(initialArticles);
  const [editing, setEditing] = useState(null); // article id or 'new'
  const [form, setForm] = useState(empty);

  function startEdit(a) {
    setEditing(a.id);
    setForm(a);
  }

  function startNew() {
    setEditing('new');
    setForm(empty);
  }

  async function save(e) {
    e.preventDefault();
    if (editing === 'new') {
      const res = await fetch('/api/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      setArticles((as) => [data, ...as]);
    } else {
      const res = await fetch(`/api/articles/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      setArticles((as) => as.map((a) => (a.id === editing ? data : a)));
    }
    setEditing(null);
    setForm(empty);
  }

  async function remove(id) {
    if (!confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    setArticles((as) => as.filter((a) => a.id !== id));
  }

  if (editing) {
    return (
      <form onSubmit={save} className="card" style={{ maxWidth: 640 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label>Başlık</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} />
          </div>
          <div>
            <label>Slug (URL)</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <label>Kategori</label>
            <input value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div>
            <label>Özet</label>
            <textarea rows={2} value={form.excerpt || ''} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </div>
          <div>
            <label>İçerik (HTML)</label>
            <textarea rows={10} value={form.contentHtml || ''} onChange={(e) => setForm({ ...form, contentHtml: e.target.value })} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={!!form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Yayınla
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button type="submit" className="btn btn-primary">Kaydet</button>
          <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Vazgeç</button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <button type="button" className="btn btn-primary" style={{ marginBottom: 16 }} onClick={startNew}>+ Yeni yazı</button>
      <table>
        <thead><tr><th>Başlık</th><th>Kategori</th><th>Durum</th><th></th></tr></thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.category}</td>
              <td>{a.published ? 'Yayında' : 'Taslak'}</td>
              <td style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => startEdit(a)} style={{ background: 'none', border: 'none', color: 'var(--brand)', cursor: 'pointer' }}>Düzenle</button>
                <button type="button" onClick={() => remove(a.id)} style={{ background: 'none', border: 'none', color: '#B3261E', cursor: 'pointer' }}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
