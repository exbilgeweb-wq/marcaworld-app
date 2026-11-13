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
  { value: 'ilgisiz-onay-bekliyor', label: 'İlgisiz (2. onay bekliyor)', tone: 'mid', help: 'Yüksek seviyeli eşleşme; ikinci bir uzmanın onayı gerekir' },
  { value: 'ilgisiz', label: 'İlgisiz', tone: 'muted', help: 'Karıştırılma ihtimali yok, kapatıldı' },
  { value: 'otomatik-elendi', label: 'Otomatik elendi', tone: 'muted', help: 'Müvekkilin kendi başvurusu ya da hariç tutulan ibare' },
  { value: 'musteriye-bildirildi', label: 'Müşteriye bildirildi', tone: 'mid', help: 'Müşterinin kararı bekleniyor' },
  { value: 'itiraz-edilecek', label: 'İtiraz edilecek', tone: 'high', help: 'İtiraz kararı verildi, dosya hazırlanacak' },
  { value: 'itiraz-edilmeyecek', label: 'İtiraz edilmeyecek', tone: 'muted', help: 'Müşteri ya da uzman itiraz etmeme kararı verdi' },
  { value: 'itiraz-edildi', label: 'İtiraz edildi', tone: 'low', help: 'İtiraz TÜRKPATENT\'e sunuldu' },
];

/** İnceleme kuyruğunda "açık" sayılan durumlar */
export const OPEN_MATCH_STATUSES = ['yeni', 'inceleniyor', 'ilgisiz-onay-bekliyor', 'musteriye-bildirildi', 'itiraz-edilecek'];

/** Varsayılan kuyrukta gizlenen durumlar (filtreyle görülebilir) */
export const HIDDEN_MATCH_STATUSES = ['otomatik-elendi'];

export const DISMISS_REASONS = [
  { value: 'farkli-mal-hizmet', label: 'Mal/hizmetler farklı' },
  { value: 'zayif-benzerlik', label: 'İbareler yeterince benzer değil' },
  { value: 'genel-kelime', label: 'Ortak unsur genel/tanımlayıcı kelime' },
  { value: 'musterinin-kendi-basvurusu', label: 'Müvekkilin kendi başvurusu' },
  { value: 'kidem-yok', label: 'Müvekkil markası hedeften sonra tarihli' },
  { value: 'daha-once-degerlendirildi', label: 'Daha önce değerlendirildi' },
  { value: 'diger', label: 'Diğer (not yazın)' },
];

export const AUTO_REASONS = [
  { value: 'kendi-basvurusu-kesin', label: 'Sahip, müvekkilin kayıtlı adıyla birebir aynı' },
  { value: 'haric-ibare', label: 'İbare bu marka için hariç tutuldu' },
];

export const SENIORITY = [
  { value: 'onceki', label: 'Müvekkil markası önce', tone: 'low' },
  { value: 'ayni-gun', label: 'Aynı gün', tone: 'mid' },
  { value: 'sonraki', label: 'Müvekkil markası sonra (6/1 dayanağı olamaz)', tone: 'high' },
  { value: 'bilinmiyor', label: 'Kıdem bilinmiyor (başvuru tarihi girilmemiş)', tone: 'muted' },
];

export const RECOMMENDATIONS = [
  { value: 'itiraz-onerilir', label: 'İtiraz önerilir', tone: 'high' },
  { value: 'degerlendirilmeli', label: 'Değerlendirilmeli', tone: 'mid' },
  { value: 'gerek-yok', label: 'İtiraza gerek yok', tone: 'low' },
];

export const CONFLICT_TYPES = [
  { value: 'vekil-biziz', label: 'Başvurunun vekili biziz' },
  { value: 'sahip-muvekkilimiz', label: 'Başvuru sahibi başka bir müvekkilimiz' },
];

export const NOTIFY_CHANNELS = [
  { value: 'eposta', label: 'E-posta (platformdan)' },
  { value: 'telefon', label: 'Telefon' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'eposta-harici', label: 'E-posta (kendi posta kutumdan)' },
  { value: 'yuz-yuze', label: 'Yüz yüze / toplantı' },
];

export const CLIENT_DECISIONS = [
  { value: 'itiraz-istiyor', label: 'İtiraz etmek istiyor', tone: 'high' },
  { value: 'istemiyor', label: 'İtiraz istemiyor', tone: 'muted' },
  { value: 'gorusmek-istiyor', label: 'Görüşmek istiyor', tone: 'mid' },
];

export const DECISION_SOURCES = [
  { value: 'portal', label: 'Müşteri portalı' },
  { value: 'telefon', label: 'Telefon' },
  { value: 'eposta', label: 'E-posta' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'toplanti', label: 'Toplantı' },
];

export const BULLETIN_STATUSES = [
  { value: 'bekliyor', label: 'Sırada', tone: 'muted' },
  { value: 'indiriliyor', label: 'İndiriliyor', tone: 'info' },
  { value: 'ayristiriliyor', label: 'Okunuyor', tone: 'info' },
  { value: 'taraniyor', label: 'Taranıyor', tone: 'info' },
  { value: 'tamamlandi', label: 'Tamamlandı', tone: 'low' },
  { value: 'kontrol-gerekli', label: 'Kontrol gerekli', tone: 'mid', help: 'Kayıt sayısı ya da okuma kalitesi beklenenin altında; müşteriye otomatik bildirim yapılmaz' },
  { value: 'hata', label: 'Hata', tone: 'high' },
];

export const DATE_SOURCES = [
  { value: 'liste', label: 'TÜRKPATENT bülten listesi' },
  { value: 'pdf-kapak', label: 'PDF kapağından okundu' },
  { value: 'elle', label: 'Elle girildi' },
  { value: 'tahmin', label: 'Tahmin (onay gerekir)' },
];

export const OPPOSITION_STATUSES = [
  { value: 'hazirlaniyor', label: 'Hazırlanıyor', tone: 'brand' },
  { value: 'dosyalandi', label: 'Sunuldu', tone: 'info' },
  { value: 'karar-bekleniyor', label: 'Karar bekleniyor', tone: 'mid' },
  { value: 'sonuclandi', label: 'Sonuçlandı', tone: 'low' },
  { value: 'geri-cekildi', label: 'Geri çekildi', tone: 'muted' },
];

export const OPPOSITION_STAGES = [
  { value: 'kurum', label: 'TÜRKPATENT (Markalar Dairesi)' },
  { value: 'yidk', label: 'YİDK (itiraz incelemesi)' },
  { value: 'ilk-derece', label: 'Fikri ve Sınai Haklar Hukuk Mahkemesi' },
  { value: 'istinaf', label: 'İstinaf (BAM)' },
  { value: 'temyiz', label: 'Temyiz (Yargıtay)' },
];

export const OPPOSITION_OUTCOMES = [
  { value: 'kabul', label: 'Kabul', tone: 'low' },
  { value: 'kismen-kabul', label: 'Kısmen kabul', tone: 'mid' },
  { value: 'ret', label: 'Ret', tone: 'high' },
];

export const OPPOSITION_DIRECTIONS = [
  { value: 'giden', label: 'Bizim itirazımız', help: 'Müvekkil adına üçüncü kişinin başvurusuna itiraz' },
  { value: 'gelen', label: 'Müvekkile gelen itiraz', help: 'Müvekkilin başvurusuna yapılan itiraza karşı savunma' },
];

export const OPPOSITION_EVENT_KINDS = [
  { value: 'dosyalandi', label: 'İtiraz sunuldu' },
  { value: 'itiraz-tebligi', label: 'İtiraz tebliğ edildi (karşı görüş süresi)' },
  { value: 'karsi-gorus-sunuldu', label: 'Karşı görüş sunuldu' },
  { value: 'kullanim-ispati-talebi', label: 'Kullanım ispatı talebi tebliğ edildi' },
  { value: 'kurum-karari-tebligi', label: 'Kurum kararı tebliğ edildi' },
  { value: 'yidk-basvurusu', label: 'YİDK\'ya itiraz edildi' },
  { value: 'karsi-taraf-yidk-itirazi-tebligi', label: 'Karşı tarafın YİDK itirazı tebliğ edildi' },
  { value: 'yidk-karari-tebligi', label: 'YİDK kararı tebliğ edildi' },
  { value: 'dava-acildi', label: 'Dava açıldı' },
  { value: 'mahkeme-karari-tebligi', label: 'İlk derece kararı tebliğ edildi' },
  { value: 'bam-karari-tebligi', label: 'Bölge adliye (istinaf) kararı tebliğ edildi' },
  { value: 'diger', label: 'Diğer' },
];

export const NOTICE_CHANNELS = [
  { value: 'e-tebligat', label: 'Elektronik tebligat (ulaşmayı izleyen 5. gün tebliğ sayılır)' },
  { value: 'epats', label: 'EPATS bildirimi' },
  { value: 'posta', label: 'Posta' },
  { value: 'elden', label: 'Elden' },
];

/** İtiraz dosyası kontrol listesi */
export const OPPOSITION_CHECKLIST = [
  { value: 'vekaletname', label: 'Vekaletname' },
  { value: 'dayanakBelgeleri', label: 'Dayanak marka/hak belgeleri' },
  { value: 'deliller', label: 'Deliller (kullanım / tanınmışlık)' },
  { value: 'dilekce', label: 'İtiraz dilekçesi' },
  { value: 'harcDekontu', label: 'Resmi ücret ödendi (dekont)' },
  { value: 'evrakNo', label: 'EPATS evrak numarası alındı' },
];

export const BASIS_TYPES = [
  { value: 'tescilli-marka', label: 'Tescilli marka' },
  { value: 'basvuru', label: 'Önceki tarihli başvuru' },
  { value: 'tescilsiz-kullanim', label: 'Tescilsiz kullanım' },
  { value: 'ticaret-unvani', label: 'Ticaret unvanı' },
  { value: 'taninmis-marka', label: 'Tanınmış marka' },
  { value: 'diger', label: 'Diğer hak' },
];

export const DOCUMENT_KINDS = [
  { value: 'vekaletname', label: 'Vekaletname' },
  { value: 'itiraz-dilekcesi', label: 'İtiraz dilekçesi' },
  { value: 'delil', label: 'Delil' },
  { value: 'teblig', label: 'Tebliğ yazısı' },
  { value: 'karar', label: 'Karar' },
  { value: 'dekont', label: 'Ödeme dekontu' },
  { value: 'diger', label: 'Diğer' },
];

export const POA_STATUSES = [
  { value: 'yok', label: 'Vekaletname yok', tone: 'high' },
  { value: 'var', label: 'Vekaletname var', tone: 'low' },
  { value: 'suresi-doldu', label: 'Vekaletname süresi doldu', tone: 'mid' },
];

export const REPUTATION_LEVELS = [
  { value: 'yok', label: 'Tanınmışlık iddiası yok' },
  { value: 'iddia', label: 'Tanınmışlık iddia ediliyor' },
  { value: 'turkpatent-listesi', label: 'TÜRKPATENT tanınmış markalar listesinde' },
  { value: 'mahkeme-karari', label: 'Mahkeme kararıyla tanınmış' },
];

export const USE_EVIDENCE = [
  { value: 'yok', label: 'Kullanım delili yok', tone: 'high' },
  { value: 'kismi', label: 'Kısmi delil', tone: 'mid' },
  { value: 'hazir', label: 'Deliller hazır', tone: 'low' },
];

export const OPEN_OPPOSITION_STATUSES = ['hazirlaniyor', 'dosyalandi', 'karsi-gorus', 'karar-bekleniyor', 'yidk-itiraz', 'dava'];

/**
 * SMK (6769) itiraz gerekçeleri — itiraz dosyasında çoklu seçim.
 * NOT: Etiketler kısaltmadır; dilekçede mevzuat.gov.tr'deki güncel metin esas alınır.
 * requiresBasisMark: önceki marka/başvuru dayanağı gerekir; useProofApplicable: SMK 19/2 kullanım ispatı istenebilir.
 */
export const OPPOSITION_GROUNDS = [
  { value: '6/1', label: 'SMK 6/1 – Aynı/benzer marka, aynı/benzer mal-hizmet; karıştırılma (ilişkilendirilme) ihtimali', requiresBasisMark: true, useProofApplicable: true, evidenceHint: 'Dayanak marka tescil/başvuru bilgileri' },
  { value: '6/2', label: 'SMK 6/2 – Ticari vekil/temsilcinin izinsiz kendi adına başvurusu', requiresBasisMark: true, useProofApplicable: false, evidenceHint: 'Temsil/distribütörlük sözleşmesi, yazışmalar' },
  { value: '6/3', label: 'SMK 6/3 – Tescilsiz marka ya da ticaret alanında kullanılan işaret (önceki hak)', requiresBasisMark: false, useProofApplicable: false, evidenceHint: 'Başvuru tarihinden önceki kullanım delilleri' },
  { value: '6/4', label: 'SMK 6/4 – Paris Sözleşmesi 6mükerrer anlamında tanınmış marka', requiresBasisMark: false, useProofApplicable: false, evidenceHint: 'Tanınmışlık delilleri' },
  { value: '6/5', label: 'SMK 6/5 – Tanınmış önceki markanın itibarından haksız yarar / itibara ya da ayırt ediciliğe zarar (farklı mal-hizmette de)', requiresBasisMark: true, useProofApplicable: true, evidenceHint: 'Tanınmışlık ve itibar delilleri' },
  { value: '6/6', label: 'SMK 6/6 – Başkasının adı, ticaret unvanı, fotoğrafı, telif ya da sınai mülkiyet hakkı', requiresBasisMark: false, useProofApplicable: false, evidenceHint: 'Hak sahipliği belgeleri (ticaret sicili, eser belgeleri)' },
  { value: '6/7', label: 'SMK 6/7 – Ortak/garanti markası ile aynı/benzer (koruma süresi bitiminden sonraki 3 yıl) — metni doğrulayın', requiresBasisMark: true, useProofApplicable: false, evidenceHint: '' },
  { value: '6/8', label: 'SMK 6/8 – Yenilenmediği için sona eren marka ile aynı/benzer (sona ermeden sonraki 2 yıl) — metni doğrulayın', requiresBasisMark: true, useProofApplicable: true, evidenceHint: 'Önceki tescil ve kullanım delilleri' },
  { value: '6/9', label: 'SMK 6/9 – Kötü niyetli başvuru', requiresBasisMark: false, useProofApplicable: false, evidenceHint: 'Kötü niyet karineleri (önceki ilişki, taklit örüntüsü)' },
  { value: '5/1-b', label: 'SMK 5/1-b – Ayırt edici niteliği olmayan işaret (mutlak ret)', requiresBasisMark: false, useProofApplicable: false, evidenceHint: '' },
  { value: '5/1-c', label: 'SMK 5/1-c – Tanımlayıcı işaret (mutlak ret)', requiresBasisMark: false, useProofApplicable: false, evidenceHint: '' },
  { value: '5/1-ç', label: 'SMK 5/1-ç – Aynı/aynı türde mal-hizmet için önceki markayla aynı ya da ayırt edilemeyecek kadar benzer', requiresBasisMark: true, useProofApplicable: false, evidenceHint: 'Önceki marka bilgileri' },
  { value: '5/1-d', label: 'SMK 5/1-d – Ticaret alanında herkesçe kullanılan işaret (mutlak ret)', requiresBasisMark: false, useProofApplicable: false, evidenceHint: '' },
  { value: '5/1-f', label: 'SMK 5/1-f – Halkı yanıltıcı işaret (mutlak ret)', requiresBasisMark: false, useProofApplicable: false, evidenceHint: '' },
];

export const DEADLINE_KINDS = [
  { value: 'itiraz', label: 'Yayına itiraz', tone: 'high', help: 'Bülten yayınından itibaren 2 ay (SMK m.18)' },
  { value: 'musteri-talimati', label: 'Müşteri talimatı (iç süre)', tone: 'mid', help: 'Yasal süre değil: dosyanın hazırlanabilmesi için müşteriden karar alınacak son gün' },
  { value: 'dosya-hazirlik', label: 'Dosya hazırlık (iç süre)', tone: 'mid', help: 'Yasal süre değil: dilekçe ve delillerin hazır olacağı gün' },
  { value: 'karsi-gorus', label: 'İtiraza karşı görüş', tone: 'high', help: 'İtirazın tebliğinden itibaren 1 ay' },
  { value: 'kullanim-ispati', label: 'Kullanım ispatı', tone: 'high', help: 'Kurum yazısındaki süre (SMK m.19/2)' },
  { value: 'yidk-itiraz', label: 'YİDK\'ya itiraz', tone: 'high', help: 'Kararın tebliğinden itibaren 2 ay (SMK m.20/1)' },
  { value: 'yidk-gorus', label: 'YİDK itirazına görüş', tone: 'mid', help: 'Kurum yazısındaki süre' },
  { value: 'dava', label: 'Dava açma', tone: 'high', help: 'YİDK kararının tebliğinden itibaren 2 ay (SMK m.20/3), Ankara FSHHM' },
  { value: 'istinaf', label: 'İstinaf', tone: 'high', help: 'Kararın tebliğinden itibaren 2 hafta (HMK m.345); adli tatil uzatması uygulanır' },
  { value: 'temyiz', label: 'Temyiz', tone: 'high', help: 'Kararın tebliğinden itibaren 2 hafta (HMK m.361); adli tatil uzatması uygulanır' },
  { value: 'yenileme', label: 'Yenileme', tone: 'info', help: 'Koruma bitişi (başvurudan itibaren 10 yıl); talep bitişten önceki 6 ay içinde (SMK m.23)' },
  { value: 'yenileme-ek-sure', label: 'Yenileme ek süresi', tone: 'high', help: 'Koruma bitişinden sonraki 6 ay, ek ücretle' },
  { value: 'kullanmama-riski', label: 'Kullanmama riski', tone: 'muted', help: 'Tescilden 5 yıl sonra kullanılmayan marka iptal/ispat riski taşır (SMK m.9, 19/2)' },
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
  { value: 'hazirlandi', label: 'Hazırlandı (elle gönderilecek)', tone: 'info' },
  { value: 'gonderildi', label: 'Gönderildi', tone: 'low' },
  { value: 'hata', label: 'Hata', tone: 'high' },
  { value: 'atlandi', label: 'Gönderilmedi (ayar ya da adres yok)', tone: 'mid' },
];

export const NOTIFY_CADENCES = [
  { value: 'bulten', label: 'Her bültenden sonra' },
  { value: 'yalniz-yuksek', label: 'Yalnız yüksek riskli eşleşmeler' },
  { value: 'aylik-ozet', label: 'Aylık özet' },
];

export const JOB_KINDS = [
  { value: 'bulten-kontrol', label: 'Yeni bülten kontrolü' },
  { value: 'bulten-indir', label: 'Bülten indirme' },
  { value: 'bulten-ayristir', label: 'Bülten okuma' },
  { value: 'bulten-tara', label: 'Portföy taraması' },
  { value: 'marka-gecmis-tara', label: 'Yeni markaların geçmiş taraması' },
  { value: 'hatirlatma', label: 'Süre hatırlatmaları' },
  { value: 'gunluk-ozet', label: 'Günlük özet e-postası' },
  { value: 'bakim', label: 'Bakım (eski kayıt temizliği)' },
];

/** Sunucusuz web rolünde çalıştırılabilecek hafif işler; diğerleri işçide (GitHub Actions / VPS) */
export const WEB_SAFE_JOB_KINDS = ['bulten-kontrol', 'hatirlatma', 'gunluk-ozet', 'marka-gecmis-tara', 'bakim'];

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
