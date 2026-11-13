// Platform yetkileri (saf modül). Personel rolü AdminUser.izlemeRole'dan gelir;
// AdminUser.role === 'admin' olan hesaplar her zaman "yonetici" sayılır.

export const STAFF_ROLES = [
  { value: 'yonetici', label: 'Yönetici', help: 'Her şey: ayarlar, ekip, silme/arşiv, çıkar çatışması kilidi' },
  { value: 'uzman', label: 'Uzman', help: 'İnceleme, müşteriye bildirim, itiraz kararı ve dosyası, raporlar' },
  { value: 'asistan', label: 'Asistan', help: 'İnceleme, not, atama; müşteriye gönderemez, itiraz kararı veremez' },
  { value: 'izleyici', label: 'İzleyici', help: 'Yalnız görüntüler' },
];

// eylem → izinli roller
const RULES = {
  'goruntule': ['yonetici', 'uzman', 'asistan', 'izleyici'],
  'eslesme.incele': ['yonetici', 'uzman', 'asistan'],        // durum (yeni/inceleniyor/ilgisiz), not, atama
  'eslesme.ilgisiz-onayla': ['yonetici', 'uzman'],          // yüksek seviyeli "ilgisiz" ikinci onayı
  'musteriye.gonder': ['yonetici', 'uzman'],                 // e-posta/elle bildirim, müşteri kararı kaydı
  'itiraz.karar': ['yonetici', 'uzman'],                     // itiraz edilecek / edilmeyecek
  'itiraz.dosya': ['yonetici', 'uzman'],                     // itiraz dosyası aç/düzenle, olay ekle
  'kayit.duzenle': ['yonetici', 'uzman', 'asistan'],         // müvekkil, marka, süre, bülten kaydı düzeltme
  'bulten.ice-aktar': ['yonetici', 'uzman'],
  'disa.aktar': ['yonetici', 'uzman'],                       // CSV/PDF dışa aktarım
  'arsivle': ['yonetici'],                                   // müvekkil/marka/itiraz arşivleme, bülten silme
  'ayar.degistir': ['yonetici'],
  'ekip.yonet': ['yonetici'],
  'cakisma.kilit-ac': ['yonetici'],
  'kvkk.anonimlestir': ['yonetici'],
};

/** staff: { role, izlemeRole } → etkin platform rolü */
export function effectiveRole(staff) {
  if (!staff) return null;
  if (staff.role === 'admin') return 'yonetici';
  return staff.izlemeRole || 'uzman';
}

/** can(staff, 'musteriye.gonder') → boolean */
export function can(staff, action) {
  const role = effectiveRole(staff);
  if (!role) return false;
  const allowed = RULES[action];
  if (!allowed) return false;
  return allowed.includes(role);
}

export const ACTIONS = Object.keys(RULES);
