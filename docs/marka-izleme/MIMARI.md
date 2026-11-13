# Marka İzleme Platformu — Mimari ve Sözleşme Belgesi

Bu belge platformun **tek doğruluk kaynağıdır**. Kodu yazan herkes (insan ya da
ajan) buradaki dosya adlarına, dışa aktarılan fonksiyon imzalarına, API
yollarına ve arayüz kurallarına uyar. Bir şeyi değiştirmek gerekiyorsa önce bu
belge güncellenir.

## 1. Amaç ve kapsam

Marcaworld'ün marka vekilliği operasyonu için tek platform:

1. **Bülten toplama (düzenli):** TÜRKPATENT Resmi Marka Bülteni'nde yayımlanan
   başvuruları otomatik ya da elle içe aktarır, veritabanında saklar.
2. **İzleme:** Müvekkillerin markalarını (portföy) her yeni bültenle karşılaştırır;
   yazım, okunuş, anlam (TR↔EN), içerme, ortak kelime, sınıf ve Viyana kodu
   benzerliğine göre risk puanı üretir.
3. **İnceleme kuyruğu:** Uzman eşleşmeleri inceler, ilgisiz olanları eler,
   müşteriye bildirir, itiraz kararı alır.
4. **İtiraz dosyaları ve süreler:** SMK süreleri (yayına itiraz 2 ay, karşı görüş
   1 ay, YİDK'ya itiraz 2 ay, dava 2 ay, yenileme 10 yıl + 6 ay ek süre) resmi
   tatiller dikkate alınarak hesaplanır, hatırlatılır.
5. **Müşteri iletişimi:** E-posta bildirimleri, WhatsApp bağlantısı, müşteri
   portalı (müşteri eşleşmeyi görür, "itiraz etmek istiyorum / gerek yok" der),
   PDF raporlar.
6. **Hızlı araştırma:** Yeni başvuru öncesi, birikmiş tüm bülten kayıtlarında
   benzerlik sorgusu + müşteriye verilecek PDF ön araştırma raporu.
7. **Satış hunisi:** Sitede "Markanızı ücretsiz izleyelim" formu
   (`/marka-izleme`) → onay bekleyen müvekkil + marka; eşleşmeden tek tıkla
   itiraz dosyası.

Kapsam dışı (ileride): logo görüntü benzerliği (şimdilik Viyana kodu ile aday
üretilir), EPATS'e otomatik giriş, WIPO Madrid verisi, alan adı izleme.

## 2. Teknoloji

- Next.js 14 App Router, JavaScript (TypeScript yok), React 18.
- PostgreSQL + Prisma 5 (`pg_trgm` eklentisi zorunlu; Neon/Supabase destekler).
- PDF okuma: `pdfjs-dist@4.10.38` (`pdfjs-dist/legacy/build/pdf.mjs`, Node'da
  worker'sız), PDF üretme: `pdfkit` + `dejavu-fonts-ttf` (Türkçe karakterler için
  DejaVuSans; Helvetica ş/ğ/ı/İ basamaz).
- E-posta: `nodemailer` (SMTP_* ortam değişkenleri yoksa bildirim "atlandi"
  olarak kaydedilir, hata vermez).
- Testler: Node'un yerleşik `node:test` modülü, `npm run test:izleme`.
- `@/` takma adı proje köküne çözülür (`jsconfig.json`). `app/` ve
  `components/` içindeki yeni kodda `import { prisma } from '@/lib/db'` kullanın.
- **`lib/izleme/` ve `scripts/izleme/` içinde `@/` KULLANILMAZ.** Bu dosyalar
  komut satırından doğrudan `node` ile de çalışır; importlar göreli ve uzantılı
  olmalıdır: `import { normalize } from './text.js'`, `import { prisma } from '../db.js'`.
  `lib/izleme/*.js` ES modülüdür (`export`); `lib/db.js` ve `lib/auth.js` CommonJS
  kalır (adlandırılmış import ile çalışır). `lib/izleme/auth.js` `next/headers`
  kullandığı için yalnızca Next içinden import edilir (CLI'dan değil).
- Komut satırı betikleri `.mjs` uzantılıdır ve en başta `.env`'i yükler:
  `try { process.loadEnvFile?.('.env'); } catch {}`.

`next.config.js` → `experimental.serverComponentsExternalPackages`:
`['pdfkit', 'pdfjs-dist', 'nodemailer', 'dejavu-fonts-ttf']` ve
`outputFileTracingIncludes` ile `node_modules/dejavu-fonts-ttf/ttf/*.ttf`.

## 3. Dizin yapısı

```
app/
  layout.js                    kök (sadece html/body + globals.css)
  (site)/...                   genel site (Header/Footer bu grubun layout'unda)
  (site)/marka-izleme/page.js  "Ücretsiz marka izleme" talep sayfası (genel)
  admin/...                    mevcut yönetim paneli
  izleme/                      PLATFORM (personel girişi gerekir)
    layout.js                  uygulama kabuğu (sol menü) — HAZIR
    izleme.css                 platform stilleri (iz- önekli) — HAZIR
    page.js                    Pano
    bultenler/page.js          bülten listesi + içe aktarma
    bultenler/[id]/page.js     bülten ayrıntısı, kayıtlar, ayrıştırma uyarıları
    eslesmeler/page.js         inceleme kuyruğu
    eslesmeler/[id]/page.js    eşleşme ayrıntısı (yan yana karşılaştırma)
    muvekkiller/page.js        müvekkil listesi
    muvekkiller/[id]/page.js   müvekkil kartı (markalar, eşleşmeler, itirazlar, portal)
    portfoy/page.js            izlenen markalar (+ CSV içe/dışa aktarım)
    portfoy/[id]/page.js       marka ayrıntısı, ayarları, eşleşme geçmişi
    arastirma/page.js          hızlı benzerlik araştırması
    itirazlar/page.js          itiraz dosyaları
    itirazlar/[id]/page.js     itiraz dosyası ayrıntısı
    takvim/page.js             süreler / hatırlatmalar
    raporlar/page.js           PDF / CSV raporlar
    ayarlar/page.js            eşik, genel kelimeler, sınıf grupları, tatiller,
                               bildirim, kaynak, firma bilgileri, işler
  portal/[token]/page.js       müşteri portalı (giriş yok, gizli bağlantı)
  api/izleme/...               platform API'leri (bkz. §7)
components/izleme/
  ui.js                        ortak bileşenler — HAZIR (bkz. §8)
  ...                          sayfa bazlı istemci bileşenleri
lib/izleme/                    iş mantığı (bkz. §5)
scripts/izleme/                komut satırı araçları (bkz. §6)
tests/izleme/                  node:test birim testleri
docs/marka-izleme/             bu belge + kurulum/işletim rehberi
.github/workflows/marka-bulteni.yml  zamanlanmış bülten işleme
vercel.json                    Vercel Cron tanımları
```

## 4. Veri modeli

Prisma şeması `prisma/schema.prisma` içindedir (Client, WatchedMark, Bulletin,
BulletinMark, WatchMatch, Opposition, Deadline, Notification, Activity, Job,
PlatformSetting). Alanların anlamı şemadaki yorumlardadır. Önemli kurallar:

- **Tarihler:** gün bazlı tarihler (yayın tarihi, son gün, başvuru tarihi) UTC
  gece yarısı olarak saklanır. Görüntülemede `formatTR()` kullanılır
  (`timeZone: 'UTC'`), böylece gün kayması olmaz. "Bugün" Türkiye saatine göre
  hesaplanır (`todayTR()`).
- **Durum değerleri** Türkçe slug'dır; listeleri `lib/izleme/constants.js`
  dışa aktarır, arayüz etiketleri de oradan gelir. Başka yerde sabit yazılmaz.
- `WatchedMark.nameNorm`, `BulletinMark.markNorm/markPhon` her kayıt/güncellemede
  `lib/izleme/text.js` ile yeniden hesaplanır.
- `WatchMatch` (watchedMarkId, bulletinMarkId) tekildir; yeniden taramada
  puan/gerekçe güncellenir ama **durum, not ve müşteri kararı korunur**.
- Silme: müvekkil silinirse markaları/eşleşmeleri/süreleri silinir (Cascade).
  Arayüz silmeden önce sayfa içinde onay ister (`confirm()` kullanılmaz).

## 5. `lib/izleme` modülleri ve sözleşmeleri

Tümü CommonJS değil **ES modülü** (`export function ...`). Saf modüller
(`text`, `nice`, `similarity`, `deadlines`, `parser`, `constants`) Node ve
tarayıcıda çalışır; Prisma'ya veya Node API'lerine dokunmaz.

### 5.1 `constants.js`
```js
export const MATCH_STATUSES      // [{value:'yeni', label:'Yeni'}, {value:'inceleniyor',...}, 'ilgisiz', 'musteriye-bildirildi', 'itiraz-edilecek', 'itiraz-edilmeyecek', 'itiraz-edildi']
export const LEVELS              // [{value:'yuksek',label:'Yüksek',min:80},{value:'orta',label:'Orta',min:65},{value:'dusuk',label:'Düşük',min:0}]
export const BULLETIN_STATUSES   // bekliyor | indiriliyor | ayristiriliyor | taraniyor | tamamlandi | hata
export const OPPOSITION_STATUSES // hazirlaniyor | dosyalandi | karsi-gorus | karar-bekleniyor | kabul | kismen-kabul | ret | yidk-itiraz | dava | geri-cekildi
export const OPPOSITION_GROUNDS  // [{value:'6/1', label:'SMK 6/1 – Karıştırılma ihtimali (aynı/benzer marka, aynı/benzer mal-hizmet)'}, '6/2' tanınmış..., '6/3' vekil/temsilci adına kötü niyet, '6/4' kullanılmış tescilsiz marka, '6/5' tanınmış markanın itibarından haksız yarar, '6/6' kişi adı/telif/sınai hak, '6/7' ortak/garanti marka..., '6/9' kötü niyet, '5/1-b' ayırt edicilikten yoksun, '5/1-c' tanımlayıcı, ... ]
export const DEADLINE_KINDS      // itiraz | karsi-gorus | yidk-itiraz | dava | yenileme | yenileme-ek-sure | kullanim-ispati | izleme-bitis | diger (label + açıklama)
export const MARK_STATUSES, WATCH_TYPES, CLIENT_TYPES
export function labelOf(list, value)  // etiket bulur, yoksa value döner
export function levelOf(score, thresholds?)  // 'yuksek' | 'orta' | 'dusuk'
```

### 5.2 `text.js` — metin araçları (saf)
```js
export function normalize(s)            // tr-TR küçük harf, ç→c ğ→g ı/i̇→i ö→o ş→s ü→u â→a î→i û→u, & → ' ve ', alfasayısal dışı → boşluk, tek boşluk, trim
export function compact(s)              // normalize + boşluksuz
export function coreText(s, genericWords)  // normalize; genel kelimeleri (Set ya da dizi, normalize edilmiş) atar; hepsi genelse orijinali bırakır
export function phonetic(s)             // Türkçe okunuşa yakın anahtar (boşluksuz): ph→f, th→t, ck/q→k, qu→kv, w→v, x→ks, c(e,i,y önünde)→s, c→k (yabancı yazım), sonda y→i, z→s, sonda d→t, b→p, g→k, h düşer, tekrarlı harf teke
export function tokens(s)               // normalize edilmiş kelimeler
export function levenshtein(a, b)
export function ratio(a, b)             // 1 - lev/max(len)
export function jaroWinkler(a, b)
export function bigrams(s)              // Set<string> (boşluksuz metnin 2'lileri; tek harfse kendisi)
export function upperTR(s)              // toLocaleUpperCase('tr-TR')
```

### 5.3 `nice.js` — Nice sınıfları (saf)
```js
export const NICE_CLASSES               // {1:'Kimyasallar', ..., 45:'Hukuki ve güvenlik hizmetleri'} kısa Türkçe başlıklar (1–45)
export const DEFAULT_RELATED_GROUPS     // [[3,5,44,35],[29,30,31,32,43,35],[9,42,38,35],[25,18,14,24,26,35],[35,41,45],[39,12,35],[41,16,9,28],[32,33,43],[36,35],[37,19,6,11],[10,5,44],[20,21,24,11]]
export function parseClasses(input)     // "3, 44" | "03/44" | [3,'44'] → [3,44] (1–45, tekil, sıralı)
export function classRelation(a, b, groups = DEFAULT_RELATED_GROUPS)
  // → { score: 0..1, shared: number[], related: boolean }
  //   ortak sınıf varsa 1; ilişkili grup varsa 0.6; ikisinden biri boşsa 0.5; aksi 0.15
```

### 5.4 `similarity.js` — benzerlik motoru (saf)
```js
export const DEFAULT_GENERIC_WORDS  // normalize edilmiş: ltd sti as a s ve and the by de da group grup co company sirketi san tic tr turkiye turkey istanbul official store shop market magaza beauty solutions express plus pro design tasarim yazilim lojistik insaat gida tekstil kozmetik danismanlik holding international uluslararasi global
export const DEFAULT_TRANSLATIONS   // anlam eşdeğerleri, normalize edilmiş çiftler: [['gunes','sun'],['ay','moon'],['yildiz','star'],['aslan','lion'],['kartal','eagle'],['dunya','world'],['altin','gold','golden'],['kral','king'],['kralice','queen'],['ev','home','house'],['mavi','blue'],['kirmizi','red'],['yesil','green'],['beyaz','white'],['siyah','black','kara'],['su','water'],['ates','fire'],['deniz','sea'],['gok','sky'],['kus','bird'],['kurt','wolf'],['cicek','flower'],['gul','rose'],['elma','apple'],['kahve','coffee'],['cay','tea'],['ekmek','bread'],['sut','milk'],['bal','honey'],['yol','way','road'],['yeni','new'],['buyuk','big','grand'],['kucuk','little','mini'],['ilk','first'],['tek','one','uno'],['akilli','smart'],['hizli','fast','speed'],['guzel','beauty','bella'],['saglik','health'],['hayat','life'],['ask','love','amor'],['dost','friend'],['anne','mom','mother'],['bebek','baby'],['cocuk','kid','kids','child'],['kopek','dog'],['kedi','cat'],['ayi','bear'],['at','horse'],['bulut','cloud'],['ruzgar','wind'],['dag','mountain'],['orman','forest'],['ada','island'],['inci','pearl'],['elmas','diamond'],['demir','iron'],['celik','steel']]
export function compareMarks(watch, candidate, opts = {})
  // watch:     { name, classes:number[], viennaCodes?:string[], excludeTerms?:string[], watchRelated?:boolean, watchType?:'kelime'|'kelime-sekil'|'sekil' }
  // candidate: { markText, classes:number[], viennaCodes?:string[] }
  // opts:      { genericWords?, translations?, relatedGroups?, levels? }
  // → null (karşılaştırılamaz / exclude edilmiş) ya da
  //   { score, nameScore, classScore, level, reasons:string[], sharedClasses:number[], kind:'kelime'|'sekil' }
  // Kurallar (prototipten taşındı + geliştirildi):
  //  - İbare: max(ratio, jaroWinkler*0.95, fonetikRatio*0.97); aynı → 1 "Aynı ibare"; fonetik aynı → ≥0.95 "Okunuşu aynı";
  //    fonetik ≥0.8 "Okunuşu benzer"; max(ratio, jw*0.95) ≥0.78 "Yazımı benzer";
  //    içerme (min uzunluk ≥4, compact ya da fonetik) → ≥0.82+0.1*oran "İbareyi içeriyor";
  //    ortak kelime (≥4 harf, eşit ya da fonetik ≥0.85) → ≥0.6+0.3*kapsam "Ortak kelime: X";
  //    çeviri eşdeğeri → ≥0.75 "Anlamı aynı (güneş ↔ sun)".
  //  - Sınıf: classRelation; watchRelated=false ise ilişkili grup 0.15 sayılır. Gerekçe: "Ortak sınıf: 3, 44" | "İlişkili sınıf" | "Farklı sınıf".
  //  - Toplam = round(100 * min(1, ibare*0.78 + sınıf*0.22*clsW)); clsW = ibare≥0.7 ? 1 : max(0,(ibare-0.5)/0.2)
  //  - Şekil: watch.viennaCodes ile candidate.viennaCodes ortak kod (tam ya da ilk iki düzey "26.04") + ortak/ilişkili sınıf
  //    → kind:'sekil', score = 60 + 10*ortakTamKod(max 2) + 15*sınıf, gerekçe "Ortak Viyana kodu: 26.04.01".
  //    watchType 'kelime' ise şekil kontrolü yapılmaz; 'sekil' ise ibare kontrolü yapılmaz; 'kelime-sekil' ikisi, yüksek olan.
  //  - excludeTerms: aday ibarenin compact hali exclude listesinden birini içeriyorsa null.
  //  - Aday ibare boşsa (salt şekil) ve şekil kontrolü yoksa null.
export function quickScore(name, classes, candidate, opts) // hızlı araştırma için compareMarks sarmalayıcısı
```

### 5.5 `deadlines.js` — süreler (saf)
```js
export const DEFAULT_HOLIDAYS       // 'YYYY-MM-DD' dizisi, 2025–2028: sabit resmi tatiller (1 Oca, 23 Nis, 1 May, 19 May, 15 Tem, 30 Ağu, 29 Eki)
                                    // + Ramazan ve Kurban Bayramı günleri (Diyanet takvimi; ayarlardan düzenlenebilir)
export function toDateOnly(d)       // Date|string → Date (UTC 00:00); 'YYYY-MM-DD' ve 'DD.MM.YYYY' kabul eder; geçersizse null
export function isoDate(d)          // 'YYYY-MM-DD'
export function todayTR(now = new Date())  // Europe/Istanbul'a göre bugünün UTC 00:00 Date'i
export function addMonthsClamped(d, n)     // ay ekler, gün ay sonunu aşarsa son güne kırpar (31 Ara + 2 ay → 28/29 Şub)
export function isWorkingDay(d, holidays = DEFAULT_HOLIDAYS)
export function nextWorkingDay(d, holidays)  // d tatil/hafta sonuysa ilk iş günü
export function oppositionDeadline(publishDate, holidays)   // SMK m.18/1: yayın + 2 ay → iş gününe kaydır
export function responseDeadline(notifDate, holidays)       // itiraza karşı görüş: tebliğ + 1 ay
export function appealDeadline(notifDate, holidays)         // YİDK'ya itiraz (SMK m.20/1): tebliğ + 2 ay
export function lawsuitDeadline(notifDate, holidays)        // YİDK kararına karşı dava (SMK m.20/3): tebliğ + 2 ay
export function renewalInfo(applicationDate, now = new Date())
  // SMK m.23: koruma başvuru tarihinden itibaren 10 yıl; yenileme talebi bitişten önceki 6 ay içinde,
  // kaçırılırsa bitişten sonraki 6 ay ek ücretle.
  // → { protectionEnd, windowStart, graceEnd, status:'erken'|'yenileme-donemi'|'ek-sure'|'sona-erdi', daysLeft }
export function daysUntil(d, now = new Date())  // todayTR'ye göre gün farkı (negatif = geçti)
export function formatTR(d)          // 'GG.AA.YYYY' (timeZone UTC); null → '—'
export function urgencyOf(daysLeft)  // 'gecti' (<0) | 'kritik' (≤7) | 'yakin' (≤30) | 'normal'
```

### 5.6 `parser.js` — bülten ayrıştırıcı (saf)
TÜRKPATENT bülten metni INID kodlarıyla gelir. Ayrıştırıcı biçim değişikliklerine
dayanıklı olmalı ve her şüpheli kaydı uyarı olarak raporlamalı.
```js
export function splitRecords(text)      // "(210)" ile başlayan kayıt parçalarına böler; ilk (210)'dan önceki metni atar
export function parseRecord(chunk, { pageNo } = {})
  // → { record, warnings:string[] } ; record null olabilir (başvuru no yoksa)
  // record: { applicationNo:'2026/154301', applicationDate:Date|null, markText, markType, classes:number[], goods,
  //           viennaCodes:string[], colors, priority, owner, ownerAddress, attorney, pageNo, rawText }
  // Etiketler: (210) başvuru no, (220) başvuru tarihi, (300) rüçhan, (511) sınıflar + mal/hizmet (sınıf numaralarını
  // satır başlarından toplar, "Sınıf 03:" / "03 -" / "3." biçimleri), (531) Viyana kodları (\d{1,2}\.\d{1,2}(\.\d{1,2})?),
  // (540) marka ibaresi, (541)/(546) alternatif, (550)/(551) tür, (591) renk, (731)/(732) sahip (ilk satır ad, kalanı adres),
  // (740) vekil. Etiketten sonraki "Başvuru Numarası :" gibi başlıklar atılır. Boşluklar sadeleşir.
export function parseBulletinText(text, { pageOffsets } = {})
  // → { records, warnings:[{applicationNo?, message}], stats:{chunks, parsed, withoutText, withoutClasses} }
  // Aynı başvuru no iki kez gelirse sonuncusu kalır ve uyarı yazılır.
export function parseCsv(text)
  // ; , sekme veya | ayırıcı; başlık satırı varsa (basvuru no|marka|siniflar|sahip|tarih|vekil|viyana) sütun eşler,
  // yoksa sıra: başvuru no; marka; sınıflar; sahip → { records, warnings }
export function detectBulletinMeta(text) // ilk sayfalardan bülten sayısı ve yayın tarihini tahmin eder → { number?, publishDate? }
```

### 5.7 `pdf-text.js` — PDF metin çıkarma (yalnız sunucu)
```js
export async function openPdf(input)    // path | Buffer | Uint8Array → { doc, numPages }
export async function* pdfPages(input, { startPage = 1, endPage } = {})
  // her sayfa için { pageNo, text, numPages }; satırlar transform[5] (y) değişince '\n' ile,
  // aynı satırda x boşluğu büyükse ' ' ile birleşir. Bellek için sayfa bitince page.cleanup().
export async function pdfToText(input, opts)  // tüm metin + sayfa başlangıç ofsetleri { text, pageOffsets:[{pageNo, offset}], numPages }
```
`pdfjs-dist/legacy/build/pdf.mjs` dinamik `import()` ile yüklenir; `isEvalSupported:false`,
`disableFontFace:true`, `useSystemFonts:false`.

### 5.8 `settings.js` (sunucu)
```js
export const DEFAULT_SETTINGS = {
  esik: 60,                                   // eşleşme kaydı için en düşük puan
  seviyeler: { yuksek: 80, orta: 65 },
  genelKelimeler: DEFAULT_GENERIC_WORDS,
  ceviriler: DEFAULT_TRANSLATIONS,
  iliskiliSiniflar: DEFAULT_RELATED_GROUPS,
  tatiller: DEFAULT_HOLIDAYS,
  bildirim: { personelEpostalari: [], gunlukOzet: true, musteriyeOtomatik: false, otomatikSeviyeler: ['yuksek'], hatirlatmaGunleri: [30,14,7,3,1] },
  kaynak: { bultenListeUrl: 'https://www.turkpatent.gov.tr/bultenler', pdfDeseni: 'marka', otomatikIndir: true },
  firma: { ad: 'Marcaworld', telefon: '', eposta: '', adres: '', web: '' },
}
export async function getSettings(prisma)          // DB'deki anahtarları varsayılanların üzerine yazar (derin değil, anahtar bazında)
export async function saveSetting(prisma, key, value)  // bilinmeyen anahtar → hata
export function matchOptions(settings)             // compareMarks opts'u üretir
```

### 5.9 `matcher.js` (sunucu)
```js
export function buildCandidateIndex(records)  // records: [{id, markText, markNorm, markPhon, classes, viennaCodes, owner}]
  // bigram ters indeksi (compact core + fonetik) + Viyana kodu indeksi + çeviri kelime indeksi
export function candidatesFor(index, watch, opts) // aday kayıt id kümesi (en az ~%30 bigram ortaklığı | içerme | ortak kelime | çeviri | Viyana)
export async function scanBulletin(prisma, bulletinId, { watchedMarkIds, settings, onProgress } = {})
  // aktif (active && !pendingApproval, watchEnd yoksa ya da ileride) markaları bültenin tüm kayıtlarıyla karşılaştırır.
  // Sahibi watch.ownerAliases/müvekkil adına benzeyen (ratio ≥0.9) kayıtlar atlanır (müvekkilin kendi başvurusu).
  // eşik altını kaydetmez; mevcut eşleşmede puan/gerekçe/level günceller, durum/not/karar korunur.
  // Bulletin.matchCount, scannedAt, status='tamamlandi' günceller; Activity yazar.
  // → { compared, candidates, created, updated, matchIds:string[] (yeni oluşanlar) }
export async function scanMarkAgainstHistory(prisma, watchedMarkId, { sinceDate, settings } = {})
  // yeni eklenen marka için son N bülten (varsayılan: itiraz süresi dolmamış bültenler) taranır
export async function findSimilar(prisma, { name, classes = [], limit = 50, minScore = 45, bulletinId, onlyOpen = false, settings })
  // pg_trgm ön filtresi: similarity(markNorm, $1) > 0.2 OR similarity(markPhon, $2) > 0.25 OR markNorm ILIKE %core%
  //   (+ çeviri kelimeleri için ILIKE), en fazla 3000 aday → compareMarks ile puanla → sırala.
  // → [{ record (bulletin.number, publishDate, oppositionDeadline dahil), score, level, reasons, sharedClasses }]
```

### 5.10 `ingest.js` + `sources/turkpatent.js` + `jobs.js` (sunucu)
```js
// ingest.js
export async function upsertBulletin(prisma, { number, publishDate, sourceUrl, fileName, filePath, fileHash, fileSize, notes })
  // oppositionDeadline'ı ayarlardaki tatillerle hesaplar; aynı numara varsa günceller
export async function insertRecords(prisma, bulletinId, records, { batchSize = 500 } = {})
  // markNorm/markPhon hesaplar, createMany skipDuplicates; → eklenen sayı; recordCount günceller
export async function ingestPdf(prisma, bulletinId, input, { maxMs, onProgress } = {})
  // sayfa sayfa okur; parça sınırında yarım kalan kaydı (son "(210)" sonrası) bir sonraki sayfayla birleştirir;
  // her 25 sayfada bir kayıtları yazar, Bulletin.pagesDone/progress/status günceller.
  // maxMs dolarsa { done:false } döner ve pagesDone'dan devam edilebilir (kesilen yarım kayıt bir önceki
  // sayfadan yeniden okunarak toparlanır).
export async function ingestText(prisma, bulletinId, text, { format: 'inid'|'csv'|'auto' })
export async function downloadToFile(url, destPath, { onProgress, maxBytes = 600 * 1024 * 1024 })
export function storageDir()            // process.env.IZLEME_STORAGE_DIR || <cwd>/storage/bultenler
export async function sha256File(path)

// sources/turkpatent.js
export async function fetchBulletinList({ listUrl, fetchImpl = fetch })
  // bülten liste sayfasını indirir, "Marka" bülteni PDF bağlantılarını ve sayı/tarih bilgisini çıkarır
  // → [{ number, publishDate|null, url, title }] (HTML biçimi değişirse boş dizi + uyarı; asla uydurma veri üretmez)
export async function checkForNewBulletins(prisma, { settings, fetchImpl })
  // listedeki ve DB'de olmayan bültenler için Bulletin(status:'bekliyor', sourceUrl) + Job('bulten-indir') oluşturur

// jobs.js
export async function enqueue(prisma, kind, { bulletinId, payload } = {})   // aynı türde açık iş varsa onu döner
export async function runPendingJobs(prisma, { maxMs = 50_000, kinds } = {})
  // sırayla: bulten-kontrol → bulten-indir → bulten-ayristir → bulten-tara → hatirlatma/gunluk-ozet
  // her iş lockedAt ile kilitlenir (10 dk sonra kilit düşer); maxMs dolunca bırakır; → özet
export async function runJob(prisma, job, { maxMs })
```

### 5.11 `notify.js` (sunucu)
```js
export function emailConfigured()       // SMTP_HOST && SMTP_USER && SMTP_PASS
export async function sendEmail(prisma, { to, subject, html, text, kind, clientId, matchId })
  // Notification kaydı açar; SMTP yoksa status:'atlandi', error:'SMTP ayarlanmadı'
export function whatsappLink(phone, text)   // https://wa.me/<rakamlar>?text=...
export function matchEmail({ client, matches, settings, portalUrl })  // { subject, html, text } — Türkçe, sade, firma bilgisi altta
export async function notifyClientMatches(prisma, matchIds, { actor })  // müşteriye toplu e-posta + durum 'musteriye-bildirildi' + notifiedAt
export async function notifyStaffNewMatches(prisma, bulletinId)        // personel e-postalarına bülten özeti
export async function sendDeadlineReminders(prisma, { now })           // remindDays'e göre; aynı gün tekrar göndermez
export async function sendDailyDigest(prisma, { now })
export function appUrl()                                               // process.env.APP_URL || 'http://localhost:3000'
```

### 5.12 `report.js` (sunucu)
```js
export async function clientReportPdf(prisma, { clientId, bulletinId, statuses })   // → Buffer
  // kapak (firma, müvekkil, tarih), özet tablo, her eşleşme için: izlenen marka ↔ başvuru, puan, gerekçeler,
  // sınıflar, sahip, vekil, itiraz son günü, kalan gün; sonda yasal not.
export async function searchReportPdf({ query, classes, results, settings })        // ön araştırma raporu → Buffer
export function toCsv(rows, columns)    // columns: [{key, label, format?}] → '﻿' + ';' ayırıcılı CSV (Excel TR uyumlu)
export function registerFonts(doc)      // DejaVuSans + Bold kaydeder: doc.font('Regular'|'Bold')
```

### 5.13 `activity.js`, `auth.js` (sunucu)
```js
// activity.js
export async function logActivity(prisma, { actor, action, entity, entityId, summary, detail })  // hata yutar, asla fırlatmaz
// auth.js — HAZIR
export function getStaff(request)       // route handler: JWT doğrular → {id,email,role} | null
export function getStaffFromCookies()   // server component: next/headers cookies() ile
export function unauthorized()          // NextResponse 401 JSON
export function checkCronSecret(request) // Authorization: Bearer CRON_SECRET | ?secret=  → boolean (CRON_SECRET yoksa false)
export function newPortalToken()        // crypto.randomBytes(24).toString('base64url')
```

## 6. Düzenli çalışma (zamanlama) ve komut satırı

Büyük bülten PDF'leri (100–200 MB, binlerce sayfa) sunucusuz ortamda (Vercel:
4,5 MB istek gövdesi sınırı, 10–60 sn süre) tek istekte işlenemez. Bu yüzden iki
yol desteklenir:

1. **GitHub Actions (önerilen, Vercel ile):** `.github/workflows/marka-bulteni.yml`
   her gün 06:15 ve 18:15 (TR) çalışır, `node scripts/izleme/gunluk.js` komutunu
   çalıştırır: yeni bülten var mı bak → indir → ayrıştır → tara → bildir →
   hatırlat. Gizli değişkenler: `DATABASE_URL`, `SMTP_*`, `APP_URL`.
   Elle tetikleme (`workflow_dispatch`) ile belirli bir PDF URL'si de verilebilir.
2. **Kendi sunucunuz (VPS, `next start`):** Vercel dışı kurulumda platformdaki
   "İçe aktar" düğmesi dosyayı `storage/bultenler`e kaydeder, `Job` açar; işler
   `/api/izleme/cron/isler` çağrılarıyla (sistem cron'u, her 5 dk) zaman dilimli
   olarak işlenir, kaldığı sayfadan devam eder.

`vercel.json` cron'ları (günde bir, Hobby planına uygun):
`/api/izleme/cron/bulten-kontrol`, `/api/izleme/cron/hatirlatma`,
`/api/izleme/cron/ozet`. Hepsi `CRON_SECRET` ister.

Komut satırı (`scripts/izleme/`, `node` ile, `.env` okur):
- `bulten-ice-aktar.js <dosya.pdf|url|dosya.csv> --sayi 503 --tarih 2026-11-03 [--tara] [--sayfa 1-50]`
- `gunluk.js [--sadece-kontrol] [--pdf-url URL --sayi N --tarih YYYY-MM-DD]`
- `tara.js <bültenNo|--hepsi>`
- `ornek-veri.js` → demo müvekkiller, markalar ve kurgusal bir bülten (etiketli "ÖRNEK") yükler
- `ayristirma-dene.js <dosya.pdf> --sayfa 10-14` → veritabanına yazmadan ayrıştırma sonucunu ve uyarıları yazdırır

`package.json` betikleri: `test:izleme`, `izleme:gunluk`, `izleme:ice-aktar`,
`izleme:ornek`, `izleme:ayristir`.

## 7. API (`app/api/izleme/...`)

Kurallar: Tüm uçlar `export const dynamic = 'force-dynamic'`; yanıtlar JSON;
hata → `{ error: 'Türkçe, ne yapılacağını söyleyen mesaj' }` + uygun durum kodu.
Personel uçları `getStaff(request)` ile korunur (middleware de korur). Değiştiren
her uç `logActivity` çağırır. Listeleme uçları `?page=1&pageSize=50` destekler ve
`{ items, total, page, pageSize }` döner.

| Yol | Yöntem | Açıklama |
|---|---|---|
| `/api/izleme/stats` | GET | Pano sayıları + yaklaşan süreler + son etkinlikler |
| `/api/izleme/clients` | GET, POST | `?q=&active=` |
| `/api/izleme/clients/[id]` | GET, PATCH, DELETE | GET: markalar, açık eşleşme sayısı, itirazlar |
| `/api/izleme/clients/[id]/portal` | POST | portal bağlantısını yeniler `{ portalToken, url }` |
| `/api/izleme/marks` | GET, POST | `?clientId=&q=&active=&pending=`; POST sonrası `scanMarkAgainstHistory` |
| `/api/izleme/marks/[id]` | GET, PATCH, DELETE | GET: eşleşme geçmişi + yenileme bilgisi |
| `/api/izleme/marks/import` | POST | CSV metni `{ csv, clientId? }` → `{ created, skipped, errors }` (sütunlar: müvekkil;marka;sınıflar;başvuru no;başvuru tarihi;viyana) |
| `/api/izleme/marks/export` | GET | CSV indirme |
| `/api/izleme/bulletins` | GET, POST | POST: `multipart` (file + number + publishDate) **ya da** JSON `{ number, publishDate, url }` **ya da** `{ number, publishDate, text, format }` |
| `/api/izleme/bulletins/[id]` | GET, PATCH, DELETE | GET: sayılar, durum, uyarı örnekleri |
| `/api/izleme/bulletins/[id]/marks` | GET | `?q=&class=&page=` bülten kayıtları |
| `/api/izleme/bulletins/[id]/scan` | POST | yeniden tara (senkron, ≤ 50 sn; büyükse iş kuyruğu) |
| `/api/izleme/bulletins/check` | POST | kaynakta yeni bülten var mı (şimdi kontrol et) |
| `/api/izleme/matches` | GET | filtreler: `bulletinId, clientId, watchedMarkId, status, level, q, deadlineBefore, sort` |
| `/api/izleme/matches/[id]` | GET, PATCH | PATCH: `status, note, assignee`; GET: tüm ayrıntı + müşteri kararı |
| `/api/izleme/matches/bulk` | POST | `{ ids, action: 'durum'|'bildir'|'ata', value }` |
| `/api/izleme/matches/[id]/opposition` | POST | eşleşmeden itiraz dosyası + itiraz süresi kaydı oluşturur |
| `/api/izleme/oppositions` | GET, POST | |
| `/api/izleme/oppositions/[id]` | GET, PATCH, DELETE | durum değişince ilgili süreleri oluşturur (karsi-gorus → +1 ay, ret → yidk-itiraz +2 ay) |
| `/api/izleme/deadlines` | GET, POST | `?from=&to=&status=&kind=&clientId=` |
| `/api/izleme/deadlines/[id]` | PATCH, DELETE | |
| `/api/izleme/search` | POST | `{ name, classes, onlyOpen }` → sonuçlar |
| `/api/izleme/search/pdf` | POST | aynı gövde → PDF |
| `/api/izleme/reports/client/[id]` | GET | `?bulletinId=` → PDF |
| `/api/izleme/export/matches` | GET | eşleşme filtreleriyle CSV |
| `/api/izleme/settings` | GET, PUT | PUT `{ key, value }` |
| `/api/izleme/jobs` | GET | son 50 iş |
| `/api/izleme/jobs/run` | POST | bekleyen işleri şimdi çalıştır (≤ 50 sn) |
| `/api/izleme/notifications` | GET, PATCH | panel bildirimleri, okundu işaretle |
| `/api/izleme/cron/[task]` | GET | `bulten-kontrol` \| `isler` \| `hatirlatma` \| `ozet`; `checkCronSecret` |
| `/api/izleme/portal/[token]` | GET | müşteri görünümü (yalnız müşteriye bildirilmiş eşleşmeler) |
| `/api/izleme/portal/[token]/decision` | POST | `{ matchId, decision: 'itiraz-istiyor'|'istemiyor', note }` → personele bildirim |
| `/api/izleme/public/signup` | POST | genel form: ad, e-posta, telefon, marka, sınıflar, KVKK onayı, gizli tuzak alanı; IP başına dakikada 5 |

Middleware: `/izleme/*` ve `/api/izleme/*` personel çerezi ister; **hariç:**
`/api/izleme/cron/*` (CRON_SECRET), `/api/izleme/portal/*` (token),
`/api/izleme/public/*` (genel).

## 8. Arayüz kuralları

- Platform sayfaları `app/izleme/layout.js` kabuğunun içinde render olur;
  `izleme.css`'teki `iz-` sınıfları kullanılır. Satır içi stil yalnız tek seferlik
  yerleşim için.
- Sunucu bileşeni (page.js) veriyi Prisma ile okur, etkileşimli kısımlar
  `components/izleme/<Alan>*.js` içinde `'use client'` bileşenleridir ve API'yi
  `fetch` ile çağırır, başarıdan sonra `router.refresh()`.
- Ortak bileşenler (HAZIR, değiştirmeyin; eksik varsa kendi bileşen dosyanızda yazın):
  - `components/izleme/format.js` (direktifsiz, saf): `fmtDate, fmtDateTime, fmtAgo,
    fmtNum, fmtMoney, todayTRDate, daysLeft, urgency, daysLeftText, qs, truncate`.
  - `components/izleme/parts.js` (direktifsiz, hook yok; sunucu+istemci):
    `PageHeader({title, description, crumbs:[{label,href}], actions})`, `Stats`, `Stat({label,value,sub,tone,href})`,
    `LevelPill({level, score, bar})`, `StatusBadge({value, list, tone})` (list öğeleri `{value,label,tone}`),
    `ClassChips({classes, highlight})`, `Reasons({reasons})`, `DeadlineCell({date, done})`,
    `EmptyState({title, children, action})`, `Card({title, sub, actions, flush, id})`, `Field({label, htmlFor, hint, error})`,
    `Toolbar`, `DefList({items:[[k,v]]})`, `Alert({tone:'info'|'warn'|'error'|'ok'})`, `Progress({value})`.
  - `components/izleme/interactive.js` (`'use client'`): `api(url, {method, body})` (Türkçe hata fırlatır),
    `download(url, {method, body, fileName})`, `ToastProvider` (layout'ta hazır), `useToast()`,
    `useAction()` → `[run(fn, başarıMesajı, {refresh}), busy]`, `Modal({open, title, onClose, footer, wide})`,
    `ConfirmButton({onConfirm, confirmText, className})`, `useQueryUpdater()`, `Pagination({total, page, pageSize})`,
    `SearchBox({placeholder, param, initial})`, `FilterSelect({param, value, options, allLabel, label})`.
  - **Dikkat:** `'use client'` dosyasından sunucu bileşenine fonksiyon import edip
    çağırmayın (Next bunu istemci referansına çevirir). Saf yardımcılar `format.js`'te.
- Durum listeleri (`constants.js`) arayüz rozet tonu da taşır: her öğe `{ value, label, tone }`
  (`tone`: brand | high | mid | low | info | muted).
- Platform kabuğu (`app/izleme/layout.js`) personel oturumunu doğrular, menü
  sayaçlarını hesaplar ve `ToastProvider` sağlar. Sayfalar `export const dynamic = 'force-dynamic'`.
- Dil: Türkçe, sade, kullanıcı tarafından bakılarak ("Müşteriye bildir",
  "İlgisiz say", "İtiraz dosyası aç"). Hata mesajı ne olduğunu ve ne yapılacağını
  söyler. Tarih `GG.AA.YYYY`. Sayılar `tr-TR`.
- Her liste boş durum metni içerir ("Henüz bülten yok. Sağ üstten içe aktarın.").
- Tablolar `.iz-table-wrap` içinde yatay kaydırılır; sayfa yatay kaymaz; 1024 px
  ve 400 px genişlikte kullanılabilir.
- Silme gibi geri dönüşsüz işlemler `ConfirmButton` (iki adımlı) ile.

## 9. Güvenlik ve KVKK

- Personel girişi mevcut admin JWT çereziyle (`mw_admin_session`).
- Portal bağlantısı 32 karakterlik rastgele token; müvekkil kartından yenilenebilir
  ya da kapatılabilir. Portal yalnızca müşteriye bildirilmiş eşleşmeleri gösterir;
  diğer müvekkillerin verisini asla göstermez.
- Cron uçları `CRON_SECRET` olmadan 401.
- Genel form: KVKK onay kutusu zorunlu, tuzak alanı dolu ise sessizce kabul edip
  kaydetmez, IP başına bellek içi oran sınırlama.
- Bülten verisi kamuya açık resmi yayındır; yine de sahip/adres alanları kişisel
  veri içerebilir: yalnız personel görür, dışa aktarımlar Activity'e yazılır.
- Ortam değişkenleri: `DATABASE_URL`, `JWT_SECRET`, `CRON_SECRET`, `APP_URL`,
  `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`,
  `IZLEME_STORAGE_DIR`, `WHATSAPP_NUMBER`.

## 10. Test

- `tests/izleme/*.test.mjs` — `node --test tests/izleme/` ile çalışır:
  text/similarity (prototipteki örnek eşleşmeler beklenen seviyede), deadlines
  (ay sonu kırpma, hafta sonu/tatil kaydırma, yenileme dönemleri), parser
  (INID örnek metinleri, eksik alanlar, CSV), matcher aday üretimi (saf kısım).
- Uçtan uca: yerel PostgreSQL + `ornek-veri.js` + Playwright ile tüm sayfalar
  açılır, ana akışlar (bülten içe aktar → tara → eşleşmeyi bildir → portalda karar
  → itiraz dosyası → süre) çalışır.
