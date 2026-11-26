/* Sweet Crumbs - Click Burst 3D
   Setiap klik tombol/menu memunculkan emoji kecil yang muncrat & berputar 3D.
   Emoji menyesuaikan produk (donat -> donat, cheesecake -> kue, dst). */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Urutan penting: yang spesifik dulu
  var RULES = [
    [/cheesecake|cake|gateau|shortcake|tiramisu|mille|crepe/i, ['🍰', '🧁', '🍓', '✨']],
    [/donut|doughnut/i,                                          ['🍩', '🍩', '🍬', '✨']],
    [/croissant|danish|pain au|cinnamon|brioche/i,               ['🥐', '🥐', '🧈', '✨']],
    [/baguette|sourdough|bread|roti/i,                           ['🥖', '🍞', '🌾', '✨']],
    [/cookie|oatmeal/i,                                          ['🍪', '🍪', '🍫', '✨']],
    [/brownie/i,                                                 ['🍫', '🍫', '🧁', '✨']],
    [/macaron/i,                                                 ['🍬', '🌸', '🍪', '✨']],
    [/pudding|panna|brulee|brûlée|caramel pud/i,                 ['🍮', '🍮', '🍯', '✨']],
    [/eclair|éclair/i,                                           ['🥖', '🍫', '✨']]
  ];
  var CATEGORY = {
    all:      ['🍩', '🧁', '🍪', '🥐', '🍰', '✨'],
    donuts:   ['🍩', '🍩', '🍬', '✨'],
    cakes:    ['🍰', '🧁', '🍓', '✨'],
    breads:   ['🥖', '🥐', '🍞', '✨'],
    cookies:  ['🍪', '🍪', '🍫', '✨'],
    desserts: ['🍮', '🍨', '🍓', '✨']
  };
  var GENERIC = ['🍩', '🧁', '🍪', '🥐', '🍰', '✨'];
  var CLICKABLE = 'button, a[href], summary, [role="button"], [data-nav], [data-nav-bottom], input[type="submit"], label.cursor-pointer';

  var layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483000;overflow:hidden;perspective:700px;';
  function mount() { document.body.appendChild(layer); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  function pickSet(el) {
    var catBtn = el.closest('[data-category-btn]');
    if (catBtn && CATEGORY[catBtn.dataset.categoryBtn]) return CATEGORY[catBtn.dataset.categoryBtn];

    var card = el.closest('[data-category]');
    var ctx = '';
    if (card) ctx = card.textContent;
    if (!ctx) ctx = el.getAttribute('onclick') || '';          // addToCart(event,'Nama',...)
    if (!ctx) {                                                 // quick view / modal
      var m = el.closest('dialog, [role="dialog"], [id*="quick" i], [id*="qv" i], [id*="modal" i]');
      if (m) ctx = m.textContent;
    }
    ctx = ctx.replace(/\s+/g, ' ').slice(0, 400);
    for (var i = 0; i < RULES.length; i++) if (RULES[i][0].test(ctx)) return RULES[i][1];
    if (card && CATEGORY[card.dataset.category]) return CATEGORY[card.dataset.category];
    return GENERIC;
  }

  function burst(x, y, set, art) {
    var N = 14;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < N; i++) {
      var p = document.createElement('span');
      var A = window.SCArt;
      if (A) { var q = (i % 4 === 3) ? { kind: 'star' } : (art || A.rand()); p.innerHTML = A.svg(q.kind, q.color); }
      else p.textContent = set[Math.floor(Math.random() * set.length)];
      var size = window.SCArt ? 22 + Math.random() * 14 : 14 + Math.random() * 14;
      p.style.cssText = 'position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;font-size:' + size + 'px;line-height:1;' +
        'will-change:transform,opacity;transform-style:preserve-3d;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18));';
      frag.appendChild(p);

      var ang = (-Math.PI / 2) + (Math.random() - 0.5) * Math.PI * 1.5;   // dominan ke atas, seperti muncrat
      var dist = 60 + Math.random() * 110;
      var dx = Math.cos(ang) * dist;
      var dy = Math.sin(ang) * dist;
      var fall = 70 + Math.random() * 90;                                  // jatuh karena gravitasi
      var rx = (Math.random() - 0.5) * 900, ry = (Math.random() - 0.5) * 900, rz = (Math.random() - 0.5) * 360;
      var tz = 40 + Math.random() * 120;                                   // maju ke arah layar = efek 3D
      var dur = 750 + Math.random() * 500;

      var anim = p.animate([
        { transform: 'translate(-50%,-50%) translate3d(0,0,0) rotateX(0) rotateY(0) rotateZ(0) scale(.2)', opacity: 0 },
        { transform: 'translate(-50%,-50%) translate3d(' + dx * 0.6 + 'px,' + dy * 0.6 + 'px,' + tz + 'px) rotateX(' + rx * 0.5 + 'deg) rotateY(' + ry * 0.5 + 'deg) rotateZ(' + rz * 0.5 + 'deg) scale(1.15)', opacity: 1, offset: 0.35 },
        { transform: 'translate(-50%,-50%) translate3d(' + dx + 'px,' + (dy + fall) + 'px,' + tz * 0.3 + 'px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) rotateZ(' + rz + 'deg) scale(.6)', opacity: 0 }
      ], { duration: dur, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
      anim.onfinish = (function (node) { return function () { node.remove(); }; })(p);
    }
    layer.appendChild(frag);
    while (layer.childElementCount > 120) layer.firstChild.remove();       // jaga performa
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest(CLICKABLE);
    if (!t || t.disabled) return;
    if (window.SCFx && window.SCFx.wantsJam(t)) return;                   // tombol biasa: efek selai (fx.js)
    var x = e.clientX, y = e.clientY;
    if (!x && !y) {                                                        // klik via keyboard
      var r = t.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2;
    }
    burst(x, y, pickSet(t), window.SCArt && window.SCArt.fromEl(t));
  }, true);
})();

/* ===== Tambahan: Racik Hadiah terbang, hujan checkout, kartu muncul bergantian, bintang ulasan ===== */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };

  function layerEl() {
    var d = document.createElement('div');
    d.setAttribute('aria-hidden', 'true');
    d.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483001;overflow:hidden;';
    document.body.appendChild(d);
    return d;
  }

  /* 1. Racik Hadiah: kotak hadiah (foto produk di dalamnya) terbang ke keranjang */
  document.addEventListener('click', function (e) {
    var add = e.target.closest && e.target.closest('#hgAdd');
    var src = $('#hgPreview'), cart = $('#cartToggleBtn');
    if (!add || !src || !cart) return;
    var a = src.getBoundingClientRect(), b = cart.getBoundingClientRect();
    if (!a.width) return;
    var w = Math.min(a.width, 180), h = a.height * (w / a.width);
    var fly = src.cloneNode(true);
    fly.removeAttribute('id');
    fly.style.cssText += ';position:fixed;margin:0;pointer-events:none;z-index:2147483001;transform-origin:center;' +
      'left:' + (a.left + (a.width - w) / 2) + 'px;top:' + a.top + 'px;width:' + w + 'px;height:' + h + 'px;overflow:visible;';
    document.body.appendChild(fly);
    var dx = (b.left + b.width / 2) - (a.left + a.width / 2), dy = (b.top + b.height / 2) - (a.top + h / 2);
    fly.animate([
      { transform: 'translate(0,0) scale(1) rotate(0)', opacity: 1 },
      { transform: 'translate(' + dx * 0.4 + 'px,' + (dy * 0.4 - 90) + 'px) scale(.75) rotate(-8deg)', opacity: 1, offset: 0.4 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.08) rotate(20deg)', opacity: .3 }
    ], { duration: 1000, easing: 'cubic-bezier(.5,0,.4,1)', fill: 'forwards' }).onfinish = function () {
      fly.remove();
      cart.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.22) rotate(-8deg)' }, { transform: 'scale(1)' }], { duration: 520 });
    };
  }, true);

  /* 2. Checkout: hujan foto produk dari keranjang */
  document.addEventListener('DOMContentLoaded', function () {
    var orig = window.checkoutWhatsApp;
    if (typeof orig !== 'function') return;
    window.checkoutWhatsApp = function () {
      try { window.SCArt ? window.SCArt.rain(30) : rain(); } catch (_) {}
      return orig.apply(this, arguments);
    };
  });
  function rain() {
    var imgs = Array.prototype.map.call(document.querySelectorAll('#cartItemList img, [data-name] img'), function (i) { return i.src; });
    var emo = ['🍩', '🧁', '🍰', '🥐', '🍪', '🎉'];
    var L = layerEl(), W = innerWidth, H = innerHeight;
    for (var i = 0; i < 26; i++) {
      var useImg = imgs.length && Math.random() < 0.6, el;
      if (useImg) {
        el = document.createElement('img'); el.src = imgs[i % imgs.length];
        var s = 36 + Math.random() * 28;
        el.style.cssText = 'width:' + s + 'px;height:' + s + 'px;border-radius:50%;object-fit:cover;box-shadow:0 4px 10px rgba(0,0,0,.2);';
      } else {
        el = document.createElement('span'); el.textContent = emo[i % emo.length];
        el.style.cssText = 'font-size:' + (22 + Math.random() * 20) + 'px;line-height:1;';
      }
      var x = Math.random() * W;
      el.style.position = 'absolute'; el.style.left = x + 'px'; el.style.top = '-60px';
      L.appendChild(el);
      el.animate([
        { transform: 'translate(0,0) rotate(0deg)' },
        { transform: 'translate(' + ((Math.random() - 0.5) * 120) + 'px,' + (H + 100) + 'px) rotate(' + ((Math.random() - 0.5) * 900) + 'deg)' }
      ], { duration: 1400 + Math.random() * 1400, delay: Math.random() * 700, easing: 'cubic-bezier(.3,.1,.6,1)', fill: 'both' });
    }
    setTimeout(function () { L.remove(); }, 3800);
  }

  /* 3. Ganti kategori: kartu muncul bergantian dengan efek memantul */
  document.addEventListener('click', function (e) {
    if (!(e.target.closest && e.target.closest('[data-category-btn]'))) return;
    setTimeout(function () {
      var cards = Array.prototype.filter.call(
        document.querySelectorAll('#productGridContainer > [data-category]'),
        function (c) { return c.getClientRects().length > 0; });
      cards.slice(0, 16).forEach(function (c, i) {
        c.animate([
          { transform: 'translateY(26px) scale(.9)', opacity: 0 },
          { transform: 'translateY(-6px) scale(1.02)', opacity: 1, offset: 0.65 },
          { transform: 'translateY(0) scale(1)', opacity: 1 }
        ], { duration: 520, delay: i * 55, easing: 'cubic-bezier(.34,1.3,.64,1)', fill: 'backwards' });
      });
    }, 40);
  });

})();
