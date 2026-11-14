(function () {
  // Mobil menü
  var dugme = document.querySelector('.ust__menu');
  var gezinti = document.getElementById('gezinti');
  function kapat() {
    gezinti.classList.remove('acik');
    dugme.setAttribute('aria-expanded', 'false');
    dugme.querySelector('.sr').textContent = 'Menüyü aç';
  }
  dugme.addEventListener('click', function () {
    var acik = dugme.getAttribute('aria-expanded') === 'true';
    if (acik) return kapat();
    gezinti.classList.add('acik');
    dugme.setAttribute('aria-expanded', 'true');
    dugme.querySelector('.sr').textContent = 'Menüyü kapat';
  });
  gezinti.addEventListener('click', function (e) { if (e.target.closest('a')) kapat(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') kapat(); });

  document.getElementById('yil').textContent = new Date().getFullYear();

  // Ocak saati: İstanbul saatine göre açık mı, kapanışa/açılışa ne kadar kaldı.
  // Saatler: her gün 11:00 - 24:00.
  var ACILIS = 11 * 3600, KAPANIS = 24 * 3600;
  var elSaat = document.getElementById('k-saat');
  var elDurum = document.getElementById('k-durum');
  var elIsik = document.getElementById('k-isik');
  var elEtiket = document.getElementById('k-etiket');
  var elGeri = document.getElementById('k-geri');
  var fmt = new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  function iki(n) { return String(n).padStart(2, '0'); }
  function sure(s) { return iki(Math.floor(s / 3600)) + ':' + iki(Math.floor(s % 3600 / 60)) + ':' + iki(s % 60); }
  function guncelle() {
    var p = {};
    fmt.formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    var h = +p.hour, m = +p.minute, s = +p.second;
    var simdi = h * 3600 + m * 60 + s;
    elSaat.textContent = iki(h) + ':' + iki(m);
    var acik = simdi >= ACILIS && simdi < KAPANIS;
    elIsik.classList.toggle('acik', acik);
    if (acik) {
      elDurum.textContent = 'Şu an açığız';
      elEtiket.textContent = 'Kapanışa kalan';
      elGeri.textContent = sure(KAPANIS - simdi);
    } else {
      elDurum.textContent = 'Şu an kapalıyız';
      elEtiket.textContent = 'Açılışa kalan';
      elGeri.textContent = sure(ACILIS - simdi);
    }
  }
  guncelle();
  setInterval(guncelle, 1000);

  // Rezervasyon formu: talepler Supabase'deki "rezervasyonlar" tablosuna yazılır (ana sayfayla aynı).
  var tarih = document.getElementById('f-tarih');
  var d = new Date();
  tarih.min = d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate());
  var SUPABASE_URL = 'https://gkbdxrcdknsvtowzknmn.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_tWavH4T9LPPrTAZnw8FkMQ_ij_uc0ML';
  var form = document.getElementById('rezervasyon');
  var durum = form.querySelector('.form__durum');
  var gonder = form.querySelector('button[type="submit"]');
  function yaz(msg, tip) { durum.textContent = msg; durum.className = 'form__durum' + (tip ? ' ' + tip : ''); }
  function hata(el, msg) { el.setAttribute('aria-invalid', 'true'); yaz(msg, 'err'); el.focus(); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bos = null;
    form.querySelectorAll('[required]').forEach(function (el) {
      var b = !el.value.trim();
      el.setAttribute('aria-invalid', b ? 'true' : 'false');
      if (b && !bos) bos = el;
    });
    if (bos) { yaz('Lütfen ad, telefon, tarih ve saat alanlarını doldurun.', 'err'); bos.focus(); return; }
    var saat = document.getElementById('f-saat');
    if (saat.value < saat.min || saat.value > saat.max) return hata(saat, 'Rezervasyon saati 11:00 ile 23:00 arasında olmalı.');
    if (tarih.value < tarih.min) return hata(tarih, 'Bugünden önceki bir tarih seçilemez.');
    var tel = document.getElementById('f-tel');
    if (!/^[0-9 +()-]{7,20}$/.test(tel.value.trim())) return hata(tel, 'Telefon numarasını yalnızca rakamla yazın, ör. 0555 123 45 67.');
    var ad = document.getElementById('f-ad');
    if (ad.value.trim().length < 2) return hata(ad, 'Lütfen adınızı yazın.');

    gonder.disabled = true; gonder.textContent = 'Gönderiliyor'; yaz('');
    var tamam = 'Talebiniz bize ulaştı. Rezervasyonunuzu onaylamak için sizi arayacağız.';
    if (form.elements['bot-field'].value) { form.reset(); yaz(tamam, 'ok'); gonder.disabled = false; gonder.textContent = 'Masa Ayırt'; return; }
    var not = form.elements['not'].value.trim();
    fetch(SUPABASE_URL + '/rest/v1/rezervasyonlar', {
      method: 'POST',
      headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ ad: ad.value.trim(), telefon: tel.value.trim(), tarih: tarih.value, saat: saat.value, kisi: form.elements['kisi'].value, notlar: not ? not.slice(0, 500) : null })
    })
      .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); yaz(tamam, 'ok'); })
      .catch(function () { yaz('Talebiniz gönderilemedi. Lütfen 0212 527 00 27 numarasından bizi arayın.', 'err'); })
      .finally(function () { gonder.disabled = false; gonder.textContent = 'Masa Ayırt'; });
  });
})();
