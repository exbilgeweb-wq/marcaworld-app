// Marka izleme platformu — durum değerleri ve arayüz etiketleri (saf modül).
// Durum slug'ları veritabanında saklanır; etiket/ton yalnızca arayüz içindir.
// tone: brand | high | mid | low | info | muted  (components/izleme/parts.js StatusBadge)

export const LEVELS = [
  { value: 'yuksek', label: 'Yüksek', tone: 'high', min: 80 },
  { value: 'orta', label: 'Orta', tone: 'mid', min: 65 },
  { value: 'dusuk', label: 'Düşük', tone: 'low', min: 0 },
];

export const MATCH_STATUSES = [
  { value: 'yeni', label: 'Yeni', tone: 'brand', help: 'Henüz incelenmedi' },
  { value: 'inceleniyor', label: 'İnceleniyor', tone: 'info', help: 'Uzman üzerinde çalışıyor' },
  { value: 'ilgisiz', label: 'İlgisiz', tone: 'muted', help: 'Karıştırılma ihtimali yok, kapatıldı' },
  { value: 'musteriye-bildirildi', label: 'Müşteriye bildirildi', tone: 'mid', help: 'Müşterinin kararı bekleniyor' },
  { value: 'itiraz-edilecek', label: 'İtiraz edilecek', tone: 'high', help: 'İtiraz kararı verildi, dosya hazırlanacak' },
  { value: 'itiraz-edilmeyecek', label: 'İtiraz edilmeyecek', tone: 'muted', help: 'Müşteri ya da uzman itiraz etmeme kararı verdi' },
  { value: 'itiraz-edildi', label: 'İtiraz edildi', tone: 'low', help: 'İtiraz TÜRKPATENT\'e sunuldu' },
];

/** İnceleme kuyruğunda "açık" sayılan durumlar */
export const OPEN_MATCH_STATUSES = ['yeni', 'inceleniyor', 'musteriye-bildirildi', 'itiraz-edilecek'];

export const CLIENT_DECISIONS = [
  { value: 'itiraz-istiyor', label: 'İtiraz etmek istiyor', tone: 'high' },
  { value: 'istemiyor', label: 'İtiraz istemiyor', tone: 'muted' },
];

export const BULLETIN_STATUSES = [
  { value: 'bekliyor', label: 'Sırada', tone: 'muted' },
  { value: 'indiriliyor', label: 'İndiriliyor', tone: 'info' },
  { value: 'ayristiriliyor', label: 'Okunuyor', tone: 'info' },
  { value: 'taraniyor', label: 'Taranıyor', tone: 'info' },
  { value: 'tamamlandi', label: 'Tamamlandı', tone: 'low' },
  { value: 'hata', label: 'Hata', tone: 'high' },
];

export const OPPOSITION_STATUSES = [
  { value: 'hazirlaniyor', label: 'Hazırlanıyor', tone: 'brand' },
  { value: 'dosyalandi', label: 'TÜRKPATENT\'e sunuldu', tone: 'info' },
  { value: 'karsi-gorus', label: 'Karşı görüş aşaması', tone: 'info' },
  { value: 'karar-bekleniyor', label: 'Karar bekleniyor', tone: 'mid' },
  { value: 'kabul', label: 'Kabul edildi', tone: 'low' },
  { value: 'kismen-kabul', label: 'Kısmen kabul', tone: 'low' },
  { value: 'ret', label: 'Reddedildi', tone: 'high' },
  { value: 'yidk-itiraz', label: 'YİDK\'ya itiraz', tone: 'mid' },
  { value: 'dava', label: 'Dava aşaması', tone: 'mid' },
  { value: 'geri-cekildi', label: 'Geri çekildi', tone: 'muted' },
];

export const OPEN_OPPOSITION_STATUSES = ['hazirlaniyor', 'dosyalandi', 'karsi-gorus', 'karar-bekleniyor', 'yidk-itiraz', 'dava'];

/** SMK (6769) itiraz gerekçeleri — itiraz dosyasında çoklu seçim */
export const OPPOSITION_GROUNDS = [
  { value: '6/1', label: 'SMK 6/1 – Aynı/benzer marka, aynı/benzer mal-hizmet, karıştırılma ihtimali' },
  { value: '6/2', label: 'SMK 6/2 – Ticari vekil/temsilcinin izinsiz başvurusu' },
  { value: '6/3', label: 'SMK 6/3 – Tescilsiz ama kullanılan önceki marka' },
  { value: '6/4', label: 'SMK 6/4 – Önceki tarihli tanınmış marka (Paris 6bis)' },
  { value: '6/5', label: 'SMK 6/5 – Önceki markanın itibarından haksız yarar / zarar' },
  { value: '6/6', label: 'SMK 6/6 – Ad, ticaret unvanı, fotoğraf, telif, sınai mülkiyet hakkı' },
  { value: '6/7', label: 'SMK 6/7 – Ortak/garanti markası (süresi dolduktan sonra 3 yıl)' },
  { value: '6/8', label: 'SMK 6/8 – Kolektif marka (süresi dolduktan sonra 3 yıl)' },
  { value: '6/9', label: 'SMK 6/9 – Kötü niyetli başvuru' },
  { value: '5/1-b', label: 'SMK 5/1-b – Ayırt edicilikten yoksun (mutlak ret)' },
  { value: '5/1-c', label: 'SMK 5/1-c – Tanımlayıcı ibare (mutlak ret)' },
  { value: '5/1-f', label: 'SMK 5/1-f – Halkı yanıltıcı (mutlak ret)' },
];

export const DEADLINE_KINDS = [
  { value: 'itiraz', label: 'Yayına itiraz', tone: 'high', help: 'Bülten yayınından itibaren 2 ay (SMK m.18)' },
  { value: 'karsi-gorus', label: 'İtiraza karşı görüş', tone: 'mid', help: 'Tebliğden itibaren 1 ay' },
  { value: 'yidk-itiraz', label: 'YİDK\'ya itiraz', tone: 'mid', help: 'Karar tebliğinden itibaren 2 ay (SMK m.20)' },
  { value: 'dava', label: 'Dava açma', tone: 'mid', help: 'YİDK kararı tebliğinden itibaren 2 ay (SMK m.20/3)' },
  { value: 'yenileme', label: 'Yenileme', tone: 'info', help: 'Koruma bitişinden önceki 6 ay içinde (SMK m.23)' },
  { value: 'yenileme-ek-sure', label: 'Yenileme ek süresi', tone: 'high', help: 'Koruma bitişinden sonraki 6 ay, ek ücretle' },
  { value: 'kullanim-ispati', label: 'Kullanım ispatı', tone: 'mid', help: 'Talep tebliğinden itibaren verilen süre' },
  { value: 'izleme-bitis', label: 'İzleme sözleşmesi bitişi', tone: 'muted', help: 'Müvekkille yapılan izleme sözleşmesi' },
  { value: 'diger', label: 'Diğer', tone: 'muted', help: '' },
];

export const DEADLINE_STATUSES = [
  { value: 'acik', label: 'Açık', tone: 'brand' },
  { value: 'tamamlandi', label: 'Tamamlandı', tone: 'low' },
  { value: 'iptal', label: 'İptal', tone: 'muted' },
];

export const MARK_STATUSES = [
  { value: 'basvuru', label: 'Başvuru', tone: 'info' },
  { value: 'yayinda', label: 'Bültende yayında', tone: 'info' },
  { value: 'tescilli', label: 'Tescilli', tone: 'low' },
  { value: 'itirazli', label: 'İtirazlı', tone: 'mid' },
  { value: 'reddedildi', label: 'Reddedildi', tone: 'high' },
  { value: 'sona-erdi', label: 'Sona erdi', tone: 'muted' },
];

export const WATCH_TYPES = [
  { value: 'kelime', label: 'Kelime (ibare)', help: 'Yazım, okunuş ve anlam benzerliği' },
  { value: 'kelime-sekil', label: 'Kelime + şekil', help: 'İbareye ek olarak Viyana kodu ile şekil benzerliği' },
  { value: 'sekil', label: 'Yalnız şekil', help: 'Sadece Viyana kodu ve sınıf örtüşmesi' },
];

export const CLIENT_TYPES = [
  { value: 'kurumsal', label: 'Kurumsal' },
  { value: 'bireysel', label: 'Bireysel' },
];

export const CLIENT_SOURCES = [
  { value: 'manuel', label: 'Elle eklendi' },
  { value: 'site-formu', label: 'Site formu' },
  { value: 'ice-aktarim', label: 'İçe aktarım' },
];

export const NOTIFICATION_STATUSES = [
  { value: 'bekliyor', label: 'Bekliyor', tone: 'muted' },
  { value: 'gonderildi', label: 'Gönderildi', tone: 'low' },
  { value: 'hata', label: 'Hata', tone: 'high' },
  { value: 'atlandi', label: 'Gönderilmedi (ayar yok)', tone: 'mid' },
];

export const JOB_KINDS = [
  { value: 'bulten-kontrol', label: 'Yeni bülten kontrolü' },
  { value: 'bulten-indir', label: 'Bülten indirme' },
  { value: 'bulten-ayristir', label: 'Bülten okuma' },
  { value: 'bulten-tara', label: 'Portföy taraması' },
  { value: 'hatirlatma', label: 'Süre hatırlatmaları' },
  { value: 'gunluk-ozet', label: 'Günlük özet e-postası' },
];

export const JOB_STATUSES = [
  { value: 'bekliyor', label: 'Bekliyor', tone: 'muted' },
  { value: 'calisiyor', label: 'Çalışıyor', tone: 'info' },
  { value: 'tamamlandi', label: 'Tamamlandı', tone: 'low' },
  { value: 'hata', label: 'Hata', tone: 'high' },
];

/** Listeden etiketi bulur; yoksa değerin kendisini döner */
export function labelOf(list, value) {
  const item = list.find((x) => x.value === value);
  return item ? item.label : value ?? '';
}

/** Puan → seviye. thresholds: { yuksek: 80, orta: 65 } (ayarlardan) */
export function levelOf(score, thresholds = { yuksek: 80, orta: 65 }) {
  if (score >= (thresholds.yuksek ?? 80)) return 'yuksek';
  if (score >= (thresholds.orta ?? 65)) return 'orta';
  return 'dusuk';
}
