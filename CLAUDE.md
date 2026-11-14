# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Bu dosya projenin kalıcı hafızasıdır.** Her oturumun başında okunur, her önemli değişiklikten sonra güncellenir (özellikle "Durum", "Kararlar", "Hatalar" ve "Sıradaki işler" bölümleri). Burada yazanı kullanıcıya tekrar sorma. Doğrulanmamış bir şeyi tamamlanmış gibi yazma: bilinmeyenleri **[bilinmiyor]** diye işaretle.

## 1. Amaç ve hedef

**Kebapçı Özcan Usta** (Sirkeci, İstanbul) restoranı için tek sayfalık tanıtım sitesi. Sayfanın amacı ziyaretçiyi telefonla aramaya ya da rezervasyon formunu doldurmaya yönlendirmek: mobilde sabit "Hemen ara / Masa ayırt" çubuğu, belirgin rezervasyon bölümü.

- Kullanıcının işletmeyle ilişkisi (sahibi mi, onun için mi çalışıyor, yoksa satış/demo amaçlı mı) **[bilinmiyor]**
- Yayın adresi / alan adı **[bilinmiyor]**. Sitede `info@ozcanusta.com.tr` geçiyor ama bu adresin gerçek olup olmadığı doğrulanmadı.

## 2. Teknolojiler ve araçlar

- Düz HTML + CSS + vanilla JS. Build adımı, paket yöneticisi, test ya da linter yok.
- Google Fonts: "Big Shoulders Display" (başlıklar/tabela), "Instrument Sans" (gövde metni).
- Supabase (Postgres + REST): rezervasyon talepleri. Proje `gkbdxrcdknsvtowzknmn`. Netlify Forms artık kullanılmıyor.
- Vercel: barındırma (GitHub'dan otomatik yayın).
- Google Maps embed iframe'i ve yol tarifi linki.
- **Canlı (2026-11-14):** https://ozcan-kebap.vercel.app (Vercel projesi `ozcan-kebap`, hesap `acc-61e4`, kullanıcı GitHub'dan bağladı). GitHub'a her push otomatik yeniden yayınlıyor. Yayındaki 14 dosya yerel kopyayla byte byte aynı olarak doğrulandı.
- **Git + GitHub (2026-11-14):** https://github.com/adnancann00/-zcan-Kebab (herkese açık, dal `main`). Kimlik yalnızca bu depoda: `adnancann00` / `adnancann00@users.noreply.github.com` (gmail herkese açık commit'lerde görünmesin diye). Push için macOS anahtar zinciri (osxkeychain) kullanılıyor. `img/google-ana.jpg` `.gitignore` içinde, depoya gönderilmedi; bu yüzden depodan klonlanan `eski-tasarim/` hero görseli göstermez.
- Google Fonts: "Cormorant Garamond" (serif başlıklar) + "Inter" (gövde). Eski tasarımdaki Big Shoulders / Instrument Sans artık yalnızca `eski-tasarim/` içinde.
- Demo görseller Wikimedia Commons API'siyle arandı ve indirildi; `sips` ile kırpıldı/sıkıştırıldı.
- Görsel kontrol: headless Chrome ile ekran görüntüsü (bkz. §6, mobil test notu).
- `img/google-ana.jpg`, Apify ile Google Maps profilinden çekildi (bkz. `GORSELLER.txt`). Yeni tasarımda kullanılmıyor.

Yerelde çalıştırma:

```sh
python3 -m http.server 8000   # sonra http://localhost:8000
```

`index.html` doğrudan açılınca da çalışır, form gönderimi hariç (aşağıya bakın).

## 3. Dosyalar ve görevleri

- `index.html`: sayfanın tamamı. Bölümler: hero → `#hikaye` (fotoğraf + istatistik + çalışma saatleri kartı) → `#menu` → `#yorumlar` (Google puanı + neden biz) → `#sss` → `#iletisim` (form `#rezervasyon`) → footer. Bu ID'ler Nav, mobil `.callbar` ve skip link bu ID'lere gidiyor; birini yeniden adlandırırsan tüm linkleri güncelle. `<head>` içinde schema.org `Restaurant` JSON-LD bloğu var. Sayfanın başında gizli bir SVG `<symbol>` ikon seti var (`#i-ates`, `#i-saat`, `#i-tel`, `#i-ok` …); ikonlar `<svg class="ic"><use href="#i-..."/></svg>` ile kullanılıyor.
- `styles.css`: tasarım token'ları `:root` üzerinde (`--gece`, `--kor`, `--altin`, `--krem`, `--metin*`, fontlar `--f-serif` / `--f-sans`). Sınıf adları BEM benzeri (`block__element`, `block--modifier`), durum sınıfları `is-*` (`is-solid`, `is-open`). Kırılma noktaları: 1180px (geniş tablet), 960px (tablet, hamburger menü), 640px (mobil, alt arama çubuğu). Açılış animasyonu yalnızca `prefers-reduced-motion: no-preference` olduğunda çalışıyor.
- `script.js`: tek bir IIFE. Kaydırınca nav'a zemin veriyor, mobil menüyü açıp kapatıyor (`aria-expanded` ve `.sr` etiketini senkron tutuyor, Escape ile kapanıyor), alt bilgideki yılı yazıyor, tarih alanının `min` değerini bugüne ayarlıyor ve rezervasyon formunu yönetiyor.
- `eski-tasarim/`: ilk (yeşil/mermer) tasarımın yedeği; görselleri `../img/` üzerinden kullanıyor. Karşılaştırma için tutuluyor.
- `img/`: DEMO görseller. Kaynakları `GORSELLER.txt` dosyasında.
- `GORSELLER.txt`: her görselin kaynağı ve lisansı.
- `robots.txt`, `sitemap.xml`: arama motorları için. `eski-tasarim/` taramadan hariç.
- `favicon.svg`: sekme ikonu (altın çerçeveli ateş).
- `img/og.jpg`: paylaşım önizleme görseli (1200x630), hero fotoğrafından kırpıldı.

Kod yorumları, CSS değişken adları, ID'ler ve tüm metinler Türkçe. Yeni eklemeler de Türkçe olmalı.

**Marka dili (2026-11-14):** premium ama samimi, kısa cümleler, "siz" hitabı (düğmeler kısa emir: "Masa Ayırt", "Hemen Ara", "Menüyü İncele"). Hero başlığı: "Közün Başında, Lezzetin Merkezinde" (kullanıcının kendi seçimi, 2026-11-14; önceki "Közde Kebap, Ustanın Elinden"); başlık üstü slogan: "Ocakbaşı geleneği, Sirkeci'de" (2026-11-14, 10 alternatiften seçildi). Hero düğmeleri: "Menü" ve "Masa Rezervasyonu" (mobilde yalnızca "Hemen Ara"). Gerçek olmayan ödül, tarihçe, malzeme, pişirme tekniği, tazelik veya kalite iddiası yazılmaz; yalnızca işletme bilgileri ve yemeklerin bilinen tanımı kullanılır. Tüm bölümlerin 3'er alternatifi ve seçim gerekçeleri: `notlar/metin-alternatifleri.md`.

**Kullanıcının yazım kuralı (2026-11-14):** sitedeki metinlerde uzun tire (– —) ve abartılı sıfat ("unutulmaz", "eşsiz", "olmazsa olmaz" vb.) kullanma. Saat aralıkları `11:00 - 24:00` biçiminde yazılıyor.

## 4. Teknik kararlar

- **Görsel yön (2026-11-14):** kullanıcının gönderdiği Dribbble "Flavora fine dining" ekran görüntüsü örnek alındı: koyu hero, altın vurgu, serif başlık + italik altın kelime, fırça kenarlı geçiş, istatistik satırı, koyu çalışma saatleri kartı. Birebir kopya değil, uyarlama. Örnek görsel: `~/Desktop/626e498383877b0a02f27bc71888b789.webp`.
- **Uydurma iddia yok:** örnekteki "20+ yıl", "ödül" gibi rakamlar yerine yalnızca bilinen veriler kullanıldı (Google 4,8 / 3.545, her gün 11–24). Sahte müşteri yorumu yazılmadı; yorum bölümü gerçek puan dağılımını gösteriyor.
- **Altın butonda koyu yazı:** beyaz yazı altın üzerinde kontrast testini geçmiyor.
- **Kaydırma hedefleri:** `id="top"` sabit `<header>` üzerinde değil, `<body>` üzerinde (sabit bir elemana kaydırma yapılamıyor). `.section` ve `.form` için `scroll-margin-top` değeri 104px, 960px altında 88px; sabit menü hedefi örtmesin diye.
- **Aktif menü işareti:** `script.js` kaydırma konumuna göre, görünüm yüksekliğinin %45'ini geçen son bölümün nav linkine `aria-current="true"` veriyor. IntersectionObserver ve rAF denendi, en üste dönüşte takılı kaldıkları için bırakıldı.
- **Premium ayarlar:** gölge token'ları `--golge-1` / `--golge-2`, kart köşesi `--r-kart: 12px`, başlıklar Cormorant 500, eyebrow etiketleri 0.22em harf aralıklı.
- **Mobil tek el (≤640px):** ilk ekranda yalnızca başlık + tek ana çağrı (`.hero__call`, "Hemen Ara: 0212 527 00 27"). Diğer hero düğmeleri mobilde gizli. Hero fotoğrafı metnin altına iniyor. Alt çağrı çubuğu (`.callbar`) açılışta gizli: hero düğmesi ekrandan çıkınca beliriyor, iletişim formu ekrandayken klavyeyi örtmesin diye gizleniyor (`script.js` → `cubukGuncelle`). Tüm dokunma hedefleri ≥48px. Form alanları 56px ve tek sütun.
- **Alan adı varsayımı:** canonical, og:url, og:image, JSON-LD, robots.txt ve sitemap.xml `https://www.ozcanusta.com.tr` kullanıyor. Bu adres **teyit edilmedi**, yalnızca sitedeki e-posta adresinden tahmin. Değiştirmek için: `grep -rl 'www.ozcanusta.com.tr' . | xargs sed -i '' 's#https://www.ozcanusta.com.tr#https://YENI-ADRES#g'`
- **JSON-LD'den `aggregateRating` kaldırıldı:** Google, işletmenin kendi sayfasındaki öz değerlendirme puanını (Google yorumlarını kopyalamak dahil) yıldız olarak göstermiyor ve yönergelerine aykırı sayabiliyor. Puan sayfada metin olarak duruyor.
- **Kapanış saati şemada `23:59`:** schema.org'da gece yarısı kapanış için önerilen biçim bu.
- **Görsel sıkıştırma:** makinede WebP üreticisi yok (`sips` WebP yazamıyor, `cwebp` yok). JPEG'ler gösterim boyutuna küçültülüp `sips -s formatOptions 50` ile sıkıştırıldı: 2,8 MB → 0,9 MB. Hero/Adana 1600px, diğer yemekler 1200px, ocak 1000px. Yeni gerçek fotoğraflar da bu boyutlara getirilmeli.
- **Framework yok:** statik HTML/CSS/JS ile her yerde ücretsiz barındırılabilir, bakımı kolay.
- **Rezervasyon = Supabase (2026-11-14):** form, `script.js` içinden `fetch` ile `https://gkbdxrcdknsvtowzknmn.supabase.co/rest/v1/rezervasyonlar` adresine JSON POST ediyor (`apikey` başlığında publishable anahtar, `Prefer: return=minimal`). Tablo ve kurallar `supabase/migrations/20261114120000_rezervasyonlar.sql` içinde; kullanıcı bunu Supabase SQL Editor'da elle çalıştırdı (CLI yok, DB şifresi paylaşılmadı, paylaşılmasın). Güvenlik: RLS açık, `anon` yalnızca `ad, telefon, tarih, saat, kisi, notlar` sütunlarına INSERT yapabilir; SELECT/UPDATE/DELETE yok; politika geçmiş tarihi reddediyor (İstanbul saati). Veri kuralları: telefon `^[0-9 +()-]{7,20}$`, saat 11:00-23:00, kişi 1-9+, not ≤500. Aynı kontroller `script.js`'te de var. Honeypot `bot-field` doluysa istek gönderilmeden başarı gösteriliyor. Talepler Supabase panelinde Table Editor → `rezervasyonlar` altında okunuyor; `durum` sütunu (yeni/onaylandi/iptal) panelden güncelleniyor.
  - Doğrulama (kayıt bırakmadan): okuma → 401/42501, saat 02:00 → 400/23514 (ekleme izni geçti, kural reddetti), geçmiş tarih → 401 RLS, `durum` yazma → 401. Tam geçerli bir kayıtla canlı test kullanıcıya bırakıldı.
- **Rezervasyon onayı telefonla:** başarı mesajında "sizi arayacağız" yazıyor; hata durumunda telefon numarası gösteriliyor.
- **Menüde fiyat yok:** "Güncel menü ve fiyatlar için bizi arayın" yazıyor.
- **Erişilebilirlik:** skip link, `:focus-visible` stili, `aria-live` form durumu, hareket azaltma tercihine uyum.
- **İşletme bilgileri birden fazla yerde tekrar ediyor:** telefon (`0212 527 00 27` / `+902125270027`), adres, çalışma saatleri (her gün 11:00–24:00), koordinatlar ve Google puanı (4,8 / 3.545 yorum). Geçtikleri yerler: JSON-LD, `<meta name="description">`, hero/hakkımızda metni, alt bilgi, `.callbar`, harita iframe'i/linki ve `script.js` içindeki form hata mesajı. Bir bilgi değişirse hepsini birlikte güncelle.

## 5. Durum: tamamlananlar

Doğrulanmış olanlar (dosyalara bakılarak, 2026-11-14):

- [x] Site dosyaları oluşturuldu (13 Kasım 2026): `index.html`, `styles.css`, `script.js`, `img/`, `GORSELLER.txt`
- [x] Bölümler: hero, menü, hakkımızda, neden biz, SSS (5 madde, `<details>`), iletişim + rezervasyon formu, alt bilgi (harita dahil), mobil arama çubuğu
- [x] SEO: meta description, JSON-LD `Restaurant`
- [x] CLAUDE.md oluşturuldu (2026-11-14)
- [x] **Yeni tasarım (2026-11-14):** koyu/altın tema, Dribbble örneğine göre. Eski sürüm `eski-tasarim/` klasörüne yedeklendi. Masaüstü (1440px) ve mobil (390px) headless Chrome ile kontrol edildi.
- [x] Demo görseller güncellendi: yeni `hero-adana.jpg`, `ocak.jpg`; `durum.jpg` gerçek bir dürüm fotoğrafıyla değiştirildi (eskisi lahmacun dürümüydü)
- [x] Ziyaretçiye görünen yer tutucu yazılar kaldırıldı ("Stok görsel…", "[Kuruluş yılı…]", "[E-posta…]")
- [x] Footer'a "Demo görseller: Wikimedia Commons (CC BY-SA)" atfı eklendi
- [x] Rezervasyon saati 11:00 - 23:00 aralığı JS'te kontrol ediliyor
- [x] **Bağlantı denetimi (2026-11-14):** 16 iç bağlantı, 6 tel, 2 mailto, 3 Google Maps bağlantısı. Headless Chrome ile 1440px ve 390px genişlikte her iç bağlantıya tıklanıp iniş noktası ölçüldü; hepsi geçti. Mobil menü (aç, linkle kapat, Escape), boş form ve saat kontrolü de test edildi. Test sayfaları scratchpad'deydi, kalıcı değil.
- [x] **Metinler marka diliyle yeniden yazıldı (2026-11-14):** 11 bölüm, her biri için 3 alternatif (`notlar/metin-alternatifleri.md`). Tasarım/yapı değişmedi. Önceki turlarda yazılmış doğrulanmamış iddialar çıkarıldı ("Taze, günlük", "Her şiş siparişle ocağa girer", "en çok sipariş edilen", "Bakır maşrapada", müşteri profili).
- [x] **Mobil tek el + SEO geçişi (2026-11-14):** bkz. §4. Ölçüldü: 390x664 ekranda başlık ve "Hemen Ara" ilk ekranda, 48px altı dokunma hedefi 0, alt çubuk açılış/formda gizli, menüde ve footer'da görünür. JSON-LD ve sitemap ayrıştırılarak doğrulandı.
- [x] **Premium iyileştirme turu (2026-11-14):** boşluklar, tipografi hiyerarşisi, renk dengesi ve kart gölgeleri. İçerik ve yapı aynı kaldı. Hero başlığı: "Közde Pişer, Sofraya Gelir, *Sıcak Sıcak*".

İçerik doğruluğu (telefon, adres, saatler, puan, SSS cevapları) işletme sahibiyle teyit edildi mi: **[bilinmiyor]**

## 6. Karşılaşılan hatalar ve çözümleri

- **Dribbble sayfası çekilemiyor:** WebFetch ve curl HTTP 202 + boş gövde döndürüyor. Çözüm: kullanıcıdan ekran görüntüsü iste.
- **Headless Chrome mobil ekran görüntüsü yanıltıcı:** `--window-size=390,...` verince Chrome ~500px'den dar pencere açmıyor, sayfa sağdan kesik görünüyor. Çözüm: sayfayı 390px genişliğinde bir `<iframe>` içine koyan sarmalayıcı HTML'i görüntüle (`--allow-file-access-from-files`).
- **Cormorant rakamları eski stil (oldstyle) görünüyor:** `font-variant-numeric: lining-nums` gerekiyor, ama `font:` kısaltması bunu sıfırlıyor. Kural `styles.css` dosyasının en sonunda, özgüllüğü yeterli seçicilerle duruyor.
- **`#top` bağlantıları çalışmıyordu** (logo, "Ana Sayfa", "Başa dön"): hedef sabit header'dı. Çözüm: `id="top"` → `<body>`.
- **"Masa Ayırt" formu menünün altına gizliyordu:** `#rezervasyon` formunda `scroll-margin` yoktu. Çözüm: §4'teki scroll-margin kuralı.
- **Test notu:** headless Chrome, iframe içindeki programatik `scrollTo` için `scroll` olayı göndermiyor. Aktif menü testinde olayı elle tetikle (`w.dispatchEvent(new w.Event('scroll'))`).
- Makinede `node` yok; JS sözdizimi kontrolü tarayıcıda yapılmalı.

## 7. Tamamlanmamış işler

- [ ] `img/google-ana.jpg`: yeni tasarımda kullanılmıyor; yalnızca `eski-tasarim/` içinde. Eski tasarım yayınlanmayacaksa sorun değil.
- [ ] Wikimedia görselleri: footer'da genel atıf var. Yayında kalacaklarsa CC BY-SA her görsel için yazar + lisans linki ister; en iyisi gerçek fotoğraflarla değiştirmek.
- [ ] **Gerçek fotoğrafları yükle** (kullanıcı sonra gönderecek). Aynı dosya adlarıyla `img/` klasörüne koymak yeterli; önerilen oranlar `GORSELLER.txt` dosyasında.
- [ ] İşletme bilgilerini ve `info@ozcanusta.com.tr` adresini teyit et
- [ ] Yeni rezervasyon bildirimi yok (e-posta/SMS). Talepler yalnızca Supabase panelinde görünüyor. İstenirse Supabase Edge Function + e-posta servisi veya Database Webhook ile eklenebilir.
- [ ] Hız sınırı yok: aynı kişi art arda çok talep gönderebilir (yalnızca honeypot + veri kuralları var).
- [ ] **Site Google'a açık** (noindex yok), ama canonical/og:url/sitemap teyit edilmemiş `www.ozcanusta.com.tr` adresini gösteriyor. Kullanıcı ya gerçek alan adını vermeli ya da adresler `https://ozcan-kebap.vercel.app` yapılmalı. Önizleme mi açık yayın mı kararı da hâlâ verilmedi.

İnceleme bulguları (2026-11-14, kod ve görseller incelenerek):

- [ ] Ustanın hikâyesi / kuruluş yılı: metinden çıkarıldı, bilgi gelirse "Hikâyemiz" bölümüne eklenebilir
- [ ] Doğrulanmamış iddialar: helal kesim, tekerlekli sandalye girişi ve park yeri, 19:00–21:00 yoğunluk, taş fırın, yayık ayran, dürüm çeşitleri, bayram saatleri
- [ ] Google puanı ve yıldız dağılımı (4,8 / 3.545) sabit yazılmış, zamanla eskiyecek
- [ ] Formda KVKK aydınlatma metni / onay kutusu yok (ad ve telefon topluyor)
- [ ] **Alan adını teyit et**; farklıysa §4'teki komutla değiştir. Yayından sonra Google Search Console'a sitemap gönder ve Google İşletme Profili'nde web sitesi bağlantısını ekle.
- [ ] Yayından sonra Rich Results Test ve bir paylaşım önizleme aracıyla (ör. WhatsApp'ta link atarak) kontrol et
- [ ] Sosyal medya linkleri (Instagram vb.) yok. Hesap olup olmadığı **[bilinmiyor]**.
- [ ] İngilizce sürüm yok (Sirkeci turistik bölge, düşünülebilir)
- [ ] Tam menü / fiyat listesi yok (bilinçli karar, bkz. §4; ama kullanıcıya sorulabilir)

## 8. Bir sonraki oturumda

1. Kullanıcının yeni tasarım hakkındaki geri bildirimini al (renk, yazı, bölüm sırası).
2. Gerçek fotoğraflar geldiyse `img/` içinde değiştir, footer'daki demo atfını kaldır.
3. Kullanıcıya §1'deki bilinmeyenleri **bir kez** sor (işletmeyle ilişkisi, alan adı, yayın durumu) ve cevapları buraya yaz.
4. §7'deki listeden kullanıcının önceliğini al.
