/* Sweet Crumbs - maskot interaktif, benda melayang bisa dipecah, judul bereaksi */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, $ = function (s, r) { return (r || document).querySelector(s); };
  var COL = ['#ff8fb8', '#ffd45e', '#7bd1c0', '#b79cf0', '#ff9f68', '#ffffff'], WORDS = ['Yummy!', 'Hmm, enak!', 'Manis!', 'Good mood!', 'Nyam!'];

  /* ---- percikan sprinkles + bintang ---- */
  var live = 0;
  function burst(x, y, word) {
    if (reduce || live > 40) return;
    for (var i = 0; i < 12; i++) {
      var e = document.createElement('i'), a = Math.random() * 6.28, d = 30 + Math.random() * 50, star = i % 4 === 0;
      e.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;z-index:9999;pointer-events:none;' + (star ? 'font-style:normal;font-size:14px;color:' + COL[i % 5] + ';' : 'width:4px;height:11px;border-radius:3px;background:' + COL[i % 6] + ';');
      if (star) e.textContent = '✦';
      document.body.appendChild(e); live++;
      e.animate([{ transform: 'translate(-50%,-50%) rotate(0)', opacity: 1 }, { transform: 'translate(' + Math.cos(a) * d + 'px,' + (Math.sin(a) * d + 22) + 'px) rotate(' + (Math.random() * 540) + 'deg)', opacity: 0 }], { duration: 650 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = (function (n) { return function () { n.remove(); live--; }; })(e);
    }
    if (word) {
      var t = document.createElement('b'); t.textContent = word;
      t.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;z-index:9999;pointer-events:none;font:800 15px/1 system-ui,sans-serif;color:#ee5f95;text-shadow:0 1px 0 #fff,0 0 6px #fff;transform:translate(-50%,-50%)';
      document.body.appendChild(t);
      t.animate([{ transform: 'translate(-50%,-50%) scale(.6)', opacity: 0 }, { transform: 'translate(-50%,-90%) scale(1.1)', opacity: 1, offset: .3 }, { transform: 'translate(-50%,-220%) scale(1)', opacity: 0 }], { duration: 1100, easing: 'ease-out' }).onfinish = function () { t.remove(); };
    }
  }

  /* ---- benda melayang: tap untuk pecah, muncul lagi ---- */
  var pops = 0;
  function bakes() {
    var w = $('.sc-bakes'); if (!w || w.dataset.play) return; w.dataset.play = '1';
    var st = document.createElement('style');
    st.textContent = '.sc-bakes{z-index:20!important}.sc-bk{pointer-events:auto;cursor:grab;touch-action:none;-webkit-tap-highlight-color:transparent}.sc-bk::before{content:"";position:absolute;inset:-12px;border-radius:50%}.sc-bk.gone{visibility:hidden}';
    document.head.appendChild(st);
    var D = null;
    function pop(b) {
      sfx('pop');
      var r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, WORDS[pops++ % WORDS.length]);
      if (!reduce) b.animate([{ scale: 1 }, { scale: 1.5, offset: .35 }, { scale: 0 }], { duration: 260 });
      b.classList.add('gone'); window.dispatchEvent(new CustomEvent('sc-pop', { detail: pops }));
      setTimeout(function () { b.classList.remove('gone'); if (!reduce) b.animate([{ scale: 0 }, { scale: 1.2, offset: .7 }, { scale: 1 }], { duration: 500 }); }, 3500);
    }
    function fling(b, vx, vy) {
      (function step() {
        if (D && D.b === b) return;
        var W = w.clientWidth - b.offsetWidth, H = w.clientHeight - b.offsetHeight, x = b.offsetLeft + vx, y = b.offsetTop + vy;
        if (x < 0 || x > W) { vx *= -.6; x = Math.max(0, Math.min(W, x)); } if (y < 0 || y > H) { vy *= -.6; y = Math.max(0, Math.min(H, y)); }
        b.style.left = x + 'px'; b.style.top = y + 'px'; vx *= .95; vy *= .95;
        if (Math.abs(vx) + Math.abs(vy) > .4) requestAnimationFrame(step);
      })();
    }
    w.addEventListener('pointerdown', function (ev) {
      var b = ev.target.closest('.sc-bk'); if (!b || b.classList.contains('gone')) return;
      D = { b: b, x0: ev.clientX, y0: ev.clientY, ox: b.offsetLeft, oy: b.offsetTop, moved: false, lx: ev.clientX, ly: ev.clientY, vx: 0, vy: 0 };
      try { b.setPointerCapture(ev.pointerId); } catch (e) { }
    });
    w.addEventListener('pointermove', function (ev) {
      if (!D) return; var dx = ev.clientX - D.x0, dy = ev.clientY - D.y0;
      if (!D.moved && Math.hypot(dx, dy) < 7) return;
      if (!D.moved) { D.moved = true; D.b.style.animationPlayState = 'paused'; D.b.style.zIndex = 5; window.dispatchEvent(new CustomEvent('sc-drag')); }
      var W = w.clientWidth - D.b.offsetWidth, H = w.clientHeight - D.b.offsetHeight;
      D.b.style.left = Math.max(0, Math.min(W, D.ox + dx)) + 'px'; D.b.style.top = Math.max(0, Math.min(H, D.oy + dy)) + 'px';
      D.vx = (ev.clientX - D.lx) * .8; D.vy = (ev.clientY - D.ly) * .8; D.lx = ev.clientX; D.ly = ev.clientY;
    });
    function up() {
      if (!D) return; var d = D; D = null;
      if (!d.moved) return pop(d.b);
      d.b.style.animationPlayState = ''; d.b.style.zIndex = '';
      if (!reduce) fling(d.b, Math.max(-28, Math.min(28, d.vx)), Math.max(-28, Math.min(28, d.vy)));
    }
    w.addEventListener('pointerup', up); w.addEventListener('pointercancel', up);
  }

  /* ---- judul: huruf bereaksi saat kursor lewat, loncat bergantian saat diklik ---- */
  function title() {
    var h = $('#hero h1.sc-float'); if (!h || h.dataset.play) return; var ch = h.querySelectorAll('.sc-ch'); if (!ch.length) return; h.dataset.play = '1';
    if (matchMedia('(hover:hover)').matches && !reduce) h.addEventListener('pointermove', function (e) {
      ch.forEach(function (c) { var r = c.getBoundingClientRect(), d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)), k = Math.max(0, 1 - d / 90); c.style.translate = '0 ' + (-12 * k) + 'px'; c.style.transition = 'translate .25s ease-out'; });
    }), h.addEventListener('pointerleave', function () { ch.forEach(function (c) { c.style.translate = '0 0'; }); });
    h.addEventListener('click', function (e) {
      burst(e.clientX, e.clientY, null); if (reduce) return;
      var dir = Math.random() < .5 ? 1 : -1;
      ch.forEach(function (c, i) { c.animate([{ translate: '0 0', rotate: '0deg' }, { translate: '0 -26px', rotate: (dir * 12) + 'deg', offset: .4 }, { translate: '0 3px', rotate: '0deg', offset: .75 }, { translate: '0 0' }], { duration: 650, delay: i * 35, easing: 'cubic-bezier(.3,1.4,.5,1)' }); });
    });
  }


  /* ---- suara: efek + suara manusia (pembaca suara bahasa Indonesia bawaan browser) ---- */
  var SND = { on: true, ok: false, ctx: null };
  try { SND.on = localStorage.getItem('sc_snd') !== '0'; } catch (e) { }
  function unlock() { SND.ok = true; try { if (!SND.ctx) SND.ctx = new (window.AudioContext || window.webkitAudioContext)(); if (SND.ctx.state === 'suspended') SND.ctx.resume(); } catch (e) { } }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { addEventListener(ev, unlock, { passive: true }); });
  function tone(f0, f1, d, vol, type, at) { if (!SND.ctx) return; var c = SND.ctx, t = c.currentTime + (at || 0), o = c.createOscillator(), g = c.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + d); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol || .15, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + .02); }
  function sfx(n) {
    if (!SND.on || !SND.ok) return;
    if (n === 'add') { tone(380, 900, .12, .18); tone(1318, 0, .4, .12, 'sine', .12); tone(1760, 0, .35, .08, 'sine', .2); }
    else if (n === 'pop') tone(900, 200, .09, .2, 'triangle');
    else if (n === 'sad') tone(600, 300, .4, .14, 'triangle');
    else if (n === 'hop') tone(500, 800, .1, .1);
    else if (n === 'win') { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0, .22, .13, 'triangle', i * .12); }); tone(1047, 0, .6, .12, 'triangle', .5); }
  }
  var REG = {"Halo! Mau donat apa hari ini?": "klik-1", "Hari ini good mood, kan?": "klik-2", "Psst... yang pink itu favoritku!": "klik-3", "Pecahin donat yang melayang, yuk!": "klik-4", "Perutku bunyi nih. Kamu juga?": "klik-5", "Geli, hihi!": "klik-6", "Aku donat, bukan bantal!": "klik-7", "Coba intip menu kami, deh.": "klik-8", "Ada hampers lucu di Racik Hadiah!": "klik-9", "Kamu baik banget, mau main sama aku.": "klik-10", "Satu donat sehari bikin hati senang.": "klik-11", "Yang manis-manis nunggu kamu nih.": "klik-12", "Pssst, sprinkles-ku bukan buat dimakan ya!": "klik-13", "Hehe, kamu nemuin aku!": "klik-14", "Wah, pilihanmu masuk keranjang!": "tambah-1", "Yay! Sudah masuk keranjang!": "tambah-2", "Siap! Sudah kutaruh di keranjangmu.": "tambah-3", "Nambah lagi? Aku suka gaya kamu!": "tambah-lagi-1", "Wah, keranjangnya makin penuh!": "tambah-lagi-2", "Satu lagi! Kamu nggak ragu-ragu, ya.": "tambah-lagi-3", "Yah, dikeluarkan ya... nggak apa-apa!": "keluar-1", "Oke, kubuang dari keranjang. Hiks.": "keluar-2", "Berubah pikiran? Boleh kok.": "keluar-3", "Selamat! Kamu dapat gratis ongkir!": "gratis-ongkir", "Eh, jangan dilempar-lempar dong!": "jangan-dilempar", "Wuhuu! Seru banget, ya!": "pecah-seru", "Terima kasih sudah memberikan ulasan!": "ulasan-terima", "Pembayaran berhasil! Pesananmu sudah kami terima, tunggu kabar dari kami ya!": "pesanan-online", "Pesananmu sudah kami terima! Tunggu kabar dari kami ya!": "pesanan-tunai", "Ini keranjangmu. Siap checkout?": "keranjang-isi", "Keranjangmu masih kosong. Yuk, pilih camilan dulu!": "keranjang-kosong", "Suara maskot menyala!": "suara-nyala", "Selamat pagi! Aku Crumby, ayo sarapan manis!": "sapa-pagi", "Selamat siang! Aku Crumby, siap temani kamu.": "sapa-siang", "Selamat sore! Waktunya teman ngopi, nih.": "sapa-sore", "Selamat malam! Aku Crumby, mampir dulu ya.": "sapa-malam", "Ini menu kami! Ada donat, pastry, cake, dan banyak lagi.": "halaman-menu", "Mau bikin hampers sendiri? Pilih kotak dan isinya sesukamu!": "halaman-racik", "Ini kata pelanggan kami. Kamu juga boleh kasih ulasan, lho!": "halaman-ulasan", "Mampir ke gerai kami, ya! Kami tunggu di Madiun.": "halaman-kontak"}, VOICE_DIR = 'audio/', PITCH = 1.0, cur = null; /* PITCH: 1.0 = suara asli; 1.2-1.3 = lebih tinggi dan imut */
  function play(file, fb) {
    try {
      if (cur) cur.pause(); var a = new Audio(file); cur = a; a.playbackRate = PITCH;
      if ('preservesPitch' in a) a.preservesPitch = false; else if ('mozPreservesPitch' in a) a.mozPreservesPitch = false; else if ('webkitPreservesPitch' in a) a.webkitPreservesPitch = false;
      a.volume = .95; a.onerror = function () { if (fb) fb(); }; var pr = a.play(); if (pr && pr.catch) pr.catch(function () { if (fb) fb(); });
    } catch (e) { }
  }
  function speak(t) { if (!SND.on || !SND.ok) return; var id = REG[t]; if (id) play(VOICE_DIR + id + '.mp3'); }
  function speakProduct(n) {
    if (!SND.on || !SND.ok) return; var sl = String(n).toLowerCase().replace(/&#x27;|'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    play(VOICE_DIR + 'produk/' + sl + '.mp3', function () { play(VOICE_DIR + 'tambah-' + (1 + Math.floor(Math.random() * 3)) + '.mp3'); });
  }

  /* ---- maskot donat: badan foto 3D + wajah hidup (mata, alis, mulut, pipi) ---- */
  var EC = '#3a1f14', MS = {
    smile: ['M-54 -12Q0 30 54 -12', 0], laugh: ['M-52 -14Q0 -4 52 -14Q46 46 0 50Q-46 46 -52 -14Z', 1],
    oh: ['M-20 16a20 28 0 1 0 40 0a20 28 0 1 0 -40 0Z', 1], yawn: ['M-34 24a34 44 0 1 0 68 0a34 44 0 1 0 -68 0Z', 1],
    sleep: ['M-24 8Q0 20 24 8', 0], sad: ['M-40 22Q0 -10 40 22', 0], talk: ['M-32 -8Q0 -4 32 -8Q30 28 0 30Q-30 28 -32 -8Z', 1]
  };
  function eyeSVG(x) {
    return '<g class="ey" transform="translate(' + x + ',389)"><g class="lk" style="transition:transform .12s ease-out"><g class="ld" style="transform-box:fill-box;transform-origin:50% 50%;transition:transform .09s">' +
      '<ellipse rx="48" ry="46" fill="' + EC + '"/><g class="hl" style="transition:transform .12s ease-out"><circle cx="-9" cy="-15" r="14" fill="#fff"/><circle cx="17" cy="13" r="6.5" fill="#fff"/></g></g></g>' +
      '<path class="hp" d="M-42 12Q0 -38 42 12" stroke="' + EC + '" stroke-width="15" fill="none" stroke-linecap="round" opacity="0" style="transition:opacity .08s"/>' +
      '<path class="cl" d="M-42 -4Q0 30 42 -4" stroke="' + EC + '" stroke-width="13" fill="none" stroke-linecap="round" opacity="0" style="transition:opacity .08s"/>' +
      '<path class="br" d="M-36 -64Q0 -86 36 -64" stroke="' + EC + '" stroke-width="10" fill="none" stroke-linecap="round" opacity="0" style="transition:opacity .15s,transform .2s"/></g>';
  }
  function mascot() {
    if ($('#scPal')) return;
    var st = document.createElement('style');
    st.textContent = '#scMascot{display:none!important}#scPal{position:fixed;left:6px;bottom:92px;width:80px;z-index:40;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;transform:translateX(-130%);transition:transform .6s cubic-bezier(.3,1.5,.5,1)}#scPal.in{transform:none}@media(min-width:1024px){#scPal{left:18px;bottom:16px;width:116px}}#scPal svg,#scPal img{display:block;width:100%;height:auto}#scPal .bd{position:relative;filter:drop-shadow(0 6px 5px rgba(120,60,30,.22))}#scPal svg{position:absolute;inset:0;overflow:visible}#scPal .bub{position:absolute;left:58%;bottom:92%;width:max-content;max-width:150px;background:#fff;color:#123F32;font:600 12px/1.3 system-ui,sans-serif;padding:7px 10px;border-radius:14px 14px 14px 3px;box-shadow:0 3px 12px rgba(0,0,0,.15);opacity:0;transform:translateY(6px) scale(.9);transition:.25s;pointer-events:none}#scPal .bub.on{opacity:1;transform:none}#scPal .snd{position:absolute;left:-4px;top:-4px;width:26px;height:26px;padding:0;border-radius:50%;border:1px solid #f0d6c6;background:#fff;font-size:13px;line-height:1;box-shadow:0 2px 6px rgba(0,0,0,.15);cursor:pointer;z-index:2}#scPal .zz{position:absolute;right:6px;top:-8px;font:800 15px system-ui;color:#7b8bd8;opacity:0}#scPal.sleep .zz{opacity:1;animation:scZ 1.8s ease-in-out infinite}@keyframes scZ{50%{transform:translateY(-8px)}}';
    document.head.appendChild(st);
    var d = document.createElement('div'); d.id = 'scPal'; d.setAttribute('role', 'img'); d.setAttribute('aria-label', 'Maskot donat Sweet Crumbs');
    d.innerHTML = '<div class="bub"></div><span class="zz">z z</span><div class="bd" id="pb"><img src="images/mascot-donut.webp" alt="" width="720" height="476" draggable="false"/>' +
      '<svg viewBox="0 0 1126 745" aria-hidden="true"><defs><radialGradient id="bl"><stop offset="0" stop-color="#ff4f86" stop-opacity=".62"/><stop offset=".7" stop-color="#ff4f86" stop-opacity=".4"/><stop offset="1" stop-color="#ff4f86" stop-opacity="0"/></radialGradient></defs>' +
      '<ellipse class="bk" cx="318" cy="453" rx="62" ry="42" fill="url(#bl)" style="transition:opacity .3s"/><ellipse class="bk" cx="792" cy="453" rx="62" ry="42" fill="url(#bl)" style="transition:opacity .3s"/>' +
      eyeSVG(400) + eyeSVG(721) + '<g transform="translate(559,418)"><ellipse class="tg" cx="0" cy="32" rx="26" ry="14" fill="#ff7f9a" opacity="0"/><path id="pm2" d="' + MS.smile[0] + '" fill="none" stroke="' + EC + '" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/></g></svg></div>';
    document.body.appendChild(d);
    var body = $('#pb', d), mouth = $('#pm2', d), tg = $('.tg', d), eys = d.querySelectorAll('.ey'), bub = $('.bub', d), bks = d.querySelectorAll('.bk'),
      asleep = false, last = Date.now(), bt, mt, tt, mode = 'open';
    function mood(m) {
      var s = MS[m]; mouth.setAttribute('d', s[0]); mouth.setAttribute('fill', s[1] ? '#4a1f1c' : 'none'); mouth.setAttribute('stroke-width', s[1] ? 0 : (m === 'sleep' ? 11 : 15)); tg.setAttribute('opacity', m === 'laugh' ? 1 : 0);
    }
    function eye(m) {
      mode = m;
      eys.forEach(function (e) {
        var ld = $('.ld', e), set = function (c, o) { $(c, e).setAttribute('opacity', o); }, sc = 1;
        if (m === 'sleepy') sc = .45; else if (m === 'wide') sc = 1.18; else if (m === 'blink') sc = .08;
        ld.style.transform = 'scale(' + (m === 'wide' ? 1.18 : 1) + ',' + sc + ')';
        ld.style.opacity = (m === 'happy' || m === 'closed') ? 0 : 1;
        set('.hp', m === 'happy' ? 1 : 0); set('.cl', m === 'closed' ? 1 : 0); set('.br', (m === 'wide' || m === 'happy') ? 1 : 0);
        $('.br', e).style.transform = m === 'wide' ? 'translateY(-14px)' : m === 'happy' ? 'translateY(-6px)' : 'none';
      });
      bks.forEach(function (b) { b.style.opacity = (m === 'happy' || m === 'wide') ? 1 : .8; });
    }
    function say(t, ms, v) {
      if (v) speak(t);
      bub.textContent = t; bub.classList.add('on'); clearTimeout(bt); bt = setTimeout(function () { bub.classList.remove('on'); }, ms || 2600);
      clearInterval(tt); var n = 0, tot = Math.min(14, 4 + t.length / 2); tt = setInterval(function () { if (asleep || ++n > tot) { clearInterval(tt); if (!asleep) mood('smile'); return; } mood(n % 2 ? 'talk' : 'smile'); }, 140);
    }
    function aim(x, y) {
      var r = d.getBoundingClientRect(), dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height * .5), n = Math.hypot(dx, dy) || 1, k = Math.min(1, n / 180), lx = dx / n * 15 * k, ly = dy / n * 12 * k;
      eys.forEach(function (e) { $('.lk', e).style.transform = 'translate(' + lx + 'px,' + ly + 'px)'; $('.hl', e).style.transform = 'translate(' + (-lx * .35) + 'px,' + (-ly * .35) + 'px)'; });
    }
    function jump(h) {
      if (reduce) return; body.animate([{ transform: 'none' }, { transform: 'scale(1.1,.86)', offset: .15 }, { transform: 'translateY(-' + (h || 30) + 'px) scale(.93,1.1)', offset: .5 }, { transform: 'scale(1.08,.9)', offset: .85 }, { transform: 'none' }], { duration: 680, easing: 'ease-out' });
    }
    function react(m, em, ms) { clearTimeout(mt); mood(m); eye(em); mt = setTimeout(function () { if (!asleep) { mood('smile'); eye('open'); } }, ms || 1300); }
    function wake(scared) { if (!asleep) return; asleep = false; d.classList.remove('sleep'); react('oh', 'wide', 1500); jump(36); say(scared ? 'Eh! Aku nggak tidur kok!' : 'Hoaam... halo!', 2200); }
    var LP = {}, pick = function (k, arr) { var i, n = 0; do { i = Math.floor(Math.random() * arr.length); } while (i === LP[k] && arr.length > 1 && ++n < 6); LP[k] = i; return arr[i]; }, hr = new Date().getHours();
    var CLICK = ['Halo! Mau donat apa hari ini?', 'Hari ini good mood, kan?', 'Psst... yang pink itu favoritku!', 'Pecahin donat yang melayang, yuk!', 'Perutku bunyi nih. Kamu juga?', 'Geli, hihi!', 'Aku donat, bukan bantal!', 'Coba intip menu kami, deh.', 'Ada hampers lucu di Racik Hadiah!', 'Kamu baik banget, mau main sama aku.', 'Satu donat sehari bikin hati senang.', 'Yang manis-manis nunggu kamu nih.', 'Pssst, sprinkles-ku bukan buat dimakan ya!', 'Hehe, kamu nemuin aku!'];
    var IDLE = ['Lagi mikirin donat apa ya...', 'Wangi oven sampai sini, lho.', 'Kamu udah makan manis hari ini?', 'Scroll terus, banyak yang enak!', 'Aku jagain keranjangmu, tenang.', 'Hmm, croissant atau donat ya?', 'Kalau bingung, pilih yang pink!', 'Santai aja, nggak buru-buru kok.'];
    var ADD = ['Wah, {n} masuk keranjang!', 'Yay! {n} sudah masuk keranjang!', 'Siap! {n} kutaruh di keranjangmu.', 'Pilihan bagus! {n} masuk keranjang.', 'Yay, {n} ikut pulang sama kamu!', 'Hmm, {n}... selera kamu mantap!'];
    function nm(n) { n = String(n || 'Produk ini'); return n.length > 26 ? n.slice(0, 24) + '…' : n; }
    function an(f, ms, e) { if (!reduce) body.animate(f, { duration: ms, easing: e || 'ease-in-out' }); }
    var ACT = [
      function () { react('laugh', 'happy', 1100); an([{ transform: 'none' }, { transform: 'rotate(-9deg)' }, { transform: 'rotate(9deg)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }, { transform: 'none' }], 800); },
      function () { react('oh', 'wide', 1000); an([{ transform: 'none' }, { transform: 'translateY(-30px) rotate(180deg)', offset: .5 }, { transform: 'rotate(360deg)' }], 950); },
      function () { react('laugh', 'happy', 1300); an([{ transform: 'none' }, { transform: 'translateY(-18px)', offset: .2 }, { transform: 'none', offset: .4 }, { transform: 'translateY(-26px)', offset: .65 }, { transform: 'none' }], 1000); },
      function () { react('smile', 'open', 1800); aim(innerWidth * .8, -50); an([{ transform: 'none' }, { transform: 'rotate(14deg) translateY(2px)' }, { transform: 'rotate(14deg) translateY(2px)', offset: .7 }, { transform: 'none' }], 1700); say('Hmm? Ada apa itu...', 1700); },
      function () { react('talk', 'wide', 1100); an([{ transform: 'none' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], 700); },
      function () { react('yawn', 'sleepy', 1500); an([{ transform: 'none' }, { transform: 'scale(.92,1.15)', offset: .45 }, { transform: 'scale(1.05,.95)', offset: .8 }, { transform: 'none' }], 1300); },
      function () { react('laugh', 'happy', 1600); an([{ transform: 'none' }, { transform: 'translateX(46px) rotate(360deg)', offset: .5 }, { transform: 'none' }], 1500, 'ease-in-out'); },
      function () { react('smile', 'wide', 2400); an([{ transform: 'none' }, { transform: 'translateX(-72%)', offset: .25 }, { transform: 'translateX(-72%)', offset: .75 }, { transform: 'none' }], 2400); say('Kucing-kucingan, yuk!', 1900); },
      function () { react('laugh', 'happy', 1500); an([{ transform: 'none' }, { transform: 'translateY(-14px) rotate(-12deg)', offset: .2 }, { transform: 'rotate(0)', offset: .4 }, { transform: 'translateY(-14px) rotate(12deg)', offset: .6 }, { transform: 'rotate(0)', offset: .8 }, { transform: 'none' }], 1300); say('Goyang dulu ah~', 1500); }
    ];
    (function idle() { if (!asleep && !document.hidden && Date.now() - last > 2500) { pick('a', ACT)(); if (Math.random() < .45) setTimeout(function () { if (!asleep) say(pick('i', IDLE), 2400, false); }, 900); } setTimeout(idle, 7000 + Math.random() * 7000); })();
    addEventListener('sc-cart', function (e) {
      last = Date.now(); if (asleep) wake(true); cartN = (typeof cartN === 'number' ? cartN : 0) + 1;
      react('laugh', 'happy', 1800); jump(42); an([{ transform: 'none' }, { transform: 'rotate(360deg)' }], 800); sfx('add');
      if (cartN > 1 && Math.random() < .5) say(pick('c2', ['Nambah lagi? Aku suka gaya kamu!', 'Wah, keranjangnya makin penuh!', 'Satu lagi! Kamu nggak ragu-ragu, ya.']), 3000, true);
      else { var nn = e.detail && e.detail.name; say(pick('add', ADD).replace('{n}', nm(nn)), 3000, false); setTimeout(function () { speakProduct(nn || ''); }, 350); }
    });
    var cartN = 0;

    var sb = document.createElement('button'); sb.type = 'button'; sb.className = 'snd'; sb.setAttribute('aria-label', 'Nyalakan atau matikan suara maskot');
    function psb() { sb.textContent = SND.on ? '\uD83D\uDD0A' : '\uD83D\uDD07'; sb.title = SND.on ? 'Matikan suara' : 'Nyalakan suara'; } psb();
    sb.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    sb.addEventListener('click', function (e) { e.stopPropagation(); unlock(); SND.on = !SND.on; try { localStorage.setItem('sc_snd', SND.on ? '1' : '0'); } catch (x) { } if (!SND.on && cur) cur.pause(); psb(); if (SND.on) { sfx('add'); speak('Suara maskot menyala!'); } });
    d.appendChild(sb);
    addEventListener('sc-order', function (e) {
      last = Date.now(); if (asleep) wake(true); d.style.zIndex = 100000; setTimeout(function () { d.style.zIndex = ''; }, 9000); react('laugh', 'happy', 3000); jump(46); sfx('win');
      var cash = e.detail && (e.detail.pay === 'cod' || e.detail.pay === 'store');
      say(cash ? 'Pesananmu sudah kami terima! Tunggu kabar dari kami ya!' : 'Pembayaran berhasil! Pesananmu sudah kami terima, tunggu kabar dari kami ya!', 6500, true);
    });
    addEventListener('sc-review', function () { last = Date.now(); react('laugh', 'happy', 1500); jump(); say('Terima kasih sudah memberikan ulasan!', 3000, true); });
    var cb = document.getElementById('cartToggleBtn'), cbT = 0;
    if (cb) cb.addEventListener('click', function () { if (Date.now() - cbT < 6000) return; cbT = Date.now(); setTimeout(function () { var n = +(document.getElementById('cartCountBadge') || {}).textContent || 0; say(n ? 'Ini keranjangmu. Siap checkout?' : 'Keranjangmu masih kosong. Yuk, pilih camilan dulu!', 3200, true); }, 500); });
    var SEC = { menu: 'Ini menu kami! Ada donat, pastry, cake, dan banyak lagi.', 'racik-hadiah': 'Mau bikin hampers sendiri? Pilih kotak dan isinya sesukamu!', ulasan: 'Ini kata pelanggan kami. Kamu juga boleh kasih ulasan, lho!', kontak: 'Mampir ke gerai kami, ya! Kami tunggu di Madiun.' }, seen = {}, lastSec = 0;
    if ('MutationObserver' in window) {
      var mo = new MutationObserver(function (ms) { ms.forEach(function (m) { var el = m.target, id = el.getAttribute('data-page'); if (!el.hidden && SEC[id] && !seen[id] && !asleep && Date.now() - lastSec > 5000) { seen[id] = 1; lastSec = Date.now(); setTimeout(function () { react('laugh', 'happy', 1500); jump(); say(SEC[id], 3800, true); }, 500); } }); });
      document.querySelectorAll('[data-page]').forEach(function (el) { mo.observe(el, { attributes: true, attributeFilter: ['hidden'] }); });
    }
    addEventListener('sc-cart-remove', function () { last = Date.now(); if (asleep) wake(true); react('sad', 'sleepy', 1800); say(pick('rm', ['Yah, dikeluarkan ya... nggak apa-apa!', 'Oke, kubuang dari keranjang. Hiks.', 'Berubah pikiran? Boleh kok.']), 2400, true); sfx('sad'); });
    addEventListener('sc-free', function () { last = Date.now(); react('laugh', 'happy', 2200); jump(44); say('Selamat! Kamu dapat gratis ongkir!', 3200, true); sfx('win'); });

    d.addEventListener('pointerdown', function () { last = Date.now(); if (asleep) return wake(true); jump(); react('laugh', 'happy', 1500); sfx('hop'); say(pick('k', CLICK), 2600, true); });
    addEventListener('pointermove', function (e) { last = Date.now(); if (asleep) wake(false); aim(e.clientX, e.clientY); }, { passive: true });
    addEventListener('touchstart', function (e) { var t = e.touches[0]; if (t) aim(t.clientX, t.clientY); last = Date.now(); }, { passive: true });
    addEventListener('scroll', function () { last = Date.now(); }, { passive: true });
    addEventListener('sc-pop', function (e) { last = Date.now(); if (asleep) wake(true); react('laugh', 'happy', 1000); jump(38); if (e.detail % 4 === 0) say('Wuhuu! Seru banget, ya!', 2000, true); });
    var dg = 0; addEventListener('sc-drag', function () { last = Date.now(); if (asleep) wake(true); else if (Date.now() - dg > 9000) { dg = Date.now(); react('oh', 'wide', 1600); say('Eh, jangan dilempar-lempar dong!', 2200, true); } });
    (function blink() { if (!asleep && (mode === 'open' || mode === 'sleepy')) { var m0 = mode; eye('blink'); setTimeout(function () { if (!asleep) eye(m0); }, 110); if (Math.random() < .25) setTimeout(function () { if (!asleep && mode === 'open') { eye('blink'); setTimeout(function () { if (!asleep) eye('open'); }, 110); } }, 260); } setTimeout(blink, 1800 + Math.random() * 3000); })();
    (function wander() { if (!asleep && Date.now() - last > 3500) aim(innerWidth * Math.random(), innerHeight * Math.random()); setTimeout(wander, 1500 + Math.random() * 2200); })();
    if (!reduce) {
      body.animate([{ transform: 'none' }, { transform: 'translateY(-4px) rotate(2deg)' }, { transform: 'none' }, { transform: 'translateY(-3px) rotate(-2deg)' }, { transform: 'none' }], { duration: 3800, iterations: Infinity, easing: 'ease-in-out' });
      setInterval(function () { if (!asleep && Math.random() < .4) mouth.animate([{ transform: 'none' }, { transform: 'scaleY(1.12)' }, { transform: 'none' }], { duration: 900, easing: 'ease-in-out' }); }, 2600);
    }
    setInterval(function () {
      if (!asleep && Date.now() - last > 28000) { eye('sleepy'); mood('yawn'); say('Hoaamm... ngantuk...', 1800); setTimeout(function () { asleep = true; d.classList.add('sleep'); eye('closed'); mood('sleep'); }, 1900); }
    }, 2000);
    eye('open');
    setTimeout(function () { d.classList.add('in'); setTimeout(function () { jump(); react('laugh', 'happy', 1500); say(hr < 11 ? 'Selamat pagi! Aku Crumby, ayo sarapan manis!' : hr < 15 ? 'Selamat siang! Aku Crumby, siap temani kamu.' : hr < 18 ? 'Selamat sore! Waktunya teman ngopi, nih.' : 'Selamat malam! Aku Crumby, mampir dulu ya.', 3200, true); }, 700); }, 2600);
  }


  /* ---- status buka/tutup berdasarkan jam Madiun (WIB) ---- */
  function openStatus() {
    var t = $('#scOpenTxt'), dot = $('#scDot'); if (!t) return;
    function tick() {
      var h = 12, m = 0;
      try { var P = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()); P.forEach(function (x) { if (x.type === 'hour') h = +x.value % 24; if (x.type === 'minute') m = +x.value; }); } catch (e) { return; }
      var now = h * 60 + m, op = 8 * 60, cl = 21 * 60;
      if (now >= op && now < cl) { dot.style.background = '#2eb872'; dot.style.boxShadow = '0 0 0 4px rgba(46,184,114,.2)'; t.textContent = 'Buka sekarang • sampai 21:00 WIB'; }
      else { dot.style.background = '#b9b3b0'; dot.style.boxShadow = 'none'; t.textContent = now < op ? 'Belum buka • buka pukul 08:00 WIB' : 'Tutup • buka lagi besok 08:00 WIB'; }
    }
    tick(); setInterval(tick, 60000);
  }

  function init() { openStatus(); mascot(); var n = 0, iv = setInterval(function () { bakes(); title(); if (++n > 40 || ($('.sc-bakes') && $('#hero h1 .sc-ch'))) { bakes(); title(); clearInterval(iv); } }, 300); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
