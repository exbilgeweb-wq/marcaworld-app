# Marka İzleme Platformu — Mimari ve Sözleşme Belgesi (v2)

Bu belge platformun **tek doğruluk kaynağıdır**. Kodu yazan herkes (insan ya da
ajan) buradaki dosya adlarına, fonksiyon imzalarına, API yollarına ve arayüz
kurallarına uyar. v2, üç uzman incelemesinin (hukuk/operasyon, veri/altyapı,
ürün/UX) bulgularını içerir.

> Hazır olanlar (değiştirmeyin, yalnız kullanın): `prisma/schema.prisma`,
> `prisma/migrations/*`, `lib/izleme/constants.js`, `lib/izleme/permissions.js`,
> `lib/izleme/auth.js`, `app/izleme/layout.js`, `app/izleme/izleme.css`,
> `components/izleme/{format,parts,interactive,Nav}.js`, `middleware.js`,
> `next.config.js`, `.env.example`. Eksik görürseniz kendi dosyanızda çözün ve
> teslim notunda belirtin.

## 1. Amaç ve kapsam

Marcaworld'ün marka vekilliği operasyonu için tek platform:

1. **Bülten toplama (düzenli):** TÜRKPATENT Resmi Marka Bülteni'ni otomatik
   (GitHub Actions / VPS işçisi) ya da elle (PDF, URL, metin/CSV) içe aktarır.
2. **İzleme:** Portföydeki markaları her bültenle karşılaştırır: yazım, iki ayrı
   okunuş anahtarı (Türkçe/yabancı), anlam (TR↔EN), içerme, ortak kelime, sınıf,
   tanınmışlık ve Viyana kodu. Ayrıca kıdem (rüçhan/başvuru tarihi), kullanım
   ispatı riski ve çıkar çatışması kontrolleri yapılır.
3. **İnceleme kuyruğu:** İki bölmeli, klavyeyle hızlı triyaj; toplu işlem, geri
   alma, kayıtlı görünümler, atama, yüksek riskli "ilgisiz" için ikinci onay.
4. **Müşteri iletişimi:** Bülten başına müvekkil başına tek e-posta (outbox,
   çift gönderim yok), elle bildirim kaydı, WhatsApp bağlantısı, müşteri portalı
   (bekleyen kararlar, markalar, itiraz dosyaları), karar geçmişi (yalnız eklenir).
5. **İtiraz dosyaları:** Giden ve gelen itirazlar, dayanaklar, gerekçeler (SMK
   5–6), kapsam (tüm/kısmi), kontrol listesi, belge ekleri, ücret ve ödeme, resmi
   olaylar (tebliğ/karar). **Süreler yalnız tebliğ tarihlerinden üretilir.**
6. **Süreler:** SMK/HMK süreleri; tam gün, yarım gün ve idari izin ayrımlı tatil
   takvimiyle kaydırma; iç süreler (müşteri talimatı, dosya hazırlık); yenileme ve
   kullanmama riski; hatırlatma, eskalasyon, kişisel iCal akışı.
7. **Hızlı araştırma:** Birikmiş bülten kayıtlarında ön araştırma + kapsam notlu
   PDF rapor; aramalar kaydedilir.
8. **Satış hunisi:** Sitede ücretsiz izleme talep formu (`/marka-izleme`), KVKK
   aydınlatma ve ayrı ticari ileti onayı; eşleşmeden tek tıkla itiraz dosyası ve
   ücret teklifi.

**Kapsam dışı (ileride):** logo görüntü benzerliği ve PDF'ten görsel çıkarma,
OCR, EPATS'e otomatik giriş, Madrid (WIPO) verisi, alan adı izleme, çok
kiracılı SaaS, nesne deposu (S3), .xlsx içe aktarma, seri marka (marka ailesi)
modeli. Bunlar arayüzde "yakında" diye gösterilmez; yalnız belgede listelenir.

## 2. Teknoloji ve modül kuralları

- Next.js 14 App Router, JavaScript, React 18. PostgreSQL + Prisma 5
  (`pg_trgm` zorunlu). `DATABASE_URL` + `DIRECT_URL`.
- PDF okuma `pdfjs-dist@4.10.38` (legacy build, worker'sız), PDF üretme
  `pdfkit` + `dejavu-fonts-ttf` (DejaVuSans; Helvetica Türkçe karakter basamaz),
  e-posta `nodemailer`, QR kod `qrcode`.
- **İçe aktarma kuralları:**
  - `app/` ve `components/` → `@/` takma adı serbest (`import { prisma } from '@/lib/db'`).
  - `lib/izleme/**`, `scripts/izleme/**`, `tests/izleme/**` → **yalnız göreli ve
    uzantılı** importlar (`'./text.js'`, `'../db.js'`). `@/` yasak. Bu klasörlerde
    `package.json` → `{"type":"module"}` vardır; dosyalar ES modülüdür.
  - `lib/db.js`, `lib/auth.js` CommonJS'tir; ESM'den adlandırılmış import çalışır.
  - `lib/izleme/auth.js` `next/headers` kullanır → yalnız Next içinden import edilir.
    Komut satırından da çağrılan modüller (`ingest`, `matcher`, `jobs`, `notify`,
    `report`, `settings` ...) `auth.js`'i import ETMEZ.
  - Komut satırı betikleri `scripts/izleme/*.mjs`; en başta
    `try { process.loadEnvFile?.('.env'); } catch {}`.
  - `'use client'` dosyasından sunucu bileşenine fonksiyon import edip çağırmayın.
- Route handler'lar: `export const dynamic = 'force-dynamic'; export const runtime = 'nodejs';`
  Uzun sürebilenler ayrıca `export const maxDuration = 60;` ve iş süresi
  `Number(process.env.IZLEME_MAX_MS ?? 45000)`.
- `IZLEME_ROLE=web|worker` (varsayılan `web`). Web rolünde ağır işler
  (`bulten-indir`, `bulten-ayristir`, büyük `bulten-tara`) çalıştırılmaz; iş
  kuyruğa girer, işçi tetiklenir (bkz. §6).

## 3. Dizin yapısı ve sahiplik

```
app/(site)/marka-izleme/page.js        ücretsiz izleme talep sayfası (genel)
app/izleme/                            PLATFORM (personel)
  page.js                              Pano (KPI + kurulum listesi + sistem sağlığı)
  bultenler/page.js, [id]/page.js      bültenler, içe aktarma, kayıtlar, kalite
  eslesmeler/page.js, [id]/page.js     iki bölmeli inceleme kuyruğu, ayrıntı
  muvekkiller/page.js, [id]/page.js    müvekkiller, kişiler, portal, vekaletname
  portfoy/page.js, [id]/page.js        izlenen markalar, CSV içe/dışa aktarım
  arastirma/page.js                    hızlı araştırma
  itirazlar/page.js, [id]/page.js      itiraz dosyaları (olaylar, belgeler)
  takvim/page.js                       süreler
  raporlar/page.js                     PDF/CSV raporlar
  ayarlar/page.js                      ayarlar + ekip + işler + bildirim günlüğü
app/portal/[token]/page.js             müşteri portalı
app/api/izleme/...                     API (bkz. §7)
components/izleme/<Alan>*.js           sayfa bileşenleri
lib/izleme/*.js                        iş mantığı (bkz. §5)
scripts/izleme/*.mjs                   komut satırı ve işçi
tests/izleme/*.test.mjs                node:test
.github/workflows/marka-bulteni.yml    zamanlanmış işçi
vercel.json                            tek günlük cron + bölge
docs/marka-izleme/KURULUM.md           kurulum ve işletim rehberi
```

## 4. Veri modeli kuralları

Şema `prisma/schema.prisma` içindedir; alanların anlamı yorumlardadır.

- **Tarihler:** Gün bazlı tarihler UTC 00:00 olarak saklanır, `formatTR()` ve
  `fmtDate()` ile `timeZone:'UTC'` biçimlenir. "Bugün" Türkiye saatine göre
  hesaplanır (`todayTR()`).
- **Durum değerleri** `lib/izleme/constants.js`'ten gelir; başka yerde sabit yazılmaz.
- **Normalize alanlar:** `WatchedMark.nameNorm`, `BulletinMark.markNorm/markPhon/markPhonEn`
  her yazımda `text.js` ile hesaplanır. `applicationNo` her yerde `canonicalAppNo()`
  ile kanonik biçimdedir.
- **Silme yok, arşiv var:** Client, WatchedMark, Opposition → `archivedAt`.
  Arşivli kayıtlar listelerde varsayılan olarak gizlenir, taramaya girmez.
  WatchMatch, ClientDecision, Activity, Notification hiç silinmez.
  Bülten yalnız hiç eşleşmesi yoksa ya da eşleşmelerinin hepsi `yeni`/`otomatik-elendi`
  ise silinebilir (önce o eşleşmeler silinir); aksi halde 409.
  Örnek veri (`Client.isSample`) toplu silinebilir: eşleşmeler → kararlar → müvekkiller.
- **KVKK anonimleştirme:** müvekkil adı/iletişim alanları "Anonim müvekkil #<kısa id>"
  ve null olur, dosya/süre/eşleşme kayıtları kalır, `anonymizedAt` dolar.
- **Eşleşme tekilliği:** (watchedMarkId, bulletinMarkId). Yeniden taramada yalnız
  puan alanları güncellenir; `status, note, assigneeId, clientDecision*, recommendation,
  clientSummary, quote, dismissReason, notifiedAt` **asla** taramayla değişmez.
  Artık eşik altındaki `yeni` eşleşmeler `stale=true` olur ve kuyrukta gizlenir.
- **Eşleşme durum geçişleri** (§5.14) sunucuda doğrulanır.

## 5. `lib/izleme` modülleri

Saf modüller (Prisma/Node API kullanmaz, tarayıcıda da çalışır): `constants`,
`permissions`, `text`, `nice`, `similarity`, `deadlines`, `parser`, `transitions`.

### 5.1 `constants.js` ve `permissions.js` — HAZIR
Tüm durum listeleri `{ value, label, tone, help? }`. `labelOf(list, v)`,
`levelOf(score, {yuksek, orta})`. Yetki: `can(staff, eylem)`, `effectiveRole(staff)`,
`STAFF_ROLES`, eylemler: `goruntule, eslesme.incele, eslesme.ilgisiz-onayla,
musteriye.gonder, itiraz.karar, itiraz.dosya, kayit.duzenle, bulten.ice-aktar,
disa.aktar, arsivle, ayar.degistir, ekip.yonet, cakisma.kilit-ac, kvkk.anonimlestir`.

### 5.2 `text.js` (saf)
```js
export function normalize(s)            // tr-TR küçük harf; ç→c ğ→g ı/i̇→i ö→o ş→s ü→u â→a î→i û→u; & → ' ve '; alfasayısal dışı → boşluk; tek boşluk; trim
export function compact(s)              // normalize, boşluksuz
export function coreText(s, genericWords)  // normalize; genel kelimeleri atar; hepsi genelse orijinal normalize metin
export function phoneticTr(raw)         // HAM metinden (normalize ÖNCESİ, tr-TR küçük harf) Türkçe okunuş anahtarı, boşluksuz:
                                        //   ç→C, c→J, ş→S, j→J, ğ düşer, ı→i ö→o ü→u, w→v, x→ks, q→k, sonda b→p d→t g→k c→ç(C),
                                        //   tekrarlı harf teke, alfasayısal dışı atılır. (ÇAY→"Cai"? hayır: y korunur → "Cay")
export function phoneticEn(raw)         // yabancı okuma: ch/tch→C, sh→S, j→J, c(e,i,y)→s, c→k, ph→f, th→t, ck→k, qu→kv, q→k, w→v, x→ks,
                                        //   sonda y→i, z→s, h düşer, Türkçe harfler normalize edilir, tekrarlı harf teke
export function phoneticKeys(raw)       // { tr, en }
export function tokens(s)               // normalize edilmiş kelimeler
export function levenshtein(a, b)
export function ratio(a, b)             // 1 - lev/max(len)
export function jaroWinkler(a, b)
export function bigrams(s)              // Set<string>; boşluksuz metnin ikilileri; 1 harfse kendisi
export function upperTR(s)
export function canonicalAppNo(s)       // "2026 / 154301" → "2026/154301"; eşleşmezse null
export function sha1(s)                 // contentHash için (node:crypto YOK — saf JS ya da basit FNV-1a 64 bit hex)
```
Testler (zorunlu): `phoneticTr('ÇAY')` ≠ `phoneticTr('KAY')` ve oran < 0.8;
`CAN`/`JAN` en az bir anahtar kombinasyonunda aynı; `ŞEKER`/`SHEKER` aynı;
`DAĞ`/`DA` oran ≥ 0.9.

### 5.3 `nice.js` (saf)
```js
export const NICE_CLASSES               // {1:'Kimyasallar', ..., 45:'Hukuki ve güvenlik hizmetleri'} kısa Türkçe başlıklar
export const DEFAULT_RELATED_GROUPS     // [[3,5,44,35],[29,30,31,32,43,35],[9,42,38,35],[25,18,14,24,26,35],[35,41,45],[39,12,35],[41,16,9,28],[32,33,43],[36,35],[37,19,6,11],[10,5,44],[20,21,24,11]]
export function parseClasses(input)     // "3, 44" | "03/44" | [3,'44'] → [3,44]
export function classRelation(a, b, groups, { allClasses = false } = {})
  // → { score: 0..1, shared:number[], related:boolean }
  //   allClasses (tanınmış marka) → score 1, shared = b; ortak sınıf → 1; ilişkili → 0.6; biri boş → 0.5; aksi 0.15
export function isRetail35(goodsText)   // 35. sınıf metninde perakende/toptan satış hizmeti geçiyor mu
```

### 5.4 `similarity.js` (saf)
```js
export const DEFAULT_GENERIC_WORDS      // normalize: ltd sti as a s ve and the by de da group grup co company sirketi san tic tr turkiye turkey istanbul official store shop market magaza beauty solutions express plus pro design tasarim yazilim lojistik insaat gida tekstil kozmetik danismanlik holding international uluslararasi global
export const DEFAULT_TRANSLATIONS       // eşdeğer kelime grupları (normalize): [['gunes','sun'],['ay','moon'],['yildiz','star'],['aslan','lion'],['kartal','eagle'],['dunya','world'],['altin','gold','golden'],['kral','king'],['kralice','queen'],['ev','home','house'],['mavi','blue'],['kirmizi','red'],['yesil','green'],['beyaz','white'],['siyah','black','kara'],['su','water'],['ates','fire'],['deniz','sea'],['gok','sky'],['kus','bird'],['kurt','wolf'],['cicek','flower'],['gul','rose'],['elma','apple'],['kahve','coffee'],['cay','tea'],['ekmek','bread'],['sut','milk'],['bal','honey'],['yol','way','road'],['yeni','new'],['buyuk','big','grand'],['kucuk','little','mini'],['ilk','first'],['tek','one','uno'],['akilli','smart'],['hizli','fast','speed'],['guzel','beauty','bella'],['saglik','health'],['hayat','life'],['ask','love','amor'],['dost','friend'],['bebek','baby'],['cocuk','kid','kids','child'],['kopek','dog'],['kedi','cat'],['ayi','bear'],['at','horse'],['bulut','cloud'],['ruzgar','wind'],['dag','mountain'],['orman','forest'],['ada','island'],['inci','pearl'],['elmas','diamond'],['demir','iron'],['celik','steel']]
export const DEFAULT_LOW_VALUE_VIENNA   // ['27.05','27.07','29.01','26.01','26.04','26.11'] — puana katkı vermez
export function compareMarks(watch, candidate, opts = {})
  // watch: { name, classes, viennaCodes?, excludeTerms?, watchRelated?, watchType?, reputation?, threshold? }
  // candidate: { markText, classes, viennaCodes?, goodsByClass? }
  // opts: { genericWords, translations, relatedGroups, levels:{yuksek,orta}, lowValueVienna, shapeLevelCap:'orta' }
  // → { score, nameScore, classScore, level, reasons:string[], sharedClasses, kind:'kelime'|'sekil', excluded:false }
  //   | { excluded:true, autoReason:'haric-ibare' }   (excludeTerms eşleşirse — tarayıcı bunu 'otomatik-elendi' kaydeder)
  //   | null  (karşılaştırılamaz: aday ibaresi yok ve şekil kontrolü yok)
  // İBARE (kind 'kelime'):
  //   A=coreText(watch.name), B=coreText(candidate.markText); a,b = boşluksuz; anahtarlar phoneticKeys(ham metin)
  //   ad = max(ratio(a,b), jw(a,b)*0.95, maxPhon*0.97)  — maxPhon = 4 kombinasyonun (tr/en × tr/en) ratio maksimumu
  //   a===b → 1 "Aynı ibare"; anahtarlardan biri eşit → ≥0.95 "Okunuşu aynı"; maxPhon ≥0.8 "Okunuşu benzer";
  //   max(ratio, jw*0.95) ≥0.78 "Yazımı benzer";
  //   içerme: izlenen çekirdek ≥4 harfse b içinde a (ya da fonetik içinde) → ≥0.82+0.1*(min/max) "İbareyi içeriyor";
  //     izlenen çekirdek 2–3 harfse içerme SAYILMAZ, yalnız adayda ayrı kelime olarak birebir geçerse "Ortak kelime";
  //   ortak kelime (≥4 harf, eşit ya da fonetik oran ≥0.85) → ≥0.6+0.3*kapsam "Ortak kelime: X";
  //   çeviri eşdeğeri → ≥0.75 "Anlamı aynı: güneş ↔ sun".
  // SINIF: classRelation(watch.classes, candidate.classes, groups, { allClasses: reputation !== 'yok' });
  //   watchRelated=false ise ilişkili grup 0.15; gerekçe "Ortak sınıf: 3, 44" | "İlişkili sınıf" | "Farklı sınıf";
  //   reputation≠'yok' → "Tanınmış marka: tüm sınıflar (SMK 6/4–6/5)".
  //   35 ortak ve isRetail35 → ek gerekçe "35. sınıf perakende: ilgili mallar".
  // TOPLAM = round(100 * min(1, ad*0.78 + sınıf*0.22*clsW)); clsW = ad≥0.7 ? 1 : max(0,(ad-0.5)/0.2)
  // ŞEKİL (watchType 'kelime-sekil' | 'sekil'): yalnız 3 düzeyli tam ortak Viyana kodları puan verir (düşük değerliler hariç);
  //   2 düzey ortaklık puan vermez. score = 55 + 12*min(2, tamOrtak) + 15*sınıf; seviye en fazla shapeLevelCap ('orta').
  //   gerekçe "Ortak Viyana kodu: 26.04.01". 'kelime-sekil' → ikisinden yüksek olan; 'sekil' → yalnız şekil.
  // Eşik karşılaştırması tarayıcıda yapılır (compareMarks eşik uygulamaz).
export function effectiveThreshold(watch, settings) // watch.threshold ?? settings.esik; tanınmışsa −10; şekil için settings.sekilEsik
```
Testler: prototipteki örnekler (LAVENDA↔LAVANDA/LAWENDA BEAUTY yüksek, NOVATEK↔NOVA TECH
yüksek, MARCAWORLD↔MARKA WORLD yüksek, KAHVE DURAĞI↔KARAKUM eşik altı), kısa marka
(EFE ↔ "EFE KUNDURA" ortak kelime; EFE ↔ "REFERANS" içerme sayılmaz), çeviri
(GÜNEŞ ↔ SUN), tanınmış marka farklı sınıf, şekil düşük değerli kod.

### 5.5 `deadlines.js` (saf)
```js
// Tatil: { date:'YYYY-MM-DD', kind:'tam'|'yarim'|'idari-izin', name }
export const DEFAULT_HOLIDAYS           // 2025–2028: 1 Oca, 23 Nis, 1 May, 19 May, 15 Tem, 30 Ağu, 29 Eki (tam); 28 Eki (yarim);
                                        // Ramazan ve Kurban bayramları: arife 'yarim', bayram günleri 'tam' (Diyanet takvimi; ayarlardan düzenlenir)
export function toDateOnly(d)           // Date|'YYYY-MM-DD'|'DD.MM.YYYY' → Date(UTC 00:00) | null
export function isoDate(d)
export function todayTR(now = new Date())
export function addMonthsClamped(d, n)  // 31.12 + 2 ay → 28/29.02
export function addDays(d, n)
export function holidayOn(d, holidays)  // tatil kaydı | null
export function isWorkingDay(d, holidays) // hafta sonu ve 'tam' → false; 'yarim' ve 'idari-izin' → true (süre uzamaz)
export function computeDue(rawDue, holidays, { judicialRecess = false } = {})
  // → { rawDue, due, shifted:boolean, shiftReason:string|null, halfDay:boolean, warnings:string[] }
  // rawDue tatil/hafta sonu ise ilk iş gününe kayar; son gün 'yarim' ise kaymaz, halfDay=true.
  // judicialRecess (yalnız istinaf/temyiz): son gün 20 Tem–31 Ağu arasındaysa 07 Eylül (HMK 104: tatil bitiminden itibaren 1 hafta), sonra iş günü kaydırması.
  // rawDue yılının dini bayramları listede yoksa warnings: ['2028 yılı bayram günleri tatil listesinde yok']
export function oppositionDeadline(publishDate, holidays)    // SMK 18/1: yayın + 2 ay → computeDue
export function servedDate(deliveredAt, channel)             // 'e-tebligat' → +5 gün (7201 m.7/a); diğer kanallar aynı gün
export const DEADLINE_RULES
  // OppositionEvent.kind + direction + outcome → üretilecek süreler:
  // itiraz-tebligi & gelen → karsi-gorus, 1 ay
  // kullanim-ispati-talebi & giden → kullanim-ispati, periodText'ten (yoksa 1 ay, uyarıyla)
  // kurum-karari-tebligi: outcome ret|kismen-kabul & giden → yidk-itiraz 2 ay; outcome kabul|kismen-kabul & gelen → yidk-itiraz 2 ay
  // karsi-taraf-yidk-itirazi-tebligi → yidk-gorus, periodText'ten (yoksa 1 ay, uyarıyla)
  // yidk-karari-tebligi → dava, 2 ay (SMK 20/3)
  // mahkeme-karari-tebligi → istinaf, 14 gün (adli tatil uygulanır)
  // bam-karari-tebligi → temyiz, 14 gün (adli tatil uygulanır)
export function deadlinesForEvent(event, opposition, holidays)
  // → [{ kind, title, rawDue, due, halfDay, shiftReason, warnings }] — başlangıç servedAt (yoksa servedDate(deliveredAt, channel), yoksa eventDate)
export function parsePeriod(text)       // "1 ay" | "2 ay" | "15 gün" | "2 hafta" → { months } | { days } | null
export function renewalInfo(applicationDate, now)
  // SMK 23: koruma bitişi = başvuru + 10 yıl; talep penceresi bitişten önceki 6 ay; ek süre bitişten sonraki 6 ay
  // → { protectionEnd, windowStart, graceEnd, status:'erken'|'yenileme-donemi'|'ek-sure'|'sona-erdi', daysLeft }
export function useProofRisk(basisRegistrationDate, targetEffectiveDate)  // tescil + 5 yıl ≤ hedef tarihi → true
export function subtractWorkingDays(d, n, holidays)  // iç süreler için (müşteri talimatı = son gün − n iş günü)
export function daysUntil(d, now)
export function formatTR(d)
export function urgencyOf(daysLeft)     // gecti | kritik (≤7) | yakin (≤30) | normal
```
Testler (zorunlu): ay sonu kırpma; son gün Cumartesi → Pazartesi; son gün 29.10
Perşembe → 30.10; son gün 28.10 → 28.10 ve halfDay; Kurban arifesi son gün → kaymaz;
bayram + hafta sonu art arda; idari izin kaydırmaz; e-tebligat +5; istinaf son günü
25.07 → 07.09; yenileme dönemleri; kullanım ispatı riski sınırı.

### 5.6 `parser.js` (saf)
TÜRKPATENT bülten metni INID kodlarıyla gelir. Biçim değişikliklerine dayanıklı;
şüpheli her kayıt uyarı üretir. Gerçek bülten örneği henüz yok: ayrıştırıcı esnek
yazılır, `ayristirma-dene.mjs` ile gerçek PDF'te doğrulanacak.
```js
export function splitRecords(text)      // "(210)" ile başlayan parçalar; ilk (210)'dan önceki metin atılır
export function parseRecord(chunk, { pageNo } = {})
  // → { record|null, warnings:string[] }
  // record: { applicationNo (canonicalAppNo), applicationDate, priorityDate, priorityNo, priorityCountry, markText, markType,
  //           recordType, intlRegNo, classes, goods, goodsByClass, viennaCodes, colors, owner, ownerAddress, attorney, pageNo, rawText }
  // (210) no, (220) tarih, (300)/(310)/(320)/(330) rüçhan, (511) sınıflar + mal/hizmet (sınıf başlıklarına göre goodsByClass:
  //   "Sınıf 03:" / "03 -" / satır başında "3." / "Class 3"), (531) Viyana (\d{1,2}\.\d{1,2}(\.\d{1,2})?), (540) ibare,
  // (541)/(546) alternatif ibare, (550)/(551) tür, (591) renk, (731)/(732) sahip (ilk satır ad, kalanı adres), (740) vekil.
  // Etiket sonrası "Başvuru Numarası :" gibi başlıklar atılır. Tanınmayan başvuru no biçimi → uyarı + kayıt atlanır.
  // Uyarılar: 'ibare-yok' (salt şekil olabilir), 'sinif-yok', 'tarih-okunamadi', 'sahip-yok', 'no-bicimi'.
export function parseBulletinText(text, { pageOffsets } = {})
  // → { records, warnings:[{applicationNo?, pageNo?, code, message}], stats:{ chunks, parsed, withoutText, withoutClasses, duplicates } }
  // pageOffsets [{pageNo, offset}] ile her kayda pageNo atanır. Aynı no iki kez → sonuncusu kalır + uyarı.
export function parseCsv(text)          // ; , sekme | ayırıcı; başlık varsa sütun eşler (basvuru no|marka|siniflar|sahip|tarih|vekil|viyana|mal-hizmet); yoksa sıra: no;marka;sınıflar;sahip
export function detectBulletinMeta(text) // ilk sayfalardan { number?, publishDate?, year?, seq? }
export function recordContentHash(record) // text.sha1 ile kanonik alanların özeti
```
Testler: sentetik INID kayıtları (çok satırlı sahip/adres, sınıf başlıkları, Viyana,
rüçhan, eksik alanlar, iki sayfaya bölünmüş kayıt birleştirme), CSV başlıklı/başlıksız.

### 5.7 `pdf-text.js` (yalnız Node)
```js
export async function openPdf(input)    // dosya yolu | Buffer (Buffer → geçici dosyaya yazılır). Önce worker'ı statik import eder:
                                        // const w = await import('pdfjs-dist/legacy/build/pdf.worker.mjs'); globalThis.pdfjsWorker = w;
                                        // getDocument({ url|data, isEvalSupported:false, disableFontFace:true, useSystemFonts:false,
                                        //   standardFontDataUrl:<node_modules/pdfjs-dist/standard_fonts/>, verbosity:0 })
export async function* pdfPages(input, { startPage = 1, endPage } = {})
  // { pageNo, text, numPages, itemCount } — satır kurma: öğeler Math.round(y/2) kovalarına; kovalar y azalan, kova içi x artan;
  // sayfanın üst %4 ve alt %4'ündeki öğeler (üst/alt bilgi) atılır. Her 100 sayfada doc.cleanup(); sonda doc.destroy().
export async function pdfToText(input, opts) // küçük dosyalar (≤20 MB): { text, pageOffsets, numPages, emptyPages:number[] }
```

### 5.8 `settings.js` (Node, Prisma)
```js
export const DEFAULT_SETTINGS = {
  esik: 60, sekilEsik: 75, seviyeler: { yuksek: 80, orta: 65 },
  genelKelimeler: DEFAULT_GENERIC_WORDS, ceviriler: DEFAULT_TRANSLATIONS,
  iliskiliSiniflar: DEFAULT_RELATED_GROUPS, viyanaDusukDegerli: DEFAULT_LOW_VALUE_VIENNA,
  tatiller: DEFAULT_HOLIDAYS,
  icSureler: { musteriTalimatiIsGunu: 10, dosyaHazirlikIsGunu: 3, acilEsikGun: 21 },
  bildirim: { personelEpostalari: [], gunlukOzet: true, musteriyeOtomatik: false, otomatikSeviyeler: ['yuksek'],
              hatirlatmaGunleri: [30, 14, 7, 3, 1], musteriHatirlatmaIsGunu: 5 },
  kaynak: { bultenListeUrl: 'https://www.turkpatent.gov.tr/bultenler', izinliAlanlar: ['turkpatent.gov.tr'],
            otomatikIndir: true, beklenenBultenAraligiGun: 21 },
  firma: { ad: 'Marcaworld', telefon: '', eposta: '', adres: '', web: '', vekilAdlari: [] },
  ucretler: { yil: null, itirazResmiHarc: null, itirazVekalet: null, yidkResmiHarc: null, yidkVekalet: null,
              yenilemeResmiHarc: null, yenilemeVekalet: null, kdvOrani: 20 },   // resmi tutarlar her yıl elle girilir, uydurulmaz
  kvkk: { surum: '2026-1', aydinlatmaMetni: '', veriIsleyenler: [] },
  saklamaSuresiYil: 10,
  kapsamNotu: 'Bu izleme TÜRKPATENT Resmi Marka Bülteni\'nde yayımlanan ulusal başvuruları kapsar; Madrid (uluslararası) kayıtları ve tescilli markalar sicili kapsam dışıdır.',
}
export async function getSettings(prisma)            // DB anahtarları varsayılanların üstüne (anahtar bazında)
export async function saveSetting(prisma, key, value) // bilinmeyen anahtar → Error
export function matchOptions(settings)               // compareMarks opts
export async function heartbeat(prisma, name)        // PlatformSetting 'izleme.sonCalisma' içine { [name]: ISO } yazar
export async function getHeartbeats(prisma)
```

### 5.9 `matcher.js` (Node, Prisma)
```js
export function buildCandidateIndex(records, opts)
  // records: [{ id, markText, markNorm, markPhon, markPhonEn, classes, viennaCodes, owner, attorney, applicationNo, applicationDate, priorityDate }]
  // bigram ters indeksi (compact core + iki fonetik anahtar; belge frekansı %5'i aşan bigramlar durak sayılır),
  // ≤3 harfli ibareler için tam/fonetik eşitlik kovası, kelime indeksi (çeviri + ortak kelime), Viyana 3 düzey indeksi
export function candidatesFor(index, watch, opts)  // aday id kümesi; ortaklık = |ortak| / |izlenen bigramları| ≥ 0.3 vb.
export async function scanBulletin(prisma, bulletinId, { markIds, cursor, maxMs, onProgress, settings, origin = 'bulten' } = {})
  // Kayıtları yalnız gerekli alanlarla çeker. Aktif, arşivsiz, onaylı, izleme süresi dolmamış markaları id sırasıyla 200'lük partilerle işler.
  // Her aday için compareMarks → eşik (effectiveThreshold) → kıdem (seniority), kullanım ispatı riski, çıkar çatışması (conflict),
  // müvekkilin kendi başvurusu: owner normalize hali ownerAliases/müvekkil adıyla BİREBİR aynı → status 'otomatik-elendi', autoReason 'kendi-basvurusu-kesin';
  //   benzer (ratio ≥0.9) → yalnız gerekçe "Sahip müvekkile benziyor — kontrol edin" (gizlenmez);
  // aynı applicationNo bir WatchedMark.applicationNo ise eşleşme açılmaz: marka 'yayinda' yapılır + Activity + personel bildirimi.
  // Yazım: parti başına tek SQL upsert (INSERT ... SELECT FROM jsonb_to_recordset ... ON CONFLICT (watchedMarkId, bulletinMarkId) DO UPDATE
  //   SET yalnız puan alanları + lastScannedAt + stale=false), RETURNING (xmax = 0) AS inserted. Prisma.sql/Prisma.join; $queryRawUnsafe YASAK.
  // Yeni eşleşmeye: deadline = bulletin.oppositionDeadline, urgent (kalan ≤ acilEsikGun), assigneeId = client.responsibleId,
  //   instructionDue = subtractWorkingDays(deadline, musteriTalimatiIsGunu), origin.
  // Tarama sonunda bu bültende güncellenmeyen 'yeni' eşleşmeler stale=true. maxMs dolarsa { done:false, cursor } döner.
  // → { done, cursor, compared, candidates, created, updated, autoDismissed, ownFilings }
export async function scanMarksAgainstOpenBulletins(prisma, markIds, opts)
  // itiraz süresi dolmamış bültenlerde yeni/değişen markalar için tarama (origin 'ilk-tarama')
export async function findSimilar(prisma, { name, classes = [], limit = 50, minScore = 45, onlyOpen = false, settings })
  // $transaction([ set_config('pg_trgm.similarity_threshold','0.2',true), SELECT ... WHERE markNorm % $n OR markPhon % $p OR markPhonEn % $e
  //   OR <≥4 harfli kelime ve çevirileri için ILIKE (escapeLike)> ORDER BY greatest(similarity(...)) DESC LIMIT 3000 ]) → compareMarks
  // → { results:[{ record (+ bulletin {number, publishDate, oppositionDeadline}), score, level, reasons, sharedClasses }], coverage }
export async function searchCoverage(prisma) // { firstBulletin, lastBulletin, bulletinCount, recordCount, missingNumbers }
export function escapeLike(s)
```

### 5.10 `ingest.js`, `sources/turkpatent.js`, `jobs.js` (Node, Prisma)
```js
// ingest.js
export function storageDir()                         // IZLEME_STORAGE_DIR || <cwd>/storage/bultenler (Vercel'de /tmp/izleme)
export async function createOrGetBulletin(prisma, { number, publishDate, publishDateSource, sourceUrl, fileName, notes })
  // number kanonik; (type, number) çakışırsa mevcut döner (P2002 yakalanır). oppositionDeadline/deadlineRaw/deadlineHalfDay ayarlardaki tatillerle.
export async function upsertRecords(prisma, bulletinId, records, { importRun, batchSize = 500 })
  // markNorm, markPhon(Tr), markPhonEn, contentHash hesaplar; tek SQL toplu upsert (jsonb_to_recordset, ON CONFLICT (bulletinId, applicationNo)
  // DO UPDATE ... WHERE contentHash farklı ya da importRun farklı). rawText: uyarılı kayıtta tam, diğerlerinde ilk 2000 karakter.
  // recordCount = SELECT count(*)::int ile.
export async function ingestPdfFile(prisma, bulletinId, filePath, { maxMs, onProgress, lockCheck } = {})
  // resumePage'den başlar; 25 sayfalık partiler; yarım kalan kayıt (carry) bir sonraki partiye taşınır; resumePage = carry ? carry.startPage : son+1.
  // Her partide lockCheck() (iş kilidi hâlâ bizde mi) false dönerse durur. Sonunda kalite kapısı (qualityGate). → { done, pagesDone, records, warnings }
export async function ingestText(prisma, bulletinId, text, { format = 'auto' })  // 'inid' | 'csv' | 'auto'
export function qualityGate(stats, history)   // → { ok, reasons[] } — kayıt < 0.3×medyan(son 5), (ibaresiz+sınıfsız)/kayıt > %5, metinsiz sayfa > %2
export async function downloadPdf(url, { allowedHosts, maxBytes = 600 * 1024 * 1024, timeoutMs = 600000, onProgress })
  // yalnız https + izinli alan adları (alt alan adları dahil); yönlendirmeler elle (redirect:'manual'), her adımda tekrar kontrol;
  // DNS çözümü özel/loopback IP ise reddet; stream → <storageDir>/<uuid>.part; sha256 + bayt sayacı; ilk 5 bayt "%PDF-" olmalı;
  // en çok 3 deneme (üstel bekleme). → { filePath, sha256, size }
export async function sha256File(path)

// sources/turkpatent.js
export async function fetchBulletinList({ listUrl, fetchImpl = fetch })
  // → { items:[{ number, publishDate|null, url, title }], warnings:[] } — HTML beklenmedikse items boş + uyarı (uydurma veri YOK)
export async function checkForNewBulletins(prisma, { settings, fetchImpl })
  // yeni bültenler için Bulletin(status 'bekliyor', publishDateSource 'liste'|'tahmin') + Job 'bulten-indir';
  // liste boş / ayrıştırılamaz / en son yayın beklenenBultenAraligiGun'den eski → sistem-uyarisi bildirimi + { alarm }
export function findMissingNumbers(numbers)  // ardışık seq/numaralarda boşluklar

// jobs.js
export async function enqueue(prisma, kind, { bulletinId, payload, runAfter } = {})
  // dedupeKey = `${kind}:${bulletinId ?? '-'}`; $transaction içinde pg_advisory_xact_lock(hashtext(dedupeKey)) → açık iş varsa onu döner
export async function claimJob(prisma, { kinds, workerId })
  // UPDATE "Job" SET status='calisiyor', lockToken, lockedBy, heartbeatAt=now(), attempts+1 WHERE id = (SELECT ... WHERE kind = ANY(kinds)
  // AND runAfter<=now() AND (status='bekliyor' OR (status='calisiyor' AND heartbeatAt < now()-interval '3 minutes')) ORDER BY öncelik, createdAt
  // FOR UPDATE SKIP LOCKED LIMIT 1) RETURNING *
export async function heartbeatJob(prisma, job, { progress, message, payload })  // lockToken eşleşmezse false (fencing)
export async function finishJob(prisma, job, { ok, error, next })   // hata: attempts < maxAttempts → bekliyor + runAfter = now + 2^attempts dk; aksi 'hata' + personel uyarısı
export async function runPendingJobs(prisma, { maxMs, kinds, workerId })  // claim → runJob döngüsü; → özet
export async function runJob(prisma, job, ctx)  // tür → işleyici: bulten-kontrol, bulten-indir, bulten-ayristir, bulten-tara, marka-gecmis-tara, hatirlatma, gunluk-ozet, bakim
export async function triggerWorker()           // GH_DISPATCH_TOKEN + GH_REPO varsa workflow_dispatch; yoksa no-op (VPS işçisi zaten yokluyor)
export function webSafeKinds()                  // constants.WEB_SAFE_JOB_KINDS
```
Ardışık akış: `bulten-indir` → `bulten-ayristir` → `bulten-tara` → (tarama bitince)
personel bülten özeti + koşullar uygunsa otomatik müşteri bildirimi
(`publishDateConfirmedAt` dolu, durum `tamamlandi`, ayar `musteriyeOtomatik`).

### 5.11 `notify.js` (Node, Prisma) — outbox
```js
export function emailConfigured()
export async function deliver(prisma, { dedupeKey, channel='email', kind, to, subject, html, text, clientId, matchId, staffId, createdBy })
  // 1) INSERT ... ON CONFLICT (dedupeKey) DO NOTHING RETURNING id (prisma create + P2002 yakala); kayıt zaten varsa { skipped:'duplicate' }
  // 2) SMTP yoksa status 'atlandi' (error 'SMTP ayarlanmadı'); alıcı yoksa 'atlandi' ('E-posta adresi yok'); 3) gönder → 'gonderildi'|'hata'
  // → { id, status, error }
export function whatsappLink(phone, text)
export function matchEmail({ client, groups, settings, portalUrl })  // başvuru bazında gruplu (bir başvuru birden çok markayla), sade Türkçe
export async function notifyClientMatches(prisma, matchIds, { actor })
  // müvekkil başına tek e-posta; alıcılar: ClientContact.receivesMatches + Client.email; dedupeKey `musteri-eslesme:<clientId>:<sha1(sıralı ids)>`
  // conflict dolu (kilidi açılmamış) veya bülten tarihi onaysız ya da seniority 'sonraki' eşleşmeler HARİÇ (sebebiyle döner)
  // yalnız Notification 'gonderildi' ise eşleşmeler 'musteriye-bildirildi' + notifiedAt + notifyChannel 'eposta'
  // → { results:[{ clientId, sent:boolean, reason?:'smtp-yok'|'eposta-yok'|'bildirim-kapali'|'hata'|'kilitli', matchIds }] }
export async function recordManualNotice(prisma, matchIds, { channel, note, actor })  // elle bildirim: Notification(channel 'elle', gonderildi) + durum
export async function notifyStaffBulletinScanned(prisma, bulletinId)   // dedupe `bulten-tarandi:<bulletinId>`
export async function sendDeadlineReminders(prisma, { now })
  // her açık süre için daysLeft ≤ eşik olan EN KÜÇÜK eşik; dedupe `sure:<deadlineId>:<eşik>`; alıcı: atanan + personel listesi
export async function sendClientDecisionReminders(prisma, { now })    // bildirimden musteriHatirlatmaIsGunu sonra, instructionDue − 2 iş günü son hatırlatma
export async function sendEscalations(prisma, { now })                // yeni/inceleniyor & kalan ≤21 → atanan; ≤14 → yöneticiler; itiraz-edilecek & dosyalanmamış & ≤7 → kritik
export async function sendDailyDigest(prisma, { now })                // dedupe `ozet:<YYYY-MM-DD>:<email>`
export async function sendRenewalNotices(prisma, { now })             // 6 ay ve 3 ay kala receivesRenewals kişilere
export async function notifyStaffSignup(prisma, { clientId })         // saatlik toplu: dedupe `site-talebi:<YYYY-MM-DDTHH>`
export async function sendTestEmail(prisma, to, actor)
export function appUrl()
```
E-postalar düz, okunur HTML (inline stil), altta firma bilgisi ve kapsam notu.

### 5.12 `report.js` (Node)
```js
export function registerFonts(doc)       // 'Regular' = DejaVuSans, 'Bold' = DejaVuSans-Bold (node_modules/dejavu-fonts-ttf/ttf)
export async function clientReportPdf(prisma, { clientId, bulletinId, matchIds, statuses })  // → Buffer
  // Kapak: firma, müvekkil, tarih, "Kararınızı bekleyen N başvuru, en yakın talimat günü GG.AA.YYYY".
  // Başvuru bazında bloklar: iki ibare yan yana, sade gerekçe, ortak sınıflar + mal/hizmet metinleri, iki tarafın başvuru/rüçhan tarihleri,
  // kıdem ve kullanım ispatı uyarıları, öneri rozeti, uzman görüşü (clientSummary — iç not ASLA), maliyet (quote),
  // "Yasal son gün: GG.AA.YYYY (SMK m.18) — Talimat son günü: GG.AA.YYYY", portal karar bağlantısı + QR (qrcode).
  // 'gerek-yok' önerilenler ekte kısa tabloda. Sonda kapsam notu ve sorumluluk notu.
export async function searchReportPdf({ query, classes, results, coverage, settings })  // ön araştırma raporu; kapakta zorunlu kapsam kutusu
export async function decisionLogPdf(prisma, { clientId })   // müvekkil karar geçmişi tutanağı (ClientDecision + bildirimler)
export function toCsv(rows, columns)     // '﻿' + ';' ayırıcı, CRLF, alan kaçışı
```

### 5.13 `activity.js`, `ratelimit.js` (Node, Prisma)
```js
export async function logActivity(prisma, { actor, action, entity, entityId, summary, detail })  // hata yutar
export function diff(before, after, keys)   // { alan: [eski, yeni] } yalnız değişenler
export async function hit(prisma, key, { limit, windowSec = 60 })  // RateLimit tek SQL upsert → { allowed, count }
export async function cleanupRateLimits(prisma)                    // 2 günden eski satırlar
```

### 5.14 `transitions.js` (saf) — eşleşme durum makinesi
```js
export function canTransition(from, to, { role, level, score, hasDismissReason, hasDecisionOrReason, conflictLocked })
  // → { ok, error?, effectiveTo? }
  // Kurallar:
  //  - 'ilgisiz' için dismissReason zorunlu; level 'yuksek' ya da score ≥ 80 ise effectiveTo = 'ilgisiz-onay-bekliyor'
  //    (aynı kişi onaylayamaz: ikinci onay farklı personel ve 'eslesme.ilgisiz-onayla' yetkisi)
  //  - 'musteriye-bildirildi', 'itiraz-edilecek', 'itiraz-edilmeyecek', 'itiraz-edildi' → conflictLocked ise reddedilir
  //  - 'itiraz-edilmeyecek' için ClientDecision ya da iç gerekçe (note) zorunlu
  //  - 'itiraz-edildi' yalnız bağlı itiraz dosyası 'dosyalandi' olduğunda (sunucu kontrol eder)
  //  - asistan: yalnız yeni/inceleniyor/ilgisiz(-onay-bekliyor)
export function decisionToStatus(decision)  // itiraz-istiyor → 'itiraz-edilecek'; istemiyor → 'itiraz-edilmeyecek'; gorusmek-istiyor → null (durum değişmez, görev)
```

### 5.15 `deadline-store.js` (Node, Prisma)
```js
export async function upsertAutoDeadline(prisma, { sourceKey, kind, title, rawDue, due, halfDay, shiftReason, clientId, watchedMarkId, oppositionId, matchId, eventId, assigneeId, internal, remindDays })
export async function syncRenewalDeadlines(prisma, watchedMarkId)   // 'yenileme' (remind [180,90,30,7]) + 'yenileme-ek-sure' + 'kullanmama-riski' (tescil+5 yıl, [90,30]) + 'izleme-bitis'
export async function ensureMatchDeadlines(prisma, matchId)         // itiraz-edilecek olunca: 'itiraz' (yasal) + 'dosya-hazirlik' (iç) — sourceKey `itiraz:<matchId>`
export async function applyOppositionEvent(prisma, eventId)         // DEADLINE_RULES ile süre üretir/günceller; event.servedAt hesaplanır
export async function closeDeadlinesFor(prisma, { matchId, oppositionId, kinds, actor })
```

## 6. Düzenli çalışma (zamanlama) ve işçi

Büyük bülten PDF'leri (100–200 MB) sunucusuz ortamda işlenemez. Topoloji:

| Rol | Nerede | Ne yapar |
|---|---|---|
| web | Vercel / `next start` | Arayüz + API; yalnız `WEB_SAFE_JOB_KINDS`; ağır işi kuyruğa koyup `triggerWorker()` |
| işçi | GitHub Actions (`marka-bulteni.yml`) ya da VPS (`worker.mjs`, systemd) | Tüm işler; PDF indir, oku, tara, bildir |

- **GitHub Actions:** `on.schedule: '15 3,15 * * *'` (06:15 ve 18:15 TR) +
  `workflow_dispatch` (girdiler: `pdf_url`, `sayi`, `tarih`); `concurrency: marka-bulteni`;
  `permissions: contents: read`; `timeout-minutes: 120`; Node 22; `npm ci` →
  `npx prisma generate` → `node scripts/izleme/gunluk.mjs` (girdi değerleri `env:`
  üzerinden, komut satırına doğrudan gömülmez) → `if: failure()` uyarı adımı.
  `NODE_OPTIONS=--max-old-space-size=3072`. Secrets: `DIRECT_URL` (DATABASE_URL olarak),
  `SMTP_*`, `APP_URL`, `HEALTHCHECK_URL`.
- **`gunluk.mjs`:** `bulten-kontrol` → bekleyen tüm işleri bitene ya da 100 dakikaya
  kadar çalıştır → hatırlatma/eskalasyon/özet/yenileme → `heartbeat('isci')` →
  `HEALTHCHECK_URL` ping. Bayraklar: `--sadece-kontrol`, `--pdf-url U --sayi N --tarih T`,
  `--dry-run` (DB'ye yazmadan kontrol).
- **VPS:** `worker.mjs` döngü (claim → çalıştır → iş yoksa 60 sn bekle), SIGTERM'de
  temiz çıkış. `docs/marka-izleme/KURULUM.md` systemd birimi örneği verir.
- **Vercel cron:** tek uç `/api/izleme/cron/gunluk` (`0 5 * * *` = 08:00 TR):
  bülten kontrolü + hatırlatma + eskalasyon + özet (her biri ayrı try/catch;
  bildirimler dedupe'lu olduğu için işçiyle çift çalışması zararsızdır).
  `vercel.json` → `"regions": ["fra1"]`.
- **Sağlık:** `GET /api/izleme/health` (CRON_SECRET): son başarılı kontrol 36 saatten
  eskiyse 503. Pano aynı bilgiyi gösterir.

Komut satırı (`scripts/izleme/`): `gunluk.mjs`, `worker.mjs`,
`bulten-ice-aktar.mjs <pdf|url|csv> --sayi N --tarih YYYY-MM-DD [--tara] [--sayfa 1-50]`,
`tara.mjs <bültenNo|--hepsi>`, `ornek-veri.mjs [--sil]` (isSample müvekkiller, markalar,
kurgusal "ÖRNEK" bülten, eşleşmeler), `ayristirma-dene.mjs <pdf> --sayfa 10-14`
(DB'ye yazmadan kayıtlar, uyarılar, ibaresiz/sınıfsız sayıları, metinsiz sayfalar).

## 7. API (`app/api/izleme/...`)

Kurallar: JSON; hata `{ error: 'Türkçe, ne yapılacağını söyleyen mesaj' }`;
koruma `const { staff, error } = await requireStaff(request, '<eylem>'); if (error) return error;`
Değiştiren her uç `logActivity` (detail.changes ile). Listeler `?page=&pageSize=` →
`{ items, total, page, pageSize }`. PATCH gövdeleri `expectedUpdatedAt` taşıyabilir →
`staleCheck` 409. Toplu uçlar `{ ok:[ids], failed:[{id, error}] }` döner.

| Yol | Yöntem | Sahip ajan | Açıklama |
|---|---|---|---|
| `/api/izleme/stats` | GET | UI-1 | `{ risk, workload, funnel, revenue, health, upcoming, activity, setup }` |
| `/api/izleme/health` | GET | INGEST | CRON_SECRET; sağlık özeti, eskiyse 503 |
| `/api/izleme/settings` | GET, PUT | UI-1 | PUT `{ key, value }` (ayar.degistir) |
| `/api/izleme/settings/test-email` | POST | UI-1 | `{ to }` |
| `/api/izleme/staff` | GET, POST | UI-1 | ekip listesi / yeni kullanıcı (ad, e-posta, geçici şifre, rol) |
| `/api/izleme/staff/[id]` | PATCH | UI-1 | rol, aktiflik, şifre sıfırlama, calendarKey yenile |
| `/api/izleme/sample` | POST, DELETE | UI-1 | örnek veri yükle / sil (ornek-veri modülünü çağırır) |
| `/api/izleme/jobs` | GET | INGEST | son 50 iş |
| `/api/izleme/jobs/run` | POST | INGEST | web-güvenli işleri şimdi çalıştır + işçiyi tetikle |
| `/api/izleme/bulletins` | GET, POST | INGEST | POST: multipart PDF (VPS/yerel; Vercel'de 4 MB sınırı açıklanır) **ya da** `{ number, publishDate, url }` **ya da** `{ number, publishDate, text, format }` |
| `/api/izleme/bulletins/[id]` | GET, PATCH, DELETE | INGEST | PATCH: number, publishDate (+ `confirmDate:true` onay), notes; DELETE kuralı §4 |
| `/api/izleme/bulletins/[id]/marks` | GET | INGEST | `?q=&class=&warn=1&page=` |
| `/api/izleme/bulletins/[id]/scan` | POST | INGEST | yeniden tara (küçükse senkron, büyükse iş) |
| `/api/izleme/bulletins/[id]/file` | GET | INGEST | yerel kopya varsa PDF akışı (sayfa bağlantısı `#page=N`) |
| `/api/izleme/bulletins/check` | POST | INGEST | kaynağı şimdi kontrol et |
| `/api/izleme/bulletin-marks/[id]` | PATCH | INGEST | kayıt düzeltme (markText, classes, viennaCodes, owner) → yeniden normalize + yalnız o kaydı tara |
| `/api/izleme/cron/[task]` | GET | INGEST | `gunluk` \| `bulten-kontrol` \| `isler` \| `hatirlatma` \| `ozet`; CRON_SECRET |
| `/api/izleme/matches` | GET | MATCH-UI | filtreler: bulletinId, clientId, watchedMarkId, status (virgüllü), level, kind, q, assignee (me\|none\|id), clientDecision, minScore, maxScore, class, daysLeftLte, notifyFailed, dismissReason, conflict, origin, stale, sort (deadline\|score\|created), group=basvuru; varsayılan `otomatik-elendi` ve stale gizli, sayıları `meta.hidden` |
| `/api/izleme/matches/[id]` | GET, PATCH | MATCH-UI | PATCH: status (+dismissReason), note, assigneeId, recommendation, clientSummary, quote, expectedUpdatedAt; durum makinesi |
| `/api/izleme/matches/[id]/second-review` | POST | MATCH-UI | `{ approve:boolean }` ilgisiz ikinci onayı |
| `/api/izleme/matches/[id]/decision` | POST | MATCH-UI | personel karar kaydı `{ decision, source, decidedBy, note }` |
| `/api/izleme/matches/[id]/conflict` | POST | MATCH-UI | çatışma kilidini aç `{ reason }` (yönetici) |
| `/api/izleme/matches/bulk` | POST | MATCH-UI | `{ ids \| filter, action: 'durum'\|'ata'\|'not'\|'bildir'\|'elle-bildirildi'\|'haric-tut'\|'sahip-alias', value }` |
| `/api/izleme/views` | GET, POST | MATCH-UI | kayıtlı görünümler |
| `/api/izleme/views/[id]` | DELETE | MATCH-UI | |
| `/api/izleme/oppositions` | GET, POST | OPP-UI | POST `{ matchIds:[…] }` (aynı başvuru + müvekkil) ya da elle (gelen itiraz dahil) |
| `/api/izleme/oppositions/[id]` | GET, PATCH | OPP-UI | 'dosyalandi' için filedAt + feePaidAt (≤ deadline) + officeRefNo zorunlu (422); arşiv = PATCH archived |
| `/api/izleme/oppositions/[id]/events` | POST | OPP-UI | olay ekle → `applyOppositionEvent` |
| `/api/izleme/oppositions/[id]/bases` | POST, DELETE | OPP-UI | dayanak ekle/çıkar |
| `/api/izleme/deadlines` | GET, POST | OPP-UI | `?from=&to=&status=&kind=&clientId=&assignee=` |
| `/api/izleme/deadlines/[id]` | PATCH | OPP-UI | tamamla / ertele (gerekçe zorunlu) / iptal |
| `/api/izleme/takvim.ics` | GET | OPP-UI | `?k=<calendarKey>` kişisel iCal (middleware dışı değil — anahtar ile; bkz. not) |
| `/api/izleme/documents` | GET, POST | OPP-UI | multipart ≤ 4 MB; `entity, entityId, kind, visibleToClient` |
| `/api/izleme/documents/[id]` | GET | OPP-UI | indir (personel) |
| `/api/izleme/clients` | GET, POST | CLIENT-UI | `?q=&archived=` |
| `/api/izleme/clients/[id]` | GET, PATCH | CLIENT-UI | arşiv/anonimleştir eylemleri PATCH `{ action }` |
| `/api/izleme/clients/[id]/portal` | POST | CLIENT-UI | yeni portal bağlantısı (düz token yalnız yanıtta) / kapat |
| `/api/izleme/clients/[id]/contacts` | POST | CLIENT-UI | kişi ekle; `/contacts/[cid]` PATCH, DELETE |
| `/api/izleme/clients/[id]/decision-log` | GET | CLIENT-UI | karar geçmişi PDF |
| `/api/izleme/marks` | GET, POST | CLIENT-UI | POST → `syncRenewalDeadlines` + `enqueue('marka-gecmis-tara')` |
| `/api/izleme/marks/[id]` | GET, PATCH | CLIENT-UI | |
| `/api/izleme/marks/import` | POST | CLIENT-UI | iki adım: `dryRun:true` → önizleme; `dryRun:false` → uygula (`importBatchId`) |
| `/api/izleme/marks/import/[batchId]` | DELETE | CLIENT-UI | 24 saat içinde içe aktarımı geri al (arşivler) |
| `/api/izleme/marks/export` | GET | CLIENT-UI | CSV |
| `/api/izleme/search` | GET, POST | MATCH-CORE | POST `{ name, classes, onlyOpen, clientId }` → sonuçlar + coverage + Search kaydı; GET geçmiş |
| `/api/izleme/search/[id]/pdf` | GET | MATCH-CORE | kayıtlı aramanın PDF'i |
| `/api/izleme/reports/client/[id]` | GET | MATCH-CORE | `?bulletinId=&statuses=` → PDF |
| `/api/izleme/export/matches` | GET | MATCH-CORE | eşleşme filtreleriyle CSV (disa.aktar) |
| `/api/izleme/notifications` | GET, PATCH | MATCH-CORE | personel panel bildirimleri + bildirim günlüğü (`?log=1`) |
| `/api/izleme/portal/[token]` | GET | CLIENT-UI | müşteri görünümü (§9) |
| `/api/izleme/portal/[token]/decision` | POST | CLIENT-UI | `{ matchId, decision, decidedBy, note }` |
| `/api/izleme/portal/[token]/marks` | POST | CLIENT-UI | yeni marka izleme talebi (pendingApproval) |
| `/api/izleme/portal/[token]/report` | GET | CLIENT-UI | bekleyen kararlar raporu PDF |
| `/api/izleme/public/signup` | POST | CLIENT-UI | genel form (§9) |

Not: `takvim.ics` middleware'de personel çerezi istemesin diye yol
`/api/izleme/public/takvim.ics` olarak açılır (anahtarla korunur).

## 8. Arayüz kuralları

- Sayfalar `app/izleme/layout.js` kabuğunda; `iz-` sınıfları; `export const dynamic = 'force-dynamic'`.
- Sunucu bileşeni Prisma ile okur; etkileşim `components/izleme/<Alan>*.js` (`'use client'`)
  içinde `api()` ile; başarıdan sonra `router.refresh()` (triyajda iyimser güncelleme, §8.1).
- Ortak bileşenler (HAZIR):
  - `components/izleme/format.js`: `fmtDate, fmtDateTime, fmtAgo, fmtNum, fmtMoney, todayTRDate, daysLeft, urgency, daysLeftText, qs, truncate`
  - `components/izleme/parts.js`: `PageHeader({title, description, crumbs, actions})`, `Stats`, `Stat({label,value,sub,tone,href})`,
    `LevelPill({level, score, bar})`, `StatusBadge({value, list, tone})`, `ClassChips({classes, highlight})`, `Reasons({reasons})`,
    `DeadlineCell({date, done})`, `EmptyState({title, children, action})`, `Card({title, sub, actions, flush, id})`,
    `Field({label, htmlFor, hint, error})`, `Toolbar`, `DefList({items})`, `Alert({tone})`, `Progress({value})`
  - `components/izleme/interactive.js`: `api, download, ToastProvider, useToast, useAction, Modal, ConfirmButton,
    useQueryUpdater, Pagination, SearchBox, FilterSelect`
- Yetkiye göre düğmeler gizlenmez, **devre dışı** gösterilir ve `title` ile nedeni yazılır
  (sayfa `getStaffFromCookies()` + `can()` ile hesaplar, prop olarak geçer).
- Yarım gün son günlerde `DeadlineCell` yanına "Son gün yarım gün — en geç 12:00'de dosyalayın" uyarısı.
- Dil: Türkçe, sade, kullanıcıdan bakarak. Hata ne olduğunu ve ne yapılacağını söyler.
  Tarih `GG.AA.YYYY`, sayılar `tr-TR`.
- Boş durumlar ayırt edilir: hiç veri yok / sistem hata verdi / tarandı ama eşleşme yok
  (kaç marka × kaç kayıt karşılaştırıldı, eşik) / filtre boş / kuyruk temiz.
- Kabukta kapatılamaz bant: SMTP ayarlı değilse "E-posta ayarlanmadı: müşterilere bildirim gitmiyor".
  (Bant UI-1 tarafından `components/izleme/SystemBanner.js` olarak yazılır, layout'a eklenir.)
- 1024 px ve 400 px genişlikte kullanılabilir; tablolar `.iz-table-wrap` içinde.

### 8.1 İnceleme kuyruğu (MATCH-UI)
İki bölme: solda sıkı liste (varsayılan sıra son gün artan, puan azalan), sağda
karşılaştırma paneli (iki ibare büyük, okunuş anahtarları, gerekçeler, puan kırılımı,
ortak sınıf + mal/hizmet metinleri yan yana ortak kelimeler vurgulu, sahip/vekil,
kıdem ve kullanım ispatı rozetleri, çatışma kilidi, "Bültende gör (sayfa N)",
ham metin aç/kapa, aynı sahiple önceki eşleşmeler, "daha önce ilgisiz sayıldı" ipucu,
zaman çizelgesi). Kısayollar: `j/k` gezin, `x` seç, `Shift+x` aralık, `Enter` tam sayfa,
`i` ilgisiz (1–7 gerekçe), `r` inceleniyor, `e` itiraz edilecek, `b` bildirim sepeti,
`a` bana ata, `n` not, `z` geri al, `/` ara, `?` yardım; input odaktayken kapalı.
İşlemler iyimser; 8 sn "Geri al" toast'u. Kayıtlı görünüm sekmeleri (sayaçlı) +
hazır görünümler: "Bana atanan yeniler", "Son bülten – yüksek", "Müşteri yanıtı bekleyen",
"Müşteri itiraz istedi – dosya açılmamış", "Son güne ≤14 gün", "Bildirim başarısız",
"Çıkar çatışması", "İlk tarama". "Başvuruya göre grupla" anahtarı. 400 px'te panel tam sayfa.

## 9. Güvenlik, KVKK, portal

- Personel: JWT çerezi + `AdminUser.active`; rol `izlemeRole` (admin → yönetici).
- Cron: yalnız `Authorization: Bearer CRON_SECRET` (≥32 karakter), sabit zamanlı karşılaştırma.
- Portal: `portalTokenHash` (sha256), 180 gün geçerli; yanıt başlıkları
  `Referrer-Policy: no-referrer`, `X-Robots-Tag: noindex, nofollow`, `Cache-Control: private, no-store`.
  Karar yazımı tek koşullu `updateMany` (eşleşme bu müvekkile ait, durum bildirilmiş/kararlı,
  son gün geçmemiş) → aksi 404/409. Karar ClientDecision'a (ipHash, userAgent, snapshot) eklenir;
  `decisionToStatus` uygulanır; sorumlu uzmana panel + e-posta. `clientViewedAt` ilk görüntülemede.
  Oran sınırı: token başına dakikada 30, geçersiz token IP başına saatte 20 (`ratelimit.hit`).
  Portal sekmeleri: Kararınızı bekleyenler (geri sayım, uzman görüşü, maliyet, üç seçenek),
  Markalarım (durum, sınıf, yenileme), İtiraz dosyalarım (olay zaman çizelgesi; iç notlar gizli,
  yalnız `visibleToClient` belgeler), Yeni marka izlemeye ekle. Vekaletname yoksa "Vekaletname gerekli" adımı.
- Genel form: aydınlatma okundu kutusu (zorunlu) + ticari ileti onayı (isteğe bağlı, ayrı);
  tuzak alanı ve form açılış zamanı (3 sn'den hızlıysa bot); `ratelimit.hit` IP (dakikada 5, günde 20),
  e-posta (günde 3), global (günde 200); IP düz saklanmaz. Kayıt: Client(source 'site-formu',
  kvkkNoticeVersion/ShownAt, commercialMsgConsentAt) + WatchedMark(pendingApproval) + saatlik personel özeti.
- Giriş (`/api/admin/login`): e-posta + IP başına 15 dakikada 10 deneme (`ratelimit.hit`).
- URL içe aktarma: yalnız https + izinli alan adları + özel IP reddi + elle yönlendirme kontrolü.
- Dışa aktarımlar ve PDF'ler Activity'ye yazılır.

## 10. Test ve doğrulama

- `npm run test:izleme` → `tests/izleme/*.test.mjs` (text, nice, similarity, deadlines,
  parser, transitions, matcher aday geri çağırma: brute-force eşik üstü çiftlerin ≥%99,5'i
  `candidatesFor` içinde).
- Uçtan uca: yerel PostgreSQL + `ornek-veri.mjs` + Playwright: tüm sayfalar açılır; akış
  bülten içe aktar → tara → kuyruğu incele → müşteriye bildir (SMTP yok → "atlandı" uyarısı,
  elle bildirim) → portalda karar → itiraz dosyası → olay → süre → takvim.
