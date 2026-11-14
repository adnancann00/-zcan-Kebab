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
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelector('.sr').textContent = 'Menüyü aç';
      links.classList.remove('is-open');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && links.classList.contains('is-open')) { toggle.click(); toggle.focus(); }
  });

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
        btn.textContent = 'Masa ayırt';
      });
  });
})();
