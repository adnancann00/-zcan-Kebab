/* Yörünge menü: "Dish Orbit Carousel" React bileşeninin düz JS + GSAP uyarlaması.
   Tabak sol tarafta durur; değişirken yukarıdan geniş bir yörüngeyle çıkar, sıradaki
   öbür taraftan gelir. Başlık silinip yeniden yazılır, kart geçiş yapar, arkadaki yay
   döner ve tabağın rengini alır. Sayfa kaydırması sürer: bölüm ekrana sabitlenir,
   her kaydırma aralığı bir sonraki tabağı getirir. Oklar, küçük resimler, yan noktalar,
   ok tuşları ve kaydırma (swipe) da çalışır.
   Sonsuz döngü bilerek kapalı: sayfanın ortasında ziyaretçiyi bölümde hapsederdi. */
(function () {
  var trk = document.querySelector('.yr-trk');
  if (!trk) return;

  var root = trk.querySelector('.yr-root');
  var orbits = [].slice.call(trk.querySelectorAll('.yr-orbit'));
  var heads = [].slice.call(trk.querySelectorAll('.yr-hd'));
  var bodies = [].slice.call(trk.querySelectorAll('.yr-body'));
  var dots = [].slice.call(trk.querySelectorAll('.yr-dot'));
  var thumbs = [].slice.call(trk.querySelectorAll('.yr-th .yr-btn'));
  var track = trk.querySelector('.yr-track');
  var arcEl = trk.querySelector('.yr-arc path');
  var renkler = JSON.parse(trk.getAttribute('data-renkler') || '[]');
  var n = orbits.length;
  if (!n) return;

  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  if (gsap && ST) gsap.registerPlugin(ST);

  // Yörünge: merkezi tuvalin üstünde (.yr-orbit transform-origin ile aynı)
  var ORBIT_X = 299, ORBIT_Y = -450, ORBIT_R = 650;
  var KAYDIRMA = 0.7;  // tabak başına ekran yüksekliği kadar kaydırma
  var SWING = 50;      // tabağın yörüngede döndüğü derece
  var ITEM = 118, VISIBLE = 4;
  var ARC_REST = [[50, 98], [46, 124], [60, 126], [40, 100]];
  var ARC_SWEEP = [38, 146];
  var HIDE_1 = 'inset(0% 0% 0% 100%)'; // ince satır sağdan silinir
  var HIDE_2 = 'inset(0% 100% 0% 0%)'; // kalın satır soldan silinir
  var SHOW = 'inset(0% 0% 0% 0%)';

  var steps = Math.max(0, n - 1);
  var index = 0, shown = -1, dir = 1, seg = 0, tl = null, st = null;
  var arc = { a0: 0, a1: 0 };
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  function wrap(i) { return ((Math.round(i) % n) + n) % n; }
  function arcRest(i) { return ARC_REST[((i % ARC_REST.length) + ARC_REST.length) % ARC_REST.length]; }
  function arcPath(a0, a1, cx, cy, r, w) {
    var outer = [], inner = [], steps = 48;
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var a = ((a0 + (a1 - a0) * t) * Math.PI) / 180;
      var h = (w / 2) * Math.pow(Math.sin(Math.PI * t), 0.45);
      var c = Math.cos(a), s = Math.sin(a);
      outer.push((cx + c * (r + h)).toFixed(1) + ' ' + (cy + s * (r + h)).toFixed(1));
      inner.push((cx + c * (r - h)).toFixed(1) + ' ' + (cy + s * (r - h)).toFixed(1));
    }
    return 'M' + outer.join('L') + 'L' + inner.reverse().join('L') + 'Z';
  }
  function drawArc() { arcEl.setAttribute('d', arcPath(arc.a0, arc.a1, ORBIT_X, ORBIT_Y, ORBIT_R, 118)); }

  // Kaydırma alanı: sabit sahne + tabak başına bir aralık
  function boyut() {
    var h = root.clientHeight || window.innerHeight;
    trk.style.height = (ST ? h * (1 + steps * KAYDIRMA) : h) + 'px';
    var w = root.clientWidth;
    root.style.setProperty('--yr-s', String(Math.min(w / 960, h / 520, 1.6)));
  }
  boyut();
  if (window.ResizeObserver) new ResizeObserver(boyut).observe(root);
  else window.addEventListener('resize', boyut);

  function parca(i) {
    var hd = heads[i];
    return { orbit: orbits[i], head: hd, eye: hd.querySelector('.yr-eye'), t1: hd.querySelector('.yr-t1'), t2: hd.querySelector('.yr-t2'), body: bodies[i] };
  }
  function gizle(el, evet) {
    el.style.visibility = evet ? 'hidden' : 'visible';
    el.style.opacity = evet ? '0' : '1';
  }

  function goster(to) {
    var rest = arcRest(to);
    var tint = renkler[to] || 'transparent';
    var b = parca(to);

    // Erişilebilirlik ve gezinme durumu
    orbits.forEach(function (el, i) { el.setAttribute('aria-hidden', i === to ? 'false' : 'true'); });
    heads.forEach(function (el, i) { el.setAttribute('aria-hidden', i === to ? 'false' : 'true'); });
    bodies.forEach(function (el, i) { el.setAttribute('aria-hidden', i === to ? 'false' : 'true'); });
    dots.forEach(function (el, i) { if (i === to) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current'); });
    thumbs.forEach(function (el, i) { if (i === to) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current'); });
    var bas = n <= VISIBLE ? 0 : Math.max(0, Math.min(to - 1, n - VISIBLE));
    track.style.transform = 'translateX(' + (-bas * ITEM) + 'px)';

    if (tl) { tl.progress(1).kill(); tl = null; }
    var from = shown;
    shown = to;

    // İlk çizim, hareket azaltma veya GSAP yoksa: animasyonsuz geçiş
    if (from === -1 || from === to || mq.matches || !gsap) {
      for (var i = 0; i < n; i++) {
        var p = parca(i), kapali = i !== to;
        p.orbit.classList.remove('is-on'); p.head.classList.remove('is-on'); p.body.classList.remove('is-on');
        [p.orbit, p.head, p.body, p.eye].forEach(function (el) { gizle(el, kapali); el.style.transform = ''; });
        p.t1.style.clipPath = SHOW; p.t2.style.clipPath = SHOW;
      }
      arc.a0 = rest[0]; arc.a1 = rest[1]; drawArc();
      arcEl.style.fill = tint;
      return;
    }

    var a = parca(from), d = dir;
    tl = gsap.timeline({ onComplete: function () { tl = null; } });
    // tabak: yörüngede üstten çıkar, sıradaki öbür taraftan döner
    tl.to(a.orbit, { rotation: SWING * d, duration: 0.62, ease: 'power2.in' }, 0)
      .set(a.orbit, { autoAlpha: 0, rotation: 0 }, 0.62)
      .fromTo(b.orbit, { autoAlpha: 1, rotation: -SWING * d }, { rotation: 0, duration: 0.95, ease: 'power3.out' }, 0.3);
    // başlık: ince satır sağa, kalın satır sola silinir; sonra yenisi yazılır
    tl.to(a.t1, { clipPath: HIDE_1, duration: 0.42, ease: 'power2.in' }, 0)
      .to(a.t2, { clipPath: HIDE_2, duration: 0.42, ease: 'power2.in' }, 0.06)
      .to(a.eye, { autoAlpha: 0, duration: 0.25 }, 0)
      .set(a.head, { autoAlpha: 0 }, 0.5)
      .set(b.head, { autoAlpha: 1 }, 0.5)
      .fromTo(b.eye, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.55)
      .fromTo(b.t1, { clipPath: HIDE_1 }, { clipPath: SHOW, duration: 0.7, ease: 'power3.out' }, 0.55)
      .fromTo(b.t2, { clipPath: HIDE_2 }, { clipPath: SHOW, duration: 0.7, ease: 'power3.out' }, 0.62);
    // kart: geçiş, yeni satırlar sırayla yükselir
    tl.to(a.body, { autoAlpha: 0, y: -6, duration: 0.3, ease: 'power1.in' }, 0.05)
      .set(b.body, { autoAlpha: 1, y: 0 }, 0.4)
      .fromTo(b.body.children, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, 0.4);
    // yay: tabaklarla birlikte uzar, sonra yeni tabağın aralığına oturur ve rengini alır
    tl.to(arc, { a0: ARC_SWEEP[0], a1: ARC_SWEEP[1], duration: 0.6, ease: 'power2.inOut', onUpdate: drawArc }, 0)
      .to(arc, { a0: rest[0], a1: rest[1], duration: 0.85, ease: 'power3.out', onUpdate: drawArc }, 0.6)
      .to(arcEl, { fill: tint, duration: 1.1, ease: 'power1.inOut' }, 0.1);
  }

  function sec(next, yon) {
    if (next === index) return;
    dir = yon; index = next;
    goster(next);
  }

  // Düğme, tuş ve kaydırma hareketi: tabağa atla, sayfa kaydırmasını da o aralığa getir
  function git(to, yon) {
    if (n < 2) return;
    var next = Math.max(0, Math.min(n - 1, to));
    if (next === index) return;
    if (st) {
      var y = st.scroll();
      if (y >= st.start - 1 && y <= st.end + 1) {
        seg = next;
        st.scroll(st.start + ((st.end - st.start) * next) / steps);
      }
    }
    sec(next, yon || (next > index ? 1 : -1));
  }

  goster(0);

  if (gsap && ST && steps > 0) {
    st = ST.create({
      trigger: trk,
      start: 'top top',
      end: 'bottom bottom',
      snap: { snapTo: 1 / steps, duration: { min: 0.3, max: 0.8 }, delay: 0.08, ease: 'power2.inOut' },
      onUpdate: function (self) {
        var s = Math.round(self.progress * steps);
        if (s === seg) return;
        var yon = s > seg ? 1 : -1;
        seg = s;
        sec(wrap(s), yon);
      }
    });
    window.addEventListener('load', function () { ST.refresh(); });
  }

  dots.forEach(function (el, i) { el.addEventListener('click', function () { git(i); }); });
  thumbs.forEach(function (el, i) { el.addEventListener('click', function () { git(i); }); });
  [].slice.call(trk.querySelectorAll('.yr-arrow')).forEach(function (el) {
    el.addEventListener('click', function () { var d = +el.getAttribute('data-yon'); git(index + d, d); });
  });
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); git(index + 1, 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); git(index - 1, -1); }
  });
  var swipe = null;
  var plates = trk.querySelector('.yr-plates');
  plates.addEventListener('pointerdown', function (e) { swipe = { x: e.clientX, y: e.clientY }; });
  plates.addEventListener('pointercancel', function () { swipe = null; });
  plates.addEventListener('pointerup', function (e) {
    var s = swipe; swipe = null;
    if (!s) return;
    var dx = e.clientX - s.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.4) git(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
})();
