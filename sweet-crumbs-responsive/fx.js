/* Sweet Crumbs - efek tambahan (fx.js)
   1. Kue kecil melayang di belakang beranda   2. Saus selai pink & coklat yang lebih nyata
   3. Selai meleleh saat tombol diklik          4. Animasi kue terbang ke keranjang
   5. Maskot donat yang "hidup"                 6. Judul beranda bisa digerakkan saat diklik
   7. Pencarian menu yang toleran salah ketik */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var uid = 0;
  var PAL = ['#F5A9C5', '#D4AF37', '#FFF4DF', '#7bd1c0', '#ff8fa8', '#8b7be0'];

  function adj(h, t) {
    var n = parseInt(h.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, m = t < 0 ? 0 : 255, k = Math.abs(t);
    function f(v) { return Math.round(v + (m - v) * k); }
    return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')';
  }
  function grad(id, c1, c2) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient>';
  }
  function spr(x, y, a, c) { return '<rect x="' + x + '" y="' + y + '" width="8" height="3" rx="1.5" fill="' + c + '" transform="rotate(' + a + ' ' + (x + 4) + ' ' + (y + 1.5) + ')"/>'; }
  function gloss(d, o) { return '<path d="' + d + '" fill="none" stroke="#fff" stroke-opacity="' + (o || .55) + '" stroke-width="3.2" stroke-linecap="round"/>'; }

  /* ---------- Ilustrasi kaya (gradasi, kilau, bayangan) ---------- */
  function rich(kind, c) {
    var i = 'r' + (++uid), LN = 'stroke="#4a2a1a" stroke-opacity=".5" stroke-width="1.6" stroke-linejoin="round"';
    var sh = '<ellipse cx="50" cy="91" rx="30" ry="5" fill="#3b2418" opacity=".16"/>';
    var d = '', b = '', u = 'url(#' + i + 'a)';
    c = c || ({ cookie: '#e0a458', pudding: '#f6d860', crepe: '#f3d9a4', roll: '#e0a458' }[kind]) || '#F5A9C5';
    switch (kind) {
      case 'cupcake':
        d = grad(i + 'a', adj(c, .4), adj(c, -.08)) + grad(i + 'l', '#ffe3ec', '#f1a6c2');
        b = sh + '<path d="M22 56h56l-6 32H28z" fill="url(#' + i + 'l)" ' + LN + '/><path d="M34 58l3 29M46 58l1 29M58 58l-1 29M70 58l-3 29" stroke="#fff" stroke-opacity=".5" stroke-width="2.4"/>' +
          '<path d="M18 58c-2-9 6-14 14-14 0-10 9-17 18-17s18 7 18 17c8 0 16 5 14 14z" fill="' + u + '" ' + LN + '/>' + gloss('M30 52q20 6 40 0M36 42q14 5 28 0', .45) +
          '<circle cx="50" cy="22" r="7" fill="#d62f4b" ' + LN + '/><circle cx="48" cy="20" r="2" fill="#fff" fill-opacity=".85"/><path d="M50 15q3-6 8-7" stroke="#2f7a3c" stroke-width="2" fill="none"/>' + spr(30, 48, -20, '#ffd45e') + spr(60, 47, 25, '#fff');
        break;
      case 'croissant':
        d = grad(i + 'a', '#f6c970', '#c9832f');
        b = sh + '<g fill="' + u + '" ' + LN + '><ellipse cx="17" cy="66" rx="8" ry="13" transform="rotate(-50 17 66)"/><ellipse cx="83" cy="66" rx="8" ry="13" transform="rotate(50 83 66)"/><ellipse cx="29" cy="52" rx="12" ry="19" transform="rotate(-28 29 52)"/><ellipse cx="71" cy="52" rx="12" ry="19" transform="rotate(28 71 52)"/><ellipse cx="50" cy="46" rx="14" ry="23"/></g>' +
          '<path d="M40 36q-3 10 0 20M60 36q3 10 0 20" stroke="#a8631d" stroke-opacity=".5" stroke-width="1.6" fill="none"/>' + gloss('M43 29q7-4 14 0M23 46q3-7 9-10M77 46q-3-7-9-10');
        break;
      case 'cookie':
        d = grad(i + 'a', adj(c, .28), adj(c, -.14));
        b = sh + '<circle cx="50" cy="52" r="38" fill="' + u + '" ' + LN + '/>' + [[34, 38, 20], [60, 32, -20], [68, 56, 30], [38, 62, -10], [54, 72, 15], [26, 54, 0], [50, 50, 40]].map(function (p) {
          return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="6" ry="4.5" fill="#4a2a1a" transform="rotate(' + p[2] + ' ' + p[0] + ' ' + p[1] + ')"/><ellipse cx="' + (p[0] - 1.8) + '" cy="' + (p[1] - 1.5) + '" rx="2" ry="1.2" fill="#fff" fill-opacity=".35"/>';
        }).join('') + gloss('M21 40q4-12 16-16');
        break;
      case 'macaron':
        d = grad(i + 'a', adj(c, .38), adj(c, -.08));
        b = sh + '<path d="M14 52c0-20 16-28 36-28s36 8 36 28z" fill="' + u + '" ' + LN + '/><rect x="12" y="52" width="76" height="10" rx="5" fill="#fff6e6" ' + LN + '/><path d="M14 62h72c0 16-16 24-36 24S14 78 14 62z" fill="' + u + '" ' + LN + '/>' +
          '<path d="M20 52v-3M30 52v-4M40 52v-4M50 52v-4M60 52v-4M70 52v-4M80 52v-3" stroke="' + adj(c, -.25) + '" stroke-width="1.6" stroke-linecap="round"/>' + gloss('M26 40q6-10 18-12', .6);
        break;
      case 'slice':
        d = grad(i + 'a', adj(c, .4), adj(c, -.05)) + grad(i + 's', '#f8deA6', '#e0b068');
        b = sh + '<path d="M12 50h76v34a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6z" fill="url(#' + i + 's)" ' + LN + '/><rect x="12" y="64" width="76" height="8" fill="#fff6e6" stroke="#4a2a1a" stroke-opacity=".3"/>' +
          '<path d="M8 52q0-14 14-14h56q14 0 14 14z" fill="' + u + '" ' + LN + '/><path d="M16 52q2 11 8 0M40 52q2 13 9 0M66 52q2 10 8 0" fill="' + adj(c, .1) + '" ' + LN + '/>' +
          '<path d="M43 30q7-14 14 0q-7 7-14 0z" fill="#e0344f" ' + LN + '/><path d="M46 26q4-5 8 0" stroke="#3b8a3f" stroke-width="2.4" fill="none"/>' + gloss('M18 46q10-6 24-6', .45);
        break;
      case 'brownie':
        d = grad(i + 'a', '#7f4a31', '#3f2012');
        b = sh + '<rect x="12" y="38" width="76" height="46" rx="9" fill="' + u + '" ' + LN + '/>' + gloss('M22 48q10-6 22-2M52 46q14-6 26 0', .28) +
          '<path d="M18 58q10 8 20 0t20 0 24-2" stroke="#fff6e6" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M62 38c4-9 16-9 18 0 2 8-8 14-18 12z" fill="#c58a4b" ' + LN + '/>';
        break;
      case 'eclair':
        d = grad(i + 'a', '#f4d39b', '#d99d52') + grad(i + 'g', '#8a5a3c', '#47271a');
        b = sh + '<g transform="rotate(-12 50 56)"><rect x="8" y="42" width="84" height="32" rx="16" fill="' + u + '" ' + LN + '/><path d="M8 56q0-14 16-14h52q16 0 16 14c0 6-6 6-10 4-4 5-8 5-11 1-4 6-9 5-12 1-4 5-9 4-12 0-4 4-9 3-12-1-4 3-9 2-12-2-3 1-6-1-6-3z" fill="url(#' + i + 'g)" ' + LN + '/>' + gloss('M20 50h20M52 48h18', .4) + '</g>';
        break;
      case 'pudding':
        d = grad(i + 'a', adj(c, .3), adj(c, -.05)) + grad(i + 'c', '#dc8d2d', '#8f4a12');
        b = '<ellipse cx="50" cy="86" rx="36" ry="7" fill="#fff" ' + LN + '/><path d="M24 84l8-44h36l8 44z" fill="' + u + '" ' + LN + '/><ellipse cx="50" cy="40" rx="18" ry="6" fill="url(#' + i + 'c)" ' + LN + '/>' +
          '<path d="M33 42q0 16 5 18t5-18M58 42q0 12 4 14t4-14" fill="url(#' + i + 'c)"/><circle cx="50" cy="32" r="6" fill="#d62f4b" ' + LN + '/><circle cx="48" cy="30" r="1.8" fill="#fff" fill-opacity=".85"/>' + gloss('M42 40h12', .5);
        break;
      case 'roll':
        d = grad(i + 'a', '#f2c78d', '#c98a45');
        b = sh + '<circle cx="50" cy="54" r="38" fill="' + u + '" ' + LN + '/><path d="M50 54a5 5 0 0 1 10 0a10 10 0 0 1-20 0a15 15 0 0 1 30 0a20 20 0 0 1-40 0a25 25 0 0 1 50 0" fill="none" stroke="#8a4f1f" stroke-width="3" stroke-linecap="round"/>' +
          '<path d="M20 40q16-14 36-10t28 14M24 68q18 12 40 8t22-14" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".92"/>';
        break;
      case 'loaf':
        d = grad(i + 'a', '#f3c783', '#c78a42');
        b = sh + '<ellipse cx="50" cy="58" rx="42" ry="25" fill="' + u + '" transform="rotate(-6 50 58)" ' + LN + '/><path d="M26 52q6-8 12-6M42 48q6-8 12-6M58 48q6-8 12-6" stroke="#fff3d4" stroke-width="5" stroke-linecap="round" fill="none"/>' + gloss('M18 62q4-8 12-10', .4);
        break;
      case 'crepe':
        d = '';
        b = sh;
        for (var k = 0; k < 5; k++) b += '<rect x="14" y="' + (42 + k * 9) + '" width="72" height="10" rx="5" fill="' + (k % 2 ? '#fff6e6' : '#f1cf93') + '" ' + LN + '/>';
        b += '<ellipse cx="50" cy="40" rx="36" ry="8" fill="#fffaf0" ' + LN + '/><path d="M42 26q8-6 16 0q-2 12-8 14q-6-2-8-14z" fill="#e0344f" ' + LN + '/><path d="M46 24q4-5 8 0" stroke="#3b8a3f" stroke-width="2.4" fill="none"/>';
        break;
      default: /* donat */
        d = grad(i + 'a', '#f4c98a', '#d4893f') + grad(i + 'b', adj(c, .35), adj(c, -.1));
        b = sh + '<ellipse cx="50" cy="60" rx="42" ry="30" fill="' + u + '" ' + LN + '/>' +
          '<path d="M10 55C10 36 28 24 50 24s40 12 40 31q0 9-8 10q-6 5-12 0q-6 6-12 0q-6 6-12 0q-6 5-12 0q-6 3-8-2q-8-3-16-8z" fill="url(#' + i + 'b)" ' + LN + '/>' +
          '<ellipse cx="50" cy="53" rx="14" ry="9" fill="#5b3420" ' + LN + '/><ellipse cx="50" cy="51" rx="11" ry="6" fill="#7a4a2c"/>' + gloss('M18 48Q22 35 38 30') +
          spr(28, 40, -30, '#fff') + spr(42, 33, 20, '#ffd45e') + spr(60, 32, -20, '#7bd1c0') + spr(72, 42, 35, '#fff') + spr(24, 55, 10, '#7bd1c0') + spr(74, 55, -25, '#ffd45e') + spr(40, 66, 15, '#ffd45e') + spr(58, 66, -15, '#fff');
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><defs>' + d + '</defs>' + b + '</svg>';
  }

  /* ---------- Donat bergigitan (ikon brand) ---------- */
  function bitten() {
    var i = 'bt' + (++uid);
    return '<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true"><defs>' + grad(i + 'd', '#f4c98a', '#d08a42') + grad(i + 'g', '#ffc3d9', '#ee86ad') +
      '<mask id="' + i + 'm"><rect width="100" height="100" fill="#fff"/><circle cx="50" cy="52" r="11" fill="#000"/><circle cx="82" cy="24" r="14" fill="#000"/><circle cx="92" cy="42" r="9" fill="#000"/><circle cx="68" cy="12" r="9" fill="#000"/></mask></defs>' +
      '<g mask="url(#' + i + 'm)"><circle cx="50" cy="52" r="42" fill="url(#' + i + 'd)" stroke="#4a2a1a" stroke-opacity=".5" stroke-width="2"/><circle cx="50" cy="52" r="35" fill="url(#' + i + 'g)"/>' +
      '<path d="M22 38q8-14 24-16" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3.5" stroke-linecap="round"/>' + spr(24, 52, -30, '#fff') + spr(34, 72, 20, '#ffd45e') + spr(60, 76, -20, '#7bd1c0') + spr(70, 62, 35, '#fff') + spr(36, 30, 10, '#7bd1c0') + '</g>' +
      '<circle cx="86" cy="58" r="2.4" fill="#d08a42"/><circle cx="92" cy="66" r="1.8" fill="#d08a42"/><circle cx="80" cy="68" r="1.6" fill="#ee86ad"/></svg>';
  }

  /* ---------- 1. Kue kecil melayang di belakang beranda ---------- */
  function floatingBakes() {
    var hero = $('#hero'); if (!hero || hero.querySelector('.sc-bakes')) return;
    var st = document.createElement('style');
    st.textContent = '.sc-bakes{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden}' +
      '.sc-bk{position:absolute;left:var(--x);top:var(--y);width:var(--s);height:var(--s);animation:scBake var(--t) ease-in-out var(--d) infinite;filter:drop-shadow(0 4px 4px rgba(59,36,24,.16));will-change:transform}' +
      '.sc-bk svg{width:100%;height:100%;display:block}' +
      '@keyframes scBake{0%,100%{transform:translate(0,0) rotate(var(--r))}25%{transform:translate(var(--dx),calc(var(--dy)*-1)) rotate(calc(var(--r)*-1))}50%{transform:translate(calc(var(--dx)*-.6),var(--dy)) rotate(calc(var(--r)*.5))}75%{transform:translate(calc(var(--dx)*.8),calc(var(--dy)*.4)) rotate(calc(var(--r)*-.7))}}' +
      '@media(max-width:639px){.sc-bk:nth-child(n+9){display:none}}@media(prefers-reduced-motion:reduce){.sc-bk{animation:none}}';
    document.head.appendChild(st);
    /* [kiri%, atas%, ukuran px, jenis, warna, gerak x, gerak y, durasi, tunda, rotasi] */
    var L = [[3, 12, 30, 'donut', '#F5A9C5', 14, 18, 8, 0, 14], [9, 80, 26, 'cookie', null, 12, 16, 9, -2, 18], [47, 5, 28, 'croissant', null, 16, 14, 10, -4, 12], [50, 40, 24, 'macaron', '#9ccc65', 10, 20, 7, -1, 16],
      [47, 86, 30, 'cupcake', '#F5A9C5', 14, 14, 9, -5, 10], [95, 9, 28, 'slice', '#F5A9C5', 12, 18, 8, -3, 14], [95, 50, 26, 'donut', '#8b7be0', 10, 22, 10, -6, 20], [92, 88, 30, 'cookie', null, 16, 14, 8, -2, 12],
      [22, 4, 24, 'macaron', '#F5A9C5', 12, 14, 7, -3, 15], [32, 92, 26, 'roll', null, 14, 12, 9, -1, 12], [70, 3, 26, 'eclair', null, 16, 12, 10, -7, 10], [78, 94, 24, 'donut', '#6b3a24', 12, 14, 8, -4, 18],
      [2, 50, 24, 'cupcake', '#f6d860', 10, 20, 9, -2, 14], [62, 92, 22, 'macaron', '#f6d860', 12, 12, 7, -5, 16]];
    var w = document.createElement('div'); w.className = 'sc-bakes'; w.setAttribute('aria-hidden', 'true');
    L.forEach(function (p) {
      var e = document.createElement('div'); e.className = 'sc-bk';
      e.style.cssText = '--x:' + p[0] + '%;--y:' + p[1] + '%;--s:' + p[2] + 'px;--dx:' + p[5] + 'px;--dy:' + p[6] + 'px;--t:' + p[7] + 's;--d:' + p[8] + 's;--r:' + p[9] + 'deg';
      e.innerHTML = rich(p[3], p[4]); w.appendChild(e);
    });
    hero.appendChild(w);
  }

  /* ---------- 2. Saus selai pink & coklat yang lebih nyata ---------- */
  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  function drip(x, y0, sw, L, br) {
    var cy = y0 + L - br;
    return { p: 'M' + (x - sw - 6) + ' ' + y0 + 'Q' + (x - sw) + ' ' + y0 + ' ' + (x - sw) + ' ' + (y0 + 8) + 'V' + cy + 'H' + (x + sw) + 'V' + (y0 + 8) + 'Q' + (x + sw) + ' ' + y0 + ' ' + (x + sw + 6) + ' ' + y0 + 'Z', cy: cy, br: br };
  }
  function glazeSVG(w, col, seed) {
    var id = 'gz' + (++uid), h = 54, R = rng(seed), x = 16 + R() * 20, o = '', hi = '', n = 0;
    var wave = ''; for (var xx = w; xx > 0; xx -= 70) wave += 'Q' + (xx - 35) + ' ' + (5 + R() * 9).toFixed(1) + ' ' + Math.max(0, xx - 70) + ' 8';
    o += '<path d="M0 0H' + w + 'V8' + wave + 'Z"/>';
    while (x < w - 16) {
      var sw = 3.4 + R() * 2, br = sw + 2 + R() * 1, L = br + 7 + R() * 10 + (R() < .28 ? 16 : 0), dp = drip(x, 7, sw, L, br);
      o += '<g class="sc-dp"><path d="' + dp.p + '"/><circle cx="' + x + '" cy="' + dp.cy + '" r="' + br + '"/>' +
        '<path d="M' + (x - sw + 2.4) + ' 15V' + (dp.cy - 3) + '" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round" fill="none"/>' +
        '<ellipse cx="' + (x - br * .38) + '" cy="' + (dp.cy - br * .3) + '" rx="' + (br * .26) + '" ry="' + (br * .18) + '" fill="#fff" fill-opacity=".7" transform="rotate(-30 ' + (x - br * .38) + ' ' + (dp.cy - br * .3) + ')"/></g>';
      x += sw * 2 + 26 + R() * 56;
    }
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true" style="display:block;overflow:visible;filter:drop-shadow(0 2px 2px rgba(60,20,30,.18))"><defs><linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="' + h + '"><stop offset="0" stop-color="' + col[0] + '"/><stop offset="1" stop-color="' + col[1] + '"/></linearGradient></defs>' +
      '<g fill="url(#' + id + ')">' + o + '</g><path d="M10 3.4H' + (w - 10) + '" stroke="#fff" stroke-opacity=".38" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="120 30 50 80" fill="none"/></svg>';
  }
  function glaze() {
    var COLS = [['#ffc3d9', '#ee86ad'], ['#8d5a3b', '#46251a']];
    document.querySelectorAll('[data-page="beranda"] section').forEach(function (s, i) {
      if (!i || s.querySelector(':scope > .sc-gz')) return;
      var col = COLS[(i - 1) % 2], seed = 97 + i * 31;
      if (getComputedStyle(s).position === 'static') s.style.position = 'relative';
      var wrap = document.createElement('div'); wrap.className = 'sc-gz'; wrap.setAttribute('aria-hidden', 'true');
      wrap.style.cssText = 'position:absolute;top:0;left:0;right:0;height:54px;pointer-events:none;z-index:2;';
      s.insertBefore(wrap, s.firstChild);
      var lastW = 0, shown = false;
      function build() {
        var w = Math.round(s.getBoundingClientRect().width); if (!w || w === lastW) return; lastW = w;
        wrap.innerHTML = glazeSVG(w, col, seed);
        if (shown) return;
        wrap.querySelectorAll('.sc-dp').forEach(function (g) { g.style.cssText = 'transform-box:fill-box;transform-origin:50% 0;' + (reduce ? '' : 'transform:scaleY(0)'); });
      }
      build();
      if ('ResizeObserver' in window) new ResizeObserver(build).observe(s); else addEventListener('resize', build);
      if (reduce || !('IntersectionObserver' in window)) { shown = true; wrap.querySelectorAll('.sc-dp').forEach(function (g) { g.style.transform = 'none'; }); return; }
      var io = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; io.disconnect(); shown = true;
        wrap.querySelectorAll('.sc-dp').forEach(function (g, k) {
          g.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1.1)', offset: .7 }, { transform: 'scaleY(1)' }], { duration: 950, delay: k * 55, easing: 'ease-out', fill: 'forwards' });
        });
      }, { threshold: .15 });
      io.observe(s);
    });
  }

  /* ---------- 3. Selai meleleh saat tombol diklik ---------- */
  var BLOCK = '[data-nav],[data-nav-bottom],.add-to-cart-trigger,.pt-qv-add,summary,label,#scMascot,[data-no-jam]';
  function parseRGB(s) { var m = /rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,\/]+([\d.]+))?/.exec(s); return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] == null ? 1 : +m[4] } : null; }
  function bgOf(el) { for (var n = el; n && n.nodeType === 1; n = n.parentElement) { var c = parseRGB(getComputedStyle(n).backgroundColor); if (c && c.a > .35) return c; } return { r: 255, g: 255, b: 255, a: 1 }; }
  function wantsJam(t) {
    /* Efek selai saat klik dinonaktifkan sesuai revisi; animasi produk tetap berjalan. */
    return false;
    if (reduce || !t || t.disabled || (t.closest && t.closest(BLOCK))) return false;
    var r = t.getBoundingClientRect(); if (r.width < 34 || r.height < 28) return false;
    if (t.tagName === 'A') {
      var cs = getComputedStyle(t), c = parseRGB(cs.backgroundColor);
      return !!((c && c.a > .2) || parseFloat(cs.borderTopWidth) > 0) && parseFloat(cs.paddingLeft) >= 10 && r.width >= 60;
    }
    return /^(BUTTON|INPUT)$/.test(t.tagName) || t.getAttribute('role') === 'button';
  }
  function jam(btn, ev) {
    if (btn.dataset.scJam) return; btn.dataset.scJam = '1';
    var r = btn.getBoundingClientRect(), w = r.width, h = r.height, cs = getComputedStyle(btn), c = bgOf(btn), lum = (.299 * c.r + .587 * c.g + .114 * c.b) / 255;
    var pinkish = c.r > 200 && c.b > 130 && c.g < 205 && c.r - c.g > 40;
    var col = pinkish ? ['#2c8a68', '#0f3a2d'] : ['#ffc3d9', '#ee86ad'];
    var id = 'jm' + (++uid), R = rng((Date.now() % 9973) + 7), maxD = 12 + h * .35, o = '', x = 10 + R() * 8;
    while (x < w - 8) {
      var sw = 3.6 + R() * 2.2, br = sw + 2.4, L = br + 6 + R() * Math.max(2, maxD - br - 6), dp = drip(x, h - 2, sw, L + 2, br);
      o += '<path d="' + dp.p + '"/><circle cx="' + x + '" cy="' + dp.cy + '" r="' + br + '"/><path d="M' + (x - sw + 1.6) + ' ' + (h + 4) + 'V' + (dp.cy - 2) + '" stroke="#fff" stroke-opacity=".5" stroke-width="1.6" stroke-linecap="round" fill="none"/>';
      x += sw * 2 + 14 + R() * 22;
    }
    var T = h + maxD + 14;
    var wrap = document.createElement('div'); wrap.setAttribute('aria-hidden', 'true');
    wrap.style.cssText = 'position:fixed;left:' + r.left + 'px;top:' + r.top + 'px;width:' + w + 'px;height:' + h + 'px;border-radius:' + cs.borderRadius + ';overflow:hidden;pointer-events:none;z-index:2147483001;';
    wrap.innerHTML = '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" style="display:block;overflow:visible"><defs><linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="' + h + '"><stop offset="0" stop-color="' + col[0] + '"/><stop offset="1" stop-color="' + col[1] + '"/></linearGradient></defs>' +
      '<g class="j"><g fill="url(#' + id + ')"><rect x="-2" y="-14" width="' + (w + 4) + '" height="' + (h + 14) + '"/>' + o + '</g><path d="M8 ' + (h * .22) + 'H' + (w - 8) + '" stroke="#fff" stroke-opacity=".42" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="46 16 18 30" fill="none"/></g></svg>';
    document.body.appendChild(wrap);
    var g = wrap.querySelector('.j');
    var a = g.animate([{ transform: 'translateY(-' + T + 'px)', easing: 'cubic-bezier(.2,.8,.25,1)' }, { transform: 'translateY(0)', offset: .38, easing: 'linear' }, { transform: 'translateY(0)', offset: .68, easing: 'cubic-bezier(.5,0,.8,.45)' }, { transform: 'translateY(' + T + 'px)' }], { duration: 1400, fill: 'forwards' });
    /* hiasan sprinkle yang muncul dari tepi atas tombol */
    for (var k = 0; k < 9; k++) (function (k) {
      var s = document.createElement('i'), sx = r.left + 8 + R() * (w - 16);
      s.style.cssText = 'position:fixed;left:' + sx + 'px;top:' + (r.top + 4) + 'px;width:' + (7 + R() * 3) + 'px;height:3px;border-radius:2px;pointer-events:none;z-index:2147483002;background:' + PAL[k % PAL.length] + ';box-shadow:0 0 0 1px rgba(0,0,0,.08)';
      document.body.appendChild(s);
      s.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 0 }, { transform: 'translate(' + ((R() - .5) * 26) + 'px,' + (-14 - R() * 16) + 'px) rotate(' + (R() * 200 - 100) + 'deg)', opacity: 1, offset: .35 },
        { transform: 'translate(' + ((R() - .5) * 44) + 'px,' + (6 + R() * 12) + 'px) rotate(' + (R() * 400 - 200) + 'deg)', opacity: 0 }], { duration: 900 + R() * 300, delay: 250 + k * 40, easing: 'ease-out', fill: 'forwards' }).onfinish = function () { s.remove(); };
    })(k);
    a.onfinish = function () { wrap.remove(); delete btn.dataset.scJam; };
  }
  function initJam() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('button,a,[role="button"],input[type="submit"],input[type="button"]');
      if (t && wantsJam(t)) jam(t, e);
    }, true);
  }

  /* ---------- 4. Kue terbang ke keranjang ---------- */
  function cartProductBurst(cart) {
    if (reduce) return;
    var A = window.SCArt, sp = A && A.last ? A.last() : null;
    if (!sp) sp = { kind: 'donut', color: '#F5A9C5' };
    var b = cart.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    for (var i = 0; i < 9; i++) (function (i) {
      var size = 25 + Math.random() * 13, el = document.createElement('div');
      el.setAttribute('aria-hidden', 'true'); el.innerHTML = rich(sp.kind, sp.color);
      el.style.cssText = 'position:fixed;left:' + (cx - size / 2) + 'px;top:' + (cy - size / 2) + 'px;width:' + size + 'px;height:' + size + 'px;z-index:2147483003;pointer-events:none;filter:drop-shadow(0 3px 3px rgba(59,36,24,.18));';
      document.body.appendChild(el);
      var angle = -Math.PI / 2 + (Math.random() - .5) * 2.5, distance = 34 + Math.random() * 48;
      el.animate([
        { transform: 'translate(0,0) scale(.35) rotate(0)', opacity: 0 },
        { transform: 'translate(' + (Math.cos(angle) * distance * .72) + 'px,' + (Math.sin(angle) * distance * .72) + 'px) scale(1.08) rotate(' + (Math.random() * 100 - 50) + 'deg)', opacity: 1, offset: .42 },
        { transform: 'translate(' + (Math.cos(angle) * distance) + 'px,' + (Math.sin(angle) * distance + 24) + 'px) scale(.62) rotate(' + (Math.random() * 180 - 90) + 'deg)', opacity: 0 }
      ], { duration: 760 + Math.random() * 180, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' }).onfinish = function () { el.remove(); };
    })(i);
  }
  function land(cart) {
    var b = cart.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2, badge = $('#cartCountBadge');
    cartProductBurst(cart);
    cart.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1.18,.84)', offset: .22 }, { transform: 'scale(.94,1.1)', offset: .5 }, { transform: 'scale(1.04,.97)', offset: .75 }, { transform: 'scale(1,1)' }], { duration: 620, easing: 'ease-out' });
    if (badge) badge.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.9)' }, { transform: 'scale(1)' }], { duration: 560, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    var ring = document.createElement('i');
    ring.style.cssText = 'position:fixed;z-index:2147483001;pointer-events:none;left:' + cx + 'px;top:' + cy + 'px;width:46px;height:46px;border-radius:50%;border:2px solid #F5A9C5;';
    document.body.appendChild(ring);
    ring.animate([{ transform: 'translate(-50%,-50%) scale(.3)', opacity: 1 }, { transform: 'translate(-50%,-50%) scale(1.8)', opacity: 0 }], { duration: 600, easing: 'ease-out' }).onfinish = function () { ring.remove(); };
    for (var i = 0; i < 12; i++) (function (i) {
      var p = document.createElement('i'), t = i % 3, s = t === 2 ? 9 : 6, col = t === 1 ? '#e8b36a' : PAL[i % PAL.length];
      p.style.cssText = 'position:fixed;z-index:2147483001;pointer-events:none;left:' + (cx - s / 2) + 'px;top:' + (cy - s / 2) + 'px;width:' + (t === 0 ? 9 : s) + 'px;height:' + (t === 0 ? 3 : s) + 'px;border-radius:' + (t === 0 ? '2px' : '50%') + ';' + (t === 2 ? 'border:2.5px solid #F5A9C5;box-sizing:border-box;' : 'background:' + col + ';');
      document.body.appendChild(p);
      var ang = Math.PI * 2 * i / 12 + Math.random() * .4, d = 26 + Math.random() * 30;
      p.animate([{ transform: 'translate(0,0) rotate(0) scale(1)', opacity: 1 }, { transform: 'translate(' + Math.cos(ang) * d + 'px,' + (Math.sin(ang) * d + 12) + 'px) rotate(' + (Math.random() * 360 - 180) + 'deg) scale(.5)', opacity: 0 }],
        { duration: 600 + Math.random() * 300, easing: 'cubic-bezier(.15,.8,.25,1)' }).onfinish = function () { p.remove(); };
    })(i);
  }
  function fly(img, cart) {
    var A = window.SCArt, a = img.getBoundingClientRect(), b = cart.getBoundingClientRect();
    if (!a.width || !a.height) return;
    var sp = (A && A.last && A.last()) || (A && A.rand && A.rand()) || { kind: 'donut' };
    var S = Math.max(64, Math.min(112, Math.min(a.width, a.height) * .55));
    var sx = a.left + a.width / 2, sy = a.top + a.height / 2, ex = b.left + b.width / 2, ey = b.top + b.height / 2;
    var cxp = (sx + ex) / 2 + (ex < sx ? 28 : -28), cyp = Math.min(sy, ey) - 104 - Math.random() * 26;
    var el = document.createElement('div'); el.setAttribute('aria-hidden', 'true');
    el.style.cssText = 'position:fixed;left:0;top:0;width:' + S + 'px;height:' + S + 'px;z-index:2147483001;pointer-events:none;will-change:transform;filter:drop-shadow(0 12px 10px rgba(59,36,24,.28));border-radius:18px;overflow:hidden;';
    var photo = document.createElement('img'); photo.src = img.currentSrc || img.src; photo.alt = ''; photo.draggable = false;
    photo.style.cssText = 'display:block;width:100%;height:100%;object-fit:cover;border-radius:18px;';
    el.appendChild(photo);
    document.body.appendChild(el);
    var pos = function (x, y, sc, rot, sqx, sqy) { el.style.transform = 'translate3d(' + (x - S / 2) + 'px,' + (y - S / 2) + 'px,0) rotate(' + rot + 'deg) scale(' + (sc * sqx) + ',' + (sc * sqy) + ')'; };
    pos(sx, sy, 1, 0, 1, 1);
    var T0 = performance.now(), PRE = 150, DUR = 940, lastTrail = 0, done = false;
    function frame(now) {
      var t = now - T0;
      if (t < PRE) { /* ancang-ancang: mengempis lalu meregang naik */
        var q = t / PRE, sqx = q < .5 ? 1 + .18 * (q / .5) : 1.18 - .26 * ((q - .5) / .5), sqy = q < .5 ? 1 - .16 * (q / .5) : .84 + .3 * ((q - .5) / .5);
        pos(sx, sy - (q > .5 ? 14 * ((q - .5) / .5) : 0), 1, 0, sqx, sqy);
        requestAnimationFrame(frame); return;
      }
      var u = Math.min(1, (t - PRE) / DUR), e = u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2, m = 1 - e;
      var x = m * m * sx + 2 * m * e * cxp + e * e * ex, y = m * m * (sy - 14) + 2 * m * e * cyp + e * e * ey;
      var sc = 1 - .70 * Math.pow(e, 1.25), rot = Math.sin(e * Math.PI * 1.25) * 11 - e * 8, st = 1 + .07 * Math.sin(e * Math.PI);
      pos(x, y, sc, rot, 1 / st, st);
      if (u > .9) el.style.opacity = String(Math.max(0, 1 - (u - .9) / .1));
      if (now - lastTrail > 42 && u < .92) { lastTrail = now; trail(x, y, sc * S); }
      if (u < 1) requestAnimationFrame(frame); else if (!done) { done = true; el.remove(); land(cart); }
    }
    requestAnimationFrame(frame);
  }
  function trail(x, y, size) {
    var p = document.createElement('i'), t = Math.random() < .5, s = 4 + Math.random() * 4;
    p.style.cssText = 'position:fixed;z-index:2147483000;pointer-events:none;left:' + (x + (Math.random() - .5) * size * .5) + 'px;top:' + (y + (Math.random() - .5) * size * .5) + 'px;width:' + (t ? s + 3 : s) + 'px;height:' + (t ? 3 : s) + 'px;border-radius:' + (t ? '2px' : '50%') + ';background:' + PAL[Math.floor(Math.random() * PAL.length)] + ';';
    document.body.appendChild(p);
    p.animate([{ transform: 'translate(0,0) rotate(0) scale(1)', opacity: .95 }, { transform: 'translate(' + ((Math.random() - .5) * 20) + 'px,' + (10 + Math.random() * 22) + 'px) rotate(' + (Math.random() * 300 - 150) + 'deg) scale(.3)', opacity: 0 }],
      { duration: 520 + Math.random() * 200, easing: 'ease-out' }).onfinish = function () { p.remove(); };
  }

  /* ---------- 5. Maskot donat yang hidup ---------- */
  function aliveMascot() { return; // Prevent duplicate, misaligned face overlays; cartoon.js animates the real eyes.
    var tries = 0, iv = setInterval(function () {
      var mas = $('#scMascot'); tries++;
      if (!mas && tries < 40) return; clearInterval(iv); if (!mas) return;
      var svg = mas.querySelector('svg'), A = window.SCArt || {};
      var say = A.say || function () {};
      svg.insertAdjacentHTML('beforeend',
        '<path d="M19 50Q24 38 40 35" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3.4" stroke-linecap="round"/>' +
        '<g id="scLids" style="transform-box:fill-box"><ellipse class="sc-lid" cx="36" cy="62" rx="7.8" ry="7.8" fill="#F5A9C5" stroke="#3b2418" stroke-width="2.4"/><ellipse class="sc-lid" cx="64" cy="62" rx="7.8" ry="7.8" fill="#F5A9C5" stroke="#3b2418" stroke-width="2.4"/></g>' +
        '<g class="sc-open" style="opacity:0"><path d="M41 72q9 15 18 0z" fill="#7a2a3a" stroke="#3b2418" stroke-width="2.4" stroke-linejoin="round"/><path d="M45 79q5 4 10 0q-5-3-10 0z" fill="#ff8fa8"/></g>');
      var lids = [].slice.call(svg.querySelectorAll('.sc-lid')), open = svg.querySelector('.sc-open');
      lids.forEach(function (l) { l.style.cssText = 'transform-box:fill-box;transform-origin:50% 0;opacity:0;transform:scaleY(.05);transition:opacity .35s,transform .35s'; });
      var asleep = false, last = Date.now();
      function blink() {
        if (reduce || asleep) return;
        lids.forEach(function (l) { l.animate([{ transform: 'scaleY(.05)', opacity: 0 }, { transform: 'scaleY(1)', opacity: 1, offset: .45 }, { transform: 'scaleY(.05)', opacity: 0 }], { duration: 190 }); });
      }
      (function loop() { setTimeout(function () { blink(); if (Math.random() < .25) setTimeout(blink, 260); loop(); }, 2400 + Math.random() * 3200); })();
      function setSleep(on) {
        asleep = on;
        lids.forEach(function (l) { l.style.opacity = on ? 1 : 0; l.style.transform = on ? 'scaleY(.62)' : 'scaleY(.05)'; });
      }
      function wake() { last = Date.now(); if (asleep) { setSleep(false); say('Eh, kamu balik! 👋', 2600); } }
      ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (ev) { addEventListener(ev, wake, { passive: true }); });
      setInterval(function () { if (!asleep && Date.now() - last > 28000) { setSleep(true); say('Zzz… 💤', 4000); } else if (asleep && Math.random() < .3) say('Zzz… 💤', 3000); }, 6000);
      mas.addEventListener('click', function () {
        if (reduce) return;
        open.style.opacity = 1; setTimeout(function () { open.style.opacity = 0; }, 900);
        var r = mas.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * .35;
        for (var i = 0; i < 12; i++) (function (i) {
          var s = document.createElement('i');
          s.style.cssText = 'position:fixed;z-index:2147483001;pointer-events:none;left:' + cx + 'px;top:' + cy + 'px;width:8px;height:3px;border-radius:2px;background:' + PAL[i % PAL.length];
          document.body.appendChild(s);
          var ang = -Math.PI / 2 + (Math.random() - .5) * 2.2, d = 40 + Math.random() * 50;
          s.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: 'translate(' + Math.cos(ang) * d + 'px,' + (Math.sin(ang) * d + 40) + 'px) rotate(' + (Math.random() * 500 - 250) + 'deg)', opacity: 0 }],
            { duration: 800 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = function () { s.remove(); };
        })(i);
      });
      var CH = ['Psst, donat pink lagi jadi favorit hari ini 🍩', 'Croissant lagi hangat-hangatnya 🥐', 'Jangan lupa intip Racik Hadiah ya 🎁', 'Ada yang mau matcha? 🍵', 'Cookies-nya baru keluar oven 🍪', 'Aku jagain keranjangmu ya!'];
      setInterval(function () {
        var bub = mas.querySelector('.sc-bub');
        if (asleep || document.hidden || (bub && bub.classList.contains('on')) || Math.random() > .6) return;
        say(CH[Math.floor(Math.random() * CH.length)], 3400);
      }, 17000);
    }, 500);
  }

  /* ---------- 6. Judul beranda bergerak saat diklik ---------- */
  function title() {
    var h = $('#hero h1.sc-float'); if (!h || h.dataset.fx) return; h.dataset.fx = '1';
    h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
    var wrap = document.createElement('span'); wrap.className = 'sc-t3d'; wrap.setAttribute('aria-hidden', 'true');
    while (h.firstChild) wrap.appendChild(h.firstChild);
    h.appendChild(wrap);
    var ch = [];
    (function split(n) {
      [].slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var f = document.createDocumentFragment();
          c.nodeValue.replace(/\s+/g, ' ').split('').forEach(function (x) {
            if (x === ' ') f.appendChild(document.createTextNode(' '));
            else { var s = document.createElement('span'); s.className = 'sc-ch'; s.textContent = x; f.appendChild(s); ch.push(s); }
          });
          c.parentNode.replaceChild(f, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') split(c);
      });
    })(wrap);
    var st = document.createElement('style');
    st.textContent = '#hero h1.sc-float{cursor:pointer;-webkit-user-select:none;user-select:none}.sc-t3d{display:inline-block;transform-origin:50% 60%}.sc-ch{display:inline-block;text-decoration:inherit}';
    document.head.appendChild(st);
    var n = 0, busy = false;
    function run(k) {
      var P = 'perspective(700px) ';
      if (k === 0) ch.forEach(function (s, i) { s.animate([{ transform: 'translateY(0) scale(1,1)' }, { transform: 'translateY(-14px) scale(.9,1.2)', offset: .3 }, { transform: 'translateY(2px) scale(1.15,.8)', offset: .55 }, { transform: 'translateY(-4px) scale(.97,1.05)', offset: .78 }, { transform: 'none' }], { duration: 760, delay: i * 35, easing: 'ease-out' }); });
      else if (k === 1) wrap.animate([{ transform: P + 'rotateY(0)' }, { transform: P + 'rotateY(-18deg) rotateZ(-1.5deg)', offset: .25 }, { transform: P + 'rotateY(16deg) rotateZ(1.5deg)', offset: .6 }, { transform: P + 'rotateY(-6deg)', offset: .82 }, { transform: P + 'rotateY(0)' }], { duration: 1300, easing: 'ease-in-out' });
      else ch.forEach(function (s, i) { s.animate([{ transform: 'rotate(0)' }, { transform: 'translateY(-10px) rotate(' + (i % 2 ? 14 : -14) + 'deg)', offset: .35 }, { transform: 'translateY(0) rotate(' + (i % 2 ? -8 : 8) + 'deg)', offset: .7 }, { transform: 'none' }], { duration: 700, delay: i * 28 }); });
    }
    h.addEventListener('click', function () {
      if (reduce || busy) return; busy = true; run(n++ % 3); setTimeout(function () { busy = false; }, 1400);
    });
  }

  /* ---------- 7. Pencarian menu toleran salah ketik ---------- */
  function skel(s) { return s.toLowerCase().replace(/th/g, 't').replace(/tch/g, 'ch').replace(/ch/g, 'c').replace(/ph/g, 'f').replace(/(.)\1+/g, '$1').replace(/k/g, 'c'); }
  function dist(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) { d[i] = [i]; } for (j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
    return d[m][n];
  }
  function initSearch() {
    var input = $('#catalogSearchInput'), grid = $('#productGridContainer'); if (!input || !grid) return;
    var cards = [].slice.call(grid.children).filter(function (c) { return c.hasAttribute('data-category'); }), vocab = null;
    var box = document.createElement('div'); box.id = 'scSuggest'; box.hidden = true; box.setAttribute('role', 'status');
    box.style.cssText = 'margin:0 0 20px;padding:14px 18px;border-radius:18px;background:#fff;border:1.5px dashed #F5A9C5;color:#123F32;font:500 14px/1.5 Poppins,sans-serif';
    grid.parentNode.insertBefore(box, grid);
    function txt(c) { return ((c.querySelector('h3') || {}).textContent + ' ' + ((c.querySelector('p') || {}).textContent || '')).toLowerCase(); }
    function build() {
      vocab = {};
      cards.forEach(function (c) {
        var ti = ((c.querySelector('h3') || {}).textContent || '').toLowerCase().match(/[a-z]{3,}/g) || [], de = ((c.querySelector('p') || {}).textContent || '').toLowerCase().match(/[a-z]{4,}/g) || [];
        ti.forEach(function (w) { vocab[w] = (vocab[w] || 0) + 3; }); de.forEach(function (w) { vocab[w] = (vocab[w] || 0) + 1; });
      });
    }
    function nearest(t) {
      if (!vocab) build();
      var s = skel(t), best = null, bd = 99, bw = 0;
      Object.keys(vocab).forEach(function (w) {
        var ws = skel(w), L = Math.max(s.length, ws.length), thr = L <= 3 ? 0 : L <= 5 ? 1 : 2;
        if (s[0] !== ws[0] && L <= 5) return;
        var d = dist(s, ws); if (d > thr) return;
        if (d < bd || (d === bd && vocab[w] > bw)) { best = w; bd = d; bw = vocab[w]; }
      });
      return best;
    }
    function esc(s) { return s.replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
    var chip = 'cursor:pointer;border:0;border-radius:999px;padding:4px 12px;margin:2px 4px 2px 0;font:600 13px Poppins,sans-serif;background:#123F32;color:#fff';
    /* ejaan mirip (maca = matcha) walau ada hasil lain: tampilkan saran tanpa mengubah hasil */
    function hint(q) {
      if (!vocab) build();
      var t = q.split(/\s+/).filter(function (w) { return w.length >= 3 && !vocab[w]; })[0]; if (!t) return;
      var s = skel(t), best = null, bw = 0;
      Object.keys(vocab).forEach(function (w) { if (w !== t && skel(w) === s && vocab[w] > bw) { best = w; bw = vocab[w]; } });
      if (!best) return;
      box.innerHTML = '🍩 Mungkin maksud kamu <button type="button" data-fix style="' + chip + '">' + esc(best) + '</button>?';
      box.querySelector('[data-fix]').addEventListener('click', function () { input.value = best; input.dispatchEvent(new Event('input', { bubbles: true })); });
      box.hidden = false;
    }
    function run() {
      box.hidden = true; box.innerHTML = '';
      var q = input.value.trim().toLowerCase(), em = grid.querySelector(':scope > .col-span-full');
      if (!q || !cards.length) return;
      if (!cards.every(function (c) { return c.style.display === 'none'; })) { hint(q); return; }
      if (em) em.style.setProperty('display', 'none', 'important');
      var actBtn = document.querySelector('[data-category-btn].bg-sc-deep-green'), cat = actBtn ? actBtn.dataset.categoryBtn : 'all';
      var inCat = function (c) { return cat === 'all' || (c.dataset.category || '').split(' ').indexOf(cat) > -1; };
      var toks = q.split(/\s+/), fixed = [], changed = false, unknown = false;
      toks.forEach(function (t) {
        if (cards.some(function (c) { return txt(c).indexOf(t) > -1; })) { fixed.push(t); return; }
        var n = t.length >= 3 ? nearest(t) : null;
        if (n) { fixed.push(n); changed = true; } else { fixed.push(t); unknown = true; }
      });
      var hits = changed && !unknown ? cards.filter(function (c) { return inCat(c) && fixed.every(function (t) { return txt(c).indexOf(t) > -1; }); }) : [];
      if (hits.length) {
        hits.forEach(function (c) { c.style.display = 'flex'; });
        var fx = fixed.join(' ');
        box.innerHTML = '🍩 Maksud kamu <button type="button" data-fix style="' + chip + '">' + esc(fx) + '</button>? Ini hasil untuk <b>' + esc(fx) + '</b>.';
        box.querySelector('[data-fix]').addEventListener('click', function () { input.value = fx; input.dispatchEvent(new Event('input', { bubbles: true })); });
      } else {
        var pool = cards.filter(inCat).sort(function (a, b) { return (b.dataset.rating - a.dataset.rating) || (a.dataset.order - b.dataset.order); }).slice(0, 4);
        pool.forEach(function (c) { c.style.display = 'flex'; });
        var cats = [].slice.call(document.querySelectorAll('[data-category-btn]'));
        box.innerHTML = 'Hmm, <b>“' + esc(q) + '”</b> belum ketemu. Ini beberapa menu favorit yang mungkin kamu suka, atau coba kategori: ' +
          cats.map(function (b, i) { return '<button type="button" data-cat="' + i + '" style="' + chip + '">' + esc(b.textContent.trim()) + '</button>'; }).join('');
        [].slice.call(box.querySelectorAll('[data-cat]')).forEach(function (bt) {
          bt.addEventListener('click', function () { input.value = ''; input.dispatchEvent(new Event('input', { bubbles: true })); cats[+bt.dataset.cat].click(); });
        });
      }
      box.hidden = false;
    }
    var later = function () { setTimeout(run, 0); };
    input.addEventListener('input', later);
    var sort = $('#catalogSort'); if (sort) sort.addEventListener('change', later);
    document.querySelectorAll('[data-category-btn]').forEach(function (b) { b.addEventListener('click', later); });
  }

  /* ---------- Mulai ---------- */
  window.SCFx = { fly: fly, wantsJam: wantsJam, rich: rich, bitten: bitten };
  function init() {
    floatingBakes(); glaze(); title(); initJam(); aliveMascot();
    setTimeout(initSearch, 0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
