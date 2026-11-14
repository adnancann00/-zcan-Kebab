(function () {
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  var links = document.getElementById('navlinks');

  // Kaydırınca üst menüye zemin ver
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobil menü
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.querySelector('.sr').textContent = open ? 'Menüyü aç' : 'Menüyü kapat';
    links.classList.toggle('is-open', !open);
    nav.classList.toggle('menu-open', !open);
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelector('.sr').textContent = 'Menüyü aç';
      links.classList.remove('is-open');
      nav.classList.remove('menu-open');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && links.classList.contains('is-open')) { toggle.click(); toggle.focus(); }
  });

  // Kaydırırken üst menüde bulunulan bölümü işaretle
  var navLinks = [].slice.call(links.querySelectorAll('a[href^="#"]'));
  function aktif(id) {
    navLinks.forEach(function (a) {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
  var bolumler = navLinks.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(function (el) { return el && el.tagName === 'SECTION'; });
  function guncelle() {
    var cizgi = window.innerHeight * 0.45, id = 'top';
    bolumler.forEach(function (el) { if (el.getBoundingClientRect().top <= cizgi) id = el.id; });
    aktif(id);
  }
  window.addEventListener('scroll', guncelle, { passive: true });
  guncelle();

  // Mobil alt çağrı çubuğu: açılışta gizli (ekranda tek ana çağrı kalsın),
  // hero düğmeleri ekrandan çıkınca görünür, iletişim formundayken klavyeyi örtmesin diye gizlenir.
  var callbar = document.querySelector('.callbar');
  var heroCta = document.querySelector('.hero__actions');
  var iletisim = document.getElementById('iletisim');
  function cubukGuncelle() {
    var gecti = heroCta.getBoundingClientRect().bottom < 0;
    var c = iletisim.getBoundingClientRect();
    var formda = c.top < window.innerHeight * 0.6 && c.bottom > window.innerHeight * 0.4;
    callbar.classList.toggle('is-visible', gecti && !formda);
  }
  window.addEventListener('scroll', cubukGuncelle, { passive: true });
  window.addEventListener('resize', cubukGuncelle);
  cubukGuncelle();

  // Yıl
  document.getElementById('yil').textContent = new Date().getFullYear();

  // Tarih alanı: bugünden önce seçilemesin
  var tarih = document.getElementById('f-tarih');
  var d = new Date();
  var bugun = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  tarih.min = bugun;

  // Form (Netlify Forms uyumlu)
  var form = document.getElementById('rezervasyon');
  var status = form.querySelector('.form__status');
  var btn = form.querySelector('button[type="submit"]');

  function setStatus(msg, type) {
    status.textContent = msg;
    status.className = 'form__status' + (type ? ' ' + type : '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var invalid = null;
    form.querySelectorAll('[required]').forEach(function (el) {
      var bad = !el.value.trim();
      el.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad && !invalid) invalid = el;
    });
    if (invalid) {
      setStatus('Ad, telefon, tarih ve saat alanlarını doldurun.', 'err');
      invalid.focus();
      return;
    }

    // Saat 11:00 ile 23:00 arasında olmalı (novalidate olduğu için min/max tarayıcıda uygulanmıyor)
    var saat = document.getElementById('f-saat');
    if (saat.value < saat.min || saat.value > saat.max) {
      saat.setAttribute('aria-invalid', 'true');
      setStatus('Rezervasyon saati 11:00 ile 23:00 arasında olmalı.', 'err');
      saat.focus();
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Gönderiliyor';
    setStatus('');

    var body = new URLSearchParams(new FormData(form)).toString();
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.reset();
        setStatus('Talebiniz alındı. Masanızı onaylamak için sizi arayacağız.', 'ok');
      })
      .catch(function () {
        setStatus('Talep gönderilemedi. Lütfen 0212 527 00 27 numarasını arayın.', 'err');
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = 'Masa Ayırt';
      });
  });
})();
