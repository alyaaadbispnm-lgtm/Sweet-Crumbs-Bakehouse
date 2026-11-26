/* Sweet Crumbs - Ilustrasi kartun flat + maskot + efek tambahan */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var K = '#3b2418';
  var ST = 'stroke="' + K + '" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"';

  function mix(h, t) {
    var n = parseInt(h.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function f(v) { return Math.round(v + (255 - v) * t); }
    return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')';
  }
  function face(x, y, s) {
    var e = 2.6 * s;
    return '<g fill="' + K + '"><circle cx="' + (x - 9 * s) + '" cy="' + y + '" r="' + e + '"/><circle cx="' + (x + 9 * s) + '" cy="' + y + '" r="' + e + '"/></g>' +
      '<path d="M' + (x - 5 * s) + ' ' + (y + 5 * s) + 'q' + 5 * s + ' ' + 5 * s + ' ' + 10 * s + ' 0" fill="none" stroke="' + K + '" stroke-width="' + 2 * s + '" stroke-linecap="round"/>' +
      '<circle cx="' + (x - 15 * s) + '" cy="' + (y + 4 * s) + '" r="' + 3 * s + '" fill="#ff8fa8" opacity=".6"/><circle cx="' + (x + 15 * s) + '" cy="' + (y + 4 * s) + '" r="' + 3 * s + '" fill="#ff8fa8" opacity=".6"/>';
  }
  var DEF = { donut: '#F5A9C5', slice: '#f3d9a4', croissant: '#e8a95a', loaf: '#e0a458', cookie: '#e0a458', brownie: '#6b3a24', macaron: '#F5A9C5', pudding: '#f6d860', crepe: '#f3d9a4', eclair: '#6b3a24', roll: '#e8b46a', star: '#ffd45e' };

  function svg(kind, c) {
    c = c || DEF[kind] || '#F5A9C5';
    var b = '';
    switch (kind) {
      case 'slice':
        b = '<g ' + ST + '><rect x="12" y="46" width="76" height="40" rx="9" fill="' + c + '"/><rect x="12" y="60" width="76" height="9" fill="#fff3dc"/><path d="M10 46q0-12 12-12h56q12 0 12 12z" fill="' + mix(c, .7) + '"/><circle cx="50" cy="27" r="8" fill="#e53957"/></g><path d="M50 19q-1-5 4-6" fill="none" stroke="#3f9b4b" stroke-width="2.6" stroke-linecap="round"/>' + face(50, 78, .7); break;
      case 'croissant':
        b = '<g ' + ST + ' fill="#e8a95a"><ellipse cx="14" cy="64" rx="8" ry="13" transform="rotate(-55 14 64)"/><ellipse cx="86" cy="64" rx="8" ry="13" transform="rotate(55 86 64)"/><ellipse cx="28" cy="52" rx="13" ry="20" transform="rotate(-30 28 52)"/><ellipse cx="72" cy="52" rx="13" ry="20" transform="rotate(30 72 52)"/><ellipse cx="50" cy="46" rx="17" ry="25"/></g><path d="M40 28q10-4 20 0M38 40q12-4 24 0" fill="none" stroke="#c97f35" stroke-width="2.6" stroke-linecap="round"/>' + face(50, 60, .7); break;
      case 'loaf':
        b = '<g transform="rotate(-18 50 50)"><rect x="6" y="34" width="88" height="34" rx="17" fill="' + c + '" ' + ST + '/><path d="M24 41l6 6M44 39l6 6M64 41l6 6" stroke="#fff1c9" stroke-width="5" stroke-linecap="round" fill="none"/>' + face(50, 60, .7) + '</g>'; break;
      case 'cookie':
        b = '<g ' + ST + '><circle cx="50" cy="50" r="40" fill="' + c + '"/></g><g fill="#5b3220"><ellipse cx="26" cy="34" rx="5" ry="4"/><ellipse cx="70" cy="28" rx="5" ry="4"/><ellipse cx="78" cy="58" rx="5" ry="4"/><ellipse cx="30" cy="68" rx="5" ry="4"/><ellipse cx="62" cy="78" rx="5" ry="4"/><ellipse cx="48" cy="22" rx="4" ry="3"/></g>' + face(50, 52, .9); break;
      case 'brownie':
        b = '<g ' + ST + '><rect x="12" y="26" width="76" height="58" rx="10" fill="' + c + '"/><path d="M12 38q0-12 12-12h52q12 0 12 12z" fill="' + mix(c, .3) + '"/><circle cx="30" cy="32" r="4" fill="#d9a65a"/><circle cx="68" cy="31" r="4" fill="#d9a65a"/></g>' + face(50, 64, .8); break;
      case 'macaron':
        b = '<g ' + ST + '><path d="M16 44q0-28 34-28t34 28z" fill="' + c + '"/><rect x="14" y="44" width="72" height="12" rx="6" fill="#fff3dc"/><path d="M16 56h68q0 26-34 26T16 56z" fill="' + c + '"/></g>' + face(50, 33, .6); break;
      case 'pudding':
        b = '<g ' + ST + '><path d="M20 36h60l-6 48q-24 8-48 0z" fill="' + c + '"/><path d="M20 36q30-16 60 0q-4 14-14 8q-8 12-16 2q-8 10-16-2q-10 6-14-8z" fill="#b9702e"/><circle cx="50" cy="22" r="7" fill="#e53957"/></g>' + face(50, 66, .8); break;
      case 'crepe':
        b = '<g ' + ST + '><rect x="14" y="72" width="72" height="14" rx="7" fill="' + c + '"/><rect x="14" y="58" width="72" height="14" rx="7" fill="#fff3dc"/><rect x="14" y="44" width="72" height="14" rx="7" fill="' + c + '"/><rect x="14" y="30" width="72" height="14" rx="7" fill="#fff3dc"/><circle cx="50" cy="22" r="8" fill="#e53957"/></g>' + face(50, 60, .6); break;
      case 'eclair':
        b = '<g transform="rotate(-12 50 50)"><g ' + ST + '><rect x="6" y="36" width="88" height="30" rx="15" fill="#e8b46a"/><path d="M8 48q0-14 15-14h54q15 0 15 14q-6 8-12 2q-6 8-14 2q-8 8-16 2q-8 6-16 0q-8 4-12-2q-8 4-14-2z" fill="' + c + '"/></g>' + face(50, 60, .7) + '</g>'; break;
      case 'roll':
        b = '<g ' + ST + '><circle cx="50" cy="50" r="40" fill="' + c + '"/></g><path d="M50 50q8-8 14 0q6 12-8 18q-18 4-24-12q-4-22 22-26q26 0 34 24" fill="none" stroke="#b9702e" stroke-width="5" stroke-linecap="round"/><path d="M24 40q10-8 18 2t18-2 18 6" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>' + face(50, 66, .6); break;
      case 'star':
        b = '<path d="M50 6l9 35l35 9l-35 9l-9 35l-9-35l-35-9l35-9z" fill="' + c + '" ' + ST + '/>'; break;
      default: /* donut */
        b = '<g ' + ST + '><path fill-rule="evenodd" fill="#e9b46b" d="M8 52a42 42 0 1 0 84 0a42 42 0 1 0-84 0zM38 52a12 12 0 1 0 24 0a12 12 0 1 0-24 0z"/><path fill-rule="evenodd" fill="' + c + '" d="M13 50a37 37 0 1 0 74 0a37 37 0 1 0-74 0zM36 50a14 14 0 1 0 28 0a14 14 0 1 0-28 0z"/></g><g fill="none" stroke-width="3.2" stroke-linecap="round"><path d="M24 36l5-3" stroke="#fff"/><path d="M70 26l5 3" stroke="#ffd45e"/><path d="M80 44l5-2" stroke="#7bd1c0"/><path d="M20 58l5 2" stroke="#ffd45e"/><path d="M58 20l-4-4" stroke="#fff"/><path d="M80 66l4 3" stroke="#fff"/></g>' + face(50, 76, .75);
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">' + b + '</svg>';
  }
  function uri(sp) { return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg(sp.kind, sp.color)); }

  var KIND = [[/donut|doughnut|box of six/, 'donut'], [/cinnamon/, 'roll'], [/croissant|danish|pain au|brioche/, 'croissant'], [/baguette|sourdough|bread/, 'loaf'], [/cookie|oatmeal/, 'cookie'], [/brownie/, 'brownie'], [/macaron/, 'macaron'], [/crepe|crêpe|mille/, 'crepe'], [/eclair|éclair/, 'eclair'], [/pudding|panna|brulee|brûlée|tiramisu/, 'pudding'], [/cake|gateau|gâteau|shortcake/, 'slice']];
  var FB = { donuts: 'donut', cakes: 'slice', breads: 'croissant', cookies: 'cookie', desserts: 'pudding' };
  var COL = [[/matcha|pistach/, '#9ccc65'], [/red velvet/, '#d0364e'], [/choc|fudge|brownie|black forest|loco/, '#6b3a24'], [/pink|strawberry|raspberry|please/, '#F5A9C5'], [/blueberry/, '#8b7be0'], [/lemon|vanilla|banana/, '#f6d860'], [/carrot|caramel|oatmeal/, '#e0913f'], [/mille|panna|tiramisu|cheesecake/, '#f3d9a4']];

  function spec(name, cat) {
    var n = (name || '').toLowerCase(), k = null, c = null, i;
    for (i = 0; i < KIND.length; i++) if (KIND[i][0].test(n)) { k = KIND[i][1]; break; }
    if (!k) k = FB[cat] || 'donut';
    for (i = 0; i < COL.length; i++) if (COL[i][0].test(n)) { c = COL[i][1]; break; }
    if (k === 'cookie' && /chip|oat/.test(n)) c = null;
    if (k === 'croissant' || k === 'loaf' || k === 'roll') c = null;
    return { kind: k, color: c || DEF[k] };
  }
  function nameOf(el) {
    var card = el.closest && el.closest('[data-category]');
    if (card) { var h = card.querySelector('h3'); return { n: h ? h.textContent : card.textContent.slice(0, 80), cat: card.dataset.category }; }
    var oc = el.getAttribute && el.getAttribute('onclick');
    if (oc) { var m = /addToCart\(event,\s*'((?:[^'\\]|\\.)*)'/.exec(oc); if (m) return { n: m[1] }; }
    var q = el.closest && el.closest('.pt-qv');
    if (q) { var t = $('.pt-qv-title', q); if (t) return { n: t.textContent }; }
    return null;
  }
  function fromEl(el) { var o = nameOf(el); return o ? spec(o.n, o.cat) : null; }
  var RK = ['donut', 'donut', 'slice', 'cookie', 'croissant', 'macaron', 'pudding', 'roll'];
  var RC = ['#F5A9C5', '#6b3a24', '#9ccc65', '#f6d860', '#8b7be0', '#d0364e'];
  function rand() { var k = RK[Math.floor(Math.random() * RK.length)]; return { kind: k, color: (k === 'cookie' || k === 'croissant' || k === 'roll') ? null : RC[Math.floor(Math.random() * RC.length)] }; }

  function layer() {
    var d = document.createElement('div');
    d.setAttribute('aria-hidden', 'true');
    d.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483002;overflow:hidden;';
    document.body.appendChild(d); return d;
  }
  function rain(n) {
    if (reduce) return;
    var L = layer(), W = innerWidth, H = innerHeight;
    for (var i = 0; i < n; i++) {
      var r = rand(), s = 34 + Math.random() * 30, el = document.createElement('div');
      el.innerHTML = svg(r.kind, r.color);
      el.style.cssText = 'position:absolute;top:-80px;width:' + s + 'px;height:' + s + 'px;left:' + (Math.random() * (W - s)) + 'px;';
      L.appendChild(el);
      el.animate([{ transform: 'translate(0,0) rotate(0)' }, { transform: 'translate(' + ((Math.random() - .5) * 140) + 'px,' + (H + 120) + 'px) rotate(' + ((Math.random() - .5) * 900) + 'deg)' }],
        { duration: 1500 + Math.random() * 1500, delay: Math.random() * 800, easing: 'cubic-bezier(.3,.1,.6,1)', fill: 'both' });
    }
    setTimeout(function () { L.remove(); }, 4200);
  }
  function stars(cx, cy, n) {
    if (reduce) return;
    var L = layer();
    for (var i = 0; i < n; i++) {
      var s = 18 + Math.random() * 16, el = document.createElement('div'), a = Math.PI * 2 * i / n, d = 60 + Math.random() * 80;
      el.innerHTML = svg('star', i % 2 ? '#ffd45e' : '#ffb3c7');
      el.style.cssText = 'position:absolute;left:' + (cx - s / 2) + 'px;top:' + (cy - s / 2) + 'px;width:' + s + 'px;height:' + s + 'px;';
      L.appendChild(el);
      el.animate([{ transform: 'scale(.2) rotate(0)', opacity: 1 }, { transform: 'translate(' + Math.cos(a) * d + 'px,' + (Math.sin(a) * d + 30) + 'px) scale(1.1) rotate(' + (Math.random() * 400 - 200) + 'deg)', opacity: 0 }],
        { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.15,.8,.25,1)', fill: 'forwards' });
    }
    setTimeout(function () { L.remove(); }, 1500);
  }
  window.SCArt = { svg: svg, uri: uri, spec: spec, fromEl: fromEl, rand: rand, rain: rain, stars: stars, last: function () { return lastSpec; }, say: function (m, ms) { say(m, ms); }, jump: function () { jump(); } };

  /* ---------- Maskot ---------- */
  var mas, bub, pupils, eyes, bt, lastSpec = null;
  function say(msg, ms) {
    if (!bub) return;
    bub.textContent = msg; bub.classList.add('on');
    clearTimeout(bt); bt = setTimeout(function () { bub.classList.remove('on'); }, ms || 2800);
  }
  function jump() {
    if (!mas || reduce) return;
    mas.animate([{ transform: 'translateY(0) scale(1,1)' }, { transform: 'translateY(0) scale(1.12,.86)', offset: .2 }, { transform: 'translateY(-34px) scale(.92,1.1)', offset: .55 }, { transform: 'translateY(0) scale(1.1,.9)', offset: .85 }, { transform: 'translateY(0) scale(1,1)' }], { duration: 700, easing: 'ease-out' });
  }
  function buildMascot() {
    var st = document.createElement('style');
    st.textContent = '#scMascot{position:fixed;left:10px;bottom:86px;width:88px;z-index:40;cursor:pointer;transform-origin:bottom;-webkit-tap-highlight-color:transparent}' +
      '@media(min-width:1024px){#scMascot{left:18px;bottom:18px;width:112px}}#scMascot .sc-mascot-photo{display:block;width:100%;height:auto;object-fit:contain;filter:drop-shadow(0 7px 6px rgba(0,0,0,.22));}' +
      '#scMascot svg{position:absolute;inset:0;width:100%;height:100%;display:block;overflow:visible;pointer-events:none}' +
      '#scMascot .sc-eye{transform-box:fill-box;transform-origin:center;animation:scBlink 5.2s infinite}' +
      '#scMascot .sc-eye:nth-child(2){animation-delay:.08s}@keyframes scBlink{0%,2%,4%,48%,50%,100%{transform:scaleY(1)}3%,49%{transform:scaleY(.08)}}' +
      '.sc-bub{position:absolute;left:0;bottom:100%;margin-bottom:6px;background:#fff;border:2px solid ' + K + ';border-radius:14px;padding:6px 10px;font:600 12px/1.3 Poppins,sans-serif;color:#123F32;width:max-content;max-width:190px;opacity:0;transform:translateY(6px) scale(.9);transition:.25s;pointer-events:none}' +
      '.sc-bub.on{opacity:1;transform:none}.sc-hand{animation:scwave .7s ease-in-out 4;transform-origin:90px 62px}@keyframes scwave{0%,100%{transform:rotate(0)}50%{transform:rotate(-35deg)}}';
    document.head.appendChild(st);
    mas = document.createElement('div'); mas.id = 'scMascot'; mas.setAttribute('aria-hidden', 'true');
    mas.innerHTML = '<div class="sc-bub"></div><img class="sc-mascot-photo" src="images/pink-donut-mascot.png" alt="" draggable="false"/><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
      '<g class="sc-eyes"><g class="sc-eye" transform="translate(37.5 51.5)"><circle class="sc-pupil" cx="0" cy="0" r="2.15" fill="#160d0a"/><circle cx="-1.0" cy="-1.2" r=".85" fill="#fff"/></g><g class="sc-eye" transform="translate(62.5 51.5)"><circle class="sc-pupil" cx="0" cy="0" r="2.15" fill="#160d0a"/><circle cx="-1.0" cy="-1.2" r=".85" fill="#fff"/></g></g>' +
      '<path d="M43 74q7 7 14 0" fill="none" stroke="' + K + '" stroke-width="1.9" stroke-linecap="round"/><circle cx="28" cy="72" r="4" fill="#ff8fa8" opacity=".65"/><circle cx="72" cy="72" r="4" fill="#ff8fa8" opacity=".65"/>' +
      '<g class="sc-hand"><circle cx="93" cy="58" r="6" fill="#e9b46b" ' + ST + '/></g></svg>';
    document.body.appendChild(mas);
    bub = $('.sc-bub', mas); pupils = mas.querySelectorAll('.sc-pupil'); eyes = mas.querySelectorAll('.sc-eye');
    if (!reduce) mas.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-4px)' }, { transform: 'translateY(0)' }], { duration: 2200, iterations: Infinity, easing: 'ease-in-out' });
    var raf = 0;
    document.addEventListener('pointermove', function (e) {
      if (raf || reduce) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var r = mas.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1;
        var k = Math.min(1, d / 120) * 5;
        pupils.forEach(function (p) { p.setAttribute('cx', String(.8 + dx / d * k * .62)); p.setAttribute('cy', String(.2 + dy / d * k * .62)); });
      });
    });
    if (!reduce) { setInterval(function () { if (!document.hidden && eyes && Math.random() < .72) { eyes.forEach(function (eye) { eye.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(.08)' }, { transform: 'scaleY(1)' }], { duration: 190, easing: 'ease-in-out' }); }); } }, 3100); }
    if (!reduce) { setInterval(function () {
      if (document.hidden || !pupils || !pupils.length) return;
      var gx = (Math.random() - .5) * 2.2, gy = (Math.random() - .5) * 1.5;
      pupils.forEach(function (p) { p.setAttribute('cx', String(gx)); p.setAttribute('cy', String(gy)); });
      setTimeout(function () { pupils.forEach(function (p) { p.setAttribute('cx', '0'); p.setAttribute('cy', '0'); }); }, 900 + Math.random() * 500);
    }, 2200); }
    var Q = ['Halo! Mau donat apa hari ini? 🍩', 'Cobain Racik Hadiah, seru lho! 🎁', 'Croissant paling enak pas hangat 🥐', 'Aku jagain keranjangmu ya!'];
    mas.addEventListener('click', function () { jump(); say(Q[Math.floor(Math.random() * Q.length)]); });
    var h = new Date().getHours();
    var g = h >= 5 && h < 11 ? 'Selamat pagi! Roti hangat baru keluar oven 🥐' : h < 15 && h >= 11 ? 'Selamat siang! Waktunya donat 🍩' : h >= 15 && h < 18 ? 'Selamat sore! Cocok buat teman ngeteh 🍰' : 'Selamat malam! Masih ada dessert manis 🍮';
    setTimeout(function () { say(g, 4200); }, 600);
  }

  /* ---------- Hook interaksi ---------- */
  function init() {
    /* terbang ke keranjang: ganti foto jadi ilustrasi */
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.add-to-cart-trigger, .pt-qv-add');
      if (b) lastSpec = fromEl(b);
    }, true);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType === 1 && n.classList.contains('pt-fly')) {
            /* Pertahankan foto produk asli pada animasi terbang ke keranjang. */
            var im = n.querySelector('img');
            if (im) im.style.cssText += ';object-fit:cover;box-shadow:0 10px 18px rgba(59,36,24,.18);';
          }
        });
      });
    }).observe(document.body, { childList: true });

    /* tombol tambah jadi centang + maskot lompat */
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.add-to-cart-trigger, .pt-qv-add, #hgAdd');
      if (!b) return;
      jump();
      var s = fromEl(b), nm = nameOf(b);
      say(nm ? nm.n + ' berhasil ditambahkan ke keranjang!' : (b.id === 'hgAdd' ? 'Hampers berhasil ditambahkan ke keranjang!' : 'Produk berhasil ditambahkan ke keranjang!'), 3200);
      if (b.classList.contains('add-to-cart-trigger') && !b.dataset.scBusy) {
        b.dataset.scBusy = '1';
        var old = b.innerHTML;
        b.innerHTML = '<span style="display:inline-block;width:18px;height:18px">' + svg((s || rand()).kind, (s || {}).color) + '</span> <span>✓ Masuk</span>';
        if (!reduce) b.firstChild.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }], { duration: 450, iterations: 2 });
        setTimeout(function () { b.innerHTML = old; delete b.dataset.scBusy; }, 1100);
      }
    });

    /* Racik Hadiah: foto produk pop memantul di kotak */
    var box = $('#hgPreview'), prev = [], was = false, pend = 0;
    function gift() {
      pend = 0;
      var imgs = [].slice.call(box.querySelectorAll('img')), cells = box.querySelectorAll('.grid > div'), names = [];
      imgs.forEach(function (im, i) {
        var nm = im.alt; names.push(nm);
        /* foto produk asli dipertahankan (tidak diganti ilustrasi); hanya efek pop memantul untuk isi baru */
        if (prev[i] !== nm && !reduce) im.parentNode.animate([{ transform: 'scale(.2)', opacity: 0 }, { transform: 'scale(1.22)', opacity: 1, offset: .45 }, { transform: 'scale(.9)', offset: .65 }, { transform: 'scale(1.07)', offset: .82 }, { transform: 'scale(1)' }], { duration: 620, easing: 'ease-out' });
      });
      prev = names;
      var full = cells.length > 0 && imgs.length === cells.length;
      if (full && !was) {
        var r = box.getBoundingClientRect();
        setTimeout(function () { stars(r.left + r.width / 2, r.top + r.height / 2, 16); }, 650);
        if (!reduce) box.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06) rotate(-1.5deg)' }, { transform: 'scale(1)' }], { duration: 500, delay: 650 });
        say('Kotaknya sudah penuh! 🎁', 2600);
      }
      var lid = box.querySelector('.sc-lid');
      if (full && !lid) {
        if (box.children[1]) box.children[1].style.zIndex = '3';
        lid = document.createElement('div'); lid.className = 'sc-lid';
        lid.style.cssText = 'position:absolute;left:-8px;right:-8px;top:-14px;height:34px;border-radius:14px;z-index:2;pointer-events:none;border:2.5px solid ' + K + ';box-shadow:0 6px 10px rgba(0,0,0,.15);background:' + getComputedStyle(box).borderTopColor + ';';
        var rb = document.createElement('i'); rb.style.cssText = 'position:absolute;left:50%;top:0;bottom:0;width:20px;margin-left:-10px;background:rgba(255,255,255,.55);';
        lid.appendChild(rb); box.appendChild(lid);
        if (!was && !reduce) lid.animate([{ transform: 'translateY(-150px) rotate(-10deg)', opacity: 0 }, { transform: 'translateY(4px) rotate(2deg)', opacity: 1, offset: .7 }, { transform: 'translateY(0)' }], { duration: 650, delay: 700, easing: 'ease-in', fill: 'backwards' });
      }
      was = full;
    }
    if (box) new MutationObserver(function () { if (!pend) pend = requestAnimationFrame(gift); }).observe(box, { childList: true, subtree: true });

    /* Ulasan terkirim: bintang meledak (dipicu oleh toast sukses) */
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) {
        var m = ms[i], nodes = m.type === 'characterData' ? [m.target] : [].slice.call(m.addedNodes);
        for (var j = 0; j < nodes.length; j++) {
          if (nodes[j].nodeType === 3 && /Terima kasih atas ulasanmu/.test(nodes[j].nodeValue)) {
            var b = $('#rvForm [type="submit"]'), r = b ? b.getBoundingClientRect() : null;
            if (!r || !r.width) r = { left: innerWidth / 2 - 1, top: innerHeight / 2, width: 2, height: 0 };
            stars(r.left + r.width / 2, r.top + r.height / 2, 14); say('Makasih ulasannya! ⭐', 2600); return;
          }
        }
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });

    /* Easter egg: klik logo 5x */
    var clicks = [];
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href="#"]');
      if (!a || a.textContent.indexOf('SWEET CRUMBS') < 0) return;
      var t = Date.now(); clicks = clicks.filter(function (x) { return t - x < 3000; }); clicks.push(t);
      if (clicks.length >= 5) { clicks = []; rain(40); jump(); say('Surprise! Hujan donat! 🎉', 3200); }
    });

    /* Uap oven di kartu roti */
    var steam = new WeakMap();
    document.addEventListener('pointerover', function (e) {
      if (reduce) return;
      var c = e.target.closest && e.target.closest('[data-category="breads"]');
      if (!c || c.contains(e.relatedTarget)) return;
      var t = Date.now(); if (t - (steam.get(c) || 0) < 1500) return; steam.set(c, t);
      var host = c.querySelector('.relative') || c;
      for (var i = 0; i < 5; i++) {
        var p = document.createElement('i'), s = 16 + Math.random() * 14;
        p.style.cssText = 'position:absolute;pointer-events:none;border-radius:50%;background:rgba(255,255,255,.85);filter:blur(5px);z-index:3;bottom:18%;width:' + s + 'px;height:' + s + 'px;left:' + (20 + Math.random() * 60) + '%;';
        host.appendChild(p);
        p.animate([{ transform: 'translateY(0) scale(.6)', opacity: 0 }, { opacity: .9, offset: .3 }, { transform: 'translateY(-' + (60 + Math.random() * 50) + 'px) scale(1.5)', opacity: 0 }], { duration: 1400, delay: i * 140, easing: 'ease-out', fill: 'both' })
          .onfinish = (function (n) { return function () { n.remove(); }; })(p);
      }
    });

    /* Saus selai di batas section kini ditangani fx.js */

    /* Progress scroll: roti baguette berjalan */
    var bar = document.createElement('div'); bar.setAttribute('aria-hidden', 'true');
    bar.style.cssText = 'position:fixed;top:env(safe-area-inset-top,0px);left:0;right:0;height:5px;z-index:9998;pointer-events:none;';
    var fill = document.createElement('div'); fill.style.cssText = 'height:100%;width:0;background:linear-gradient(90deg,#F5A9C5,#D4AF37);border-radius:0 4px 4px 0;';
    var loaf = document.createElement('div'); loaf.style.cssText = 'position:absolute;top:-8px;left:0;width:30px;height:30px;transform:translateX(-60%);'; loaf.innerHTML = svg('loaf');
    bar.appendChild(fill); bar.appendChild(loaf); document.body.appendChild(bar);
    var sr = 0;
    function prog() { sr = 0; var h = document.documentElement.scrollHeight - innerHeight, p = h > 0 ? Math.min(1, scrollY / h) : 0; fill.style.width = p * 100 + '%'; loaf.style.left = p * 100 + '%'; }
    addEventListener('scroll', function () { if (!sr) sr = requestAnimationFrame(prog); }, { passive: true }); prog();

    /* Ikon FAQ: donat kartun yang berputar saat dibuka */
    document.querySelectorAll('details').forEach(function (d) {
      var sp = d.querySelector('summary > span:last-child');
      if (!sp || !sp.querySelector('i.fa-chevron-down')) return;
      sp.innerHTML = '<span style="display:block;width:24px;height:24px">' + svg('donut') + '</span>';
      sp.style.setProperty('transform', 'none', 'important'); sp.style.flexShrink = '0';
      d.addEventListener('toggle', function () {
        if (reduce) return;
        sp.firstChild.animate([{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(200deg) scale(1.25)', offset: .5 }, { transform: 'rotate(360deg) scale(1)' }], { duration: 600, easing: 'ease-in-out' });
      });
    });

    setTimeout(buildMascot, 3800);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
