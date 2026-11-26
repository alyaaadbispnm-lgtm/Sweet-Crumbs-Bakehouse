/* Sweet Crumbs - Login Owner, Admin, Pelanggan */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var rp = function (n) { return 'Rp ' + Math.round(n).toLocaleString('id-ID'); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ACC = [
    { role: 'owner', name: 'Pemilik Sweet Crumbs', email: 'owner@sweetcrumbs.id', pw: 'Owner#2026' },
    { role: 'admin', name: 'Admin Sweet Crumbs', email: 'admin@sweetcrumbs.id', pw: 'Admin#2026' }
  ];
  /* Pelanggan: akun dibuat otomatis saat pertama kali masuk, disimpan di browser */
  var hs = function (t) { var h = 5381, i; for (i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0; return String(h); };
  function custs() { try { return JSON.parse(localStorage.getItem('sc_customers') || '{}'); } catch (e) { return {}; } }
  function saveC(c) { try { localStorage.setItem('sc_customers', JSON.stringify(c)); return true; } catch (e) { return false; } }
  var TYPO = { 'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com', 'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com', 'hotmial.com': 'hotmail.com', 'outlok.com': 'outlook.com' };
  var TEMP = ['mailinator.com', 'yopmail.com', 'guerrillamail.com', 'tempmail.com', '10minutemail.com', 'trashmail.com'];
  function emailErr(e) {
    if (!/^[a-z0-9][a-z0-9._%+-]{1,63}@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/.test(e) || /\.\./.test(e) || /\.@/.test(e)) return 'Format email belum benar';
    var d = e.split('@')[1]; if (TYPO[d]) return 'Maksud kamu ' + e.split('@')[0] + '@' + TYPO[d] + '?';
    if (TEMP.indexOf(d) > -1) return 'Pakai email aktif milikmu, bukan email sementara';
    return '';
  }
  function nm(e) { var n = e.split('@')[0].replace(/[._\-]+/g, ' ').trim(); return n ? n.replace(/\b\w/g, function (c) { return c.toUpperCase(); }) : 'Pelanggan'; }
  var RL = { owner: 'Owner', admin: 'Admin', customer: 'Pelanggan' };
  var RC = { owner: 'bg-amber-100 text-amber-800', admin: 'bg-sky-100 text-sky-800', customer: 'bg-emerald-100 text-emerald-800' };
  var BTN = 'bg-sc-deep-green text-white font-bold rounded-xl px-4 py-2.5 text-sm hover:bg-sc-forest transition-all active:scale-95';
  var IN = 'w-full border border-sc-beige rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sc-pink';
  var user = null, O, next, btn, tl, lmsg = '';
  try { user = JSON.parse(localStorage.getItem('sc_user') || 'null'); } catch (e) {}
  window.SCUser = user;
  function setU(u) { user = u; window.SCUser = u; try { u ? localStorage.setItem('sc_user', JSON.stringify(u)) : localStorage.removeItem('sc_user'); } catch (e) {} paint(); }
  function paint() { if (btn) btn.textContent = user ? user.name.split(' ')[0] + ' \u00B7 ' + RL[user.role] : 'Masuk'; if (tl) tl.textContent = user ? 'Lihat pesanan saya' : 'Sudah pesan? Lacak pesananmu'; }
  function orders() { try { return JSON.parse(localStorage.getItem('sc_orders') || '[]'); } catch (e) { return []; } }
  function saveO(o) { try { localStorage.setItem('sc_orders', JSON.stringify(o)); } catch (e) {} }

  function ov(html, wide) {
    if (!O) { O = document.createElement('div'); O.className = 'fixed inset-0 z-[10000] bg-black/50 flex items-start sm:items-center justify-center p-4 overflow-y-auto hidden'; document.body.appendChild(O);
      O.addEventListener('click', function (e) { if (e.target === O) shut(); var b = e.target.closest('[data-a]'); if (b && b.dataset.a !== 'st') act(b); });
      O.addEventListener('change', function (e) { var b = e.target.closest('[data-a="st"]'); if (b) act(b); });
      O.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.tagName === 'INPUT') { var g = O.querySelector('[data-a="in"],[data-a="up"]'); if (g) act(g); } }); }
    O.innerHTML = '<div class="bg-white rounded-3xl p-6 w-full ' + (wide ? 'max-w-4xl' : 'max-w-md') + ' my-4">' + html + '</div>'; O.classList.remove('hidden');
  }
  function shut() { if (O) O.classList.add('hidden'); next = null; }
  function badge(r) { return '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full ' + RC[r] + '">' + RL[r] + '</span>'; }

  function login(cb, msg, tab) {
    next = cb || null; lmsg = msg || ''; var up = tab === 'up';
    var tb = function (k, t) { return '<button type="button" data-a="tab" data-t="' + k + '" class="py-2 rounded-lg ' + ((k === 'up') === up ? 'bg-white text-sc-deep-green shadow-sm' : 'text-sc-deep-green/60') + '">' + t + '</button>'; };
    var fl = function (id, label, type, ac, ph) { return '<div class="mt-3"><label class="text-xs font-semibold block mb-1" for="' + id + '">' + label + '</label><input id="' + id + '" type="' + type + '" class="' + IN + '" autocomplete="' + ac + '"' + (ph ? ' placeholder="' + ph + '"' : '') + '></div>'; };
    ov('<h2 class="font-heading text-xl font-bold text-sc-deep-green">' + (up ? 'Buat akun Sweet Crumbs' : 'Masuk ke Sweet Crumbs') + '</h2>' + (lmsg ? '<p class="text-xs text-sc-deep-green/70 mt-1">' + lmsg + '</p>' : '') +
      '<div class="grid grid-cols-2 gap-1 bg-sc-cream rounded-xl p-1 mt-4 text-sm font-bold">' + tb('in', 'Masuk') + tb('up', 'Daftar') + '</div>' +
      (up ? fl('auN', 'Nama lengkap', 'text', 'name') : '') + fl('auE', 'Email', 'email', up ? 'email' : 'username', 'nama@gmail.com') + fl('auP', 'Kata sandi', 'password', up ? 'new-password' : 'current-password') +
      (up ? fl('auP2', 'Ulangi kata sandi', 'password', 'new-password') + '<p class="text-[11px] text-sc-deep-green/60 mt-2">Gunakan email aktif milikmu. Kata sandi minimal 8 karakter, kombinasi huruf dan angka.</p>' : '') +
      '<p id="auErr" class="text-xs text-red-500 mt-2 hidden"></p><button data-a="' + (up ? 'up' : 'in') + '" class="' + BTN + ' w-full mt-4 py-3">' + (up ? 'Daftar' : 'Masuk') + '</button>' +
      '<p class="text-[11px] text-sc-deep-green/60 mt-3 text-center">Masuk tidak wajib. Kamu tetap bisa checkout sebagai tamu.</p><button data-a="track" class="text-xs underline text-sc-deep-green w-full mt-2">Lacak pesanan tanpa akun</button>' +
      '<button data-a="x" class="text-xs text-sc-deep-green/60 w-full mt-2">Tutup</button>');
  }
  function menu() {
    ov('<div class="flex items-center justify-between"><div><p class="font-bold text-sc-deep-green">' + esc(user.name) + '</p><p class="text-xs text-sc-deep-green/60">' + user.email + '</p></div>' + badge(user.role) + '</div><div class="grid gap-2 mt-4">' +
      '<button data-a="my" class="' + BTN + '">Pesanan Saya</button>' + (user.role !== 'customer' ? '<button data-a="dash" class="border border-sc-deep-green text-sc-deep-green font-bold rounded-xl px-4 py-2.5 text-sm hover:bg-sc-soft-pink/30">' + (user.role === 'owner' ? 'Dashboard Owner' : 'Kelola Pesanan') + '</button>' : '') +
      '<button data-a="out" class="text-sm text-red-500 py-2">Keluar</button></div>');
  }
  function reviewsPanel() {
    var R = window.SCReviews ? window.SCReviews.list() : [], P = R.filter(function (x) { return x.rv.s === 'p'; }), L = P.concat(R.filter(function (x) { return x.rv.s !== 'p'; })).slice(0, 30);
    var b = function (p, id, s, tx, c) { return '<button data-a="rv" data-p="' + esc(p) + '" data-i="' + id + '" data-s="' + s + '" class="' + c + ' text-xs px-2 py-1 rounded-lg border">' + tx + '</button>'; };
    return '<div class="mb-4"><p class="font-bold text-sm mb-2">Ulasan Pelanggan' + (P.length ? ' <span class="bg-sc-pink text-white text-[11px] px-2 py-0.5 rounded-full">' + P.length + ' menunggu</span>' : '') + '</p>' + (L.length ? L.map(function (x) {
      var rv = x.rv, s = rv.s === 'p' ? 'Menunggu' : rv.s === 'x' ? 'Ditolak' : 'Tampil di website';
      var acts = (rv.s === 'p' || rv.s === 'x' ? b(x.p, rv.id, 'a', 'Setujui', 'border-emerald-500 text-emerald-700') : '') + (rv.s === 'p' ? b(x.p, rv.id, 'x', 'Tolak', 'border-amber-500 text-amber-700') : '') + (!rv.s || rv.s === 'a' ? b(x.p, rv.id, 'x', 'Sembunyikan', 'border-amber-500 text-amber-700') : '') + b(x.p, rv.id, 'del', 'Hapus', 'border-red-400 text-red-500');
      return '<div class="border border-sc-beige rounded-xl p-3 mb-2 text-xs"><div class="flex justify-between gap-2"><b>' + esc(x.p) + '</b><span class="text-amber-400">' + '★'.repeat(rv.r) + '</span></div><p class="text-sc-deep-green/60">' + esc(rv.n || '') + (rv.an ? ' (anonim di website)' : '') + ' • ' + s + '</p><p class="mt-1 break-words">' + esc(rv.c || '') + '</p><div class="flex flex-wrap gap-2 mt-2">' + acts + '</div></div>';
    }).join('') : '<p class="text-xs text-sc-deep-green/60">Belum ada ulasan.</p>') + '</div>';
  }
  function dash() {
    var C = window.SCCO, os = orders(), st = C.stage, owner = user.role === 'owner', top = {};
    var paid = os.filter(function (o) { var s = st(o); return s === 4 || (!o.cod && o.paidAt && s >= 0); });
    os.forEach(function (o) { if (st(o) !== -1) o.items.forEach(function (i) { top[i.name] = (top[i.name] || 0) + i.qty; }); });
    var tp = Object.keys(top).sort(function (a, b) { return top[b] - top[a]; }).slice(0, 5);
    var card = function (t, v) { return '<div class="bg-sc-cream rounded-2xl p-3"><p class="text-[11px] text-sc-deep-green/60">' + t + '</p><p class="font-heading text-lg font-bold text-sc-deep-green">' + v + '</p></div>'; };
    var rows = os.map(function (o, i) {
      var s = st(o), sel = '<select data-a="st" data-i="' + i + '" class="border border-sc-beige rounded-lg text-xs px-1 py-1"><option value="">Ubah status</option>' + ['Diterima', 'Dipanggang', 'Dikemas', o.ship === 'pick' ? 'Siap diambil' : 'Dikirim', 'Selesai'].map(function (t, k) { return '<option value="' + k + '"' + (s === k ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select>';
      return '<tr class="border-t border-sc-beige"><td class="py-2 pr-2 font-bold">' + o.id + '</td><td class="pr-2">' + esc(o.name || '') + '<br><span class="text-sc-deep-green/50">' + esc(o.email || '') + '</span></td><td class="pr-2">' + rp(o.total) + '</td><td class="pr-2">' + window.SCCO.label(o) + '</td>' + (owner ? '' : '<td>' + (s === -1 ? '-' : sel + ' <button data-a="cx" data-i="' + i + '" class="text-red-500 ml-1">Batal</button>') + '</td>') + '</tr>';
    }).join('');
    ov('<div class="flex justify-between items-center mb-3"><h2 class="font-heading text-xl font-bold text-sc-deep-green">' + (owner ? 'Dashboard Owner' : 'Kelola Pesanan') + '</h2><div>' + badge(user.role) + ' <button data-a="x" class="text-xs ml-2 underline">Tutup</button></div></div>' + reviewsPanel() +
      (owner ? '<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">' + card('Total pesanan', os.length) + card('Pendapatan', rp(paid.reduce(function (s, o) { return s + o.total; }, 0))) + card('Pesanan aktif', os.filter(function (o) { var s = st(o); return s >= 0 && s < 4; }).length) + card('Dibatalkan', os.filter(function (o) { return st(o) === -1; }).length) + '</div>' +
        '<p class="font-bold text-sm mb-1">Produk terlaris</p>' + (tp.length ? '<ol class="text-xs list-decimal ml-5 mb-4">' + tp.map(function (n) { return '<li>' + esc(n) + ' (' + top[n] + ' pcs)</li>'; }).join('') + '</ol>' : '<p class="text-xs text-sc-deep-green/60 mb-4">Belum ada data.</p>') +
        '<p class="font-bold text-sm mb-1">Akun terdaftar</p><ul class="text-xs mb-4">' + ACC.map(function (a) { return '<li>' + badge(a.role) + ' ' + a.email + '</li>'; }).join('') + Object.keys(custs()).map(function (k) { return '<li>' + badge('customer') + ' ' + esc(k) + '</li>'; }).join('') + '</ul>' : '') +
      '<p class="font-bold text-sm mb-1">Semua pesanan (' + os.length + ')</p><div class="overflow-x-auto"><table class="w-full text-xs text-left"><thead><tr class="text-sc-deep-green/60"><th>No.</th><th>Pelanggan</th><th>Total</th><th>Status</th>' + (owner ? '' : '<th>Aksi</th>') + '</tr></thead><tbody>' + (rows || '<tr><td colspan="5" class="py-6 text-center text-sc-deep-green/60">Belum ada pesanan.</td></tr>') + '</tbody></table></div><button data-a="dash" class="text-xs underline mt-3">Segarkan</button>', true);
  }
  function act(b) {
    var a = b.dataset.a;
    if (a === 'x') shut();
    else if (a === 'tab') login(next, lmsg, b.dataset.t);
    else if (a === 'track') { shut(); if (window.SCCO) window.SCCO.orders(); }
    else if (a === 'in') {
      var e = $('#auE').value.trim().toLowerCase(), p = $('#auP').value, er = $('#auErr'), fail = function (t) { er.textContent = t; er.classList.remove('hidden'); };
      if (!e || !p) return fail('Isi email dan kata sandi dulu');
      var m = ACC.filter(function (x) { return x.email === e; })[0], cb = next;
      if (m) { if (m.pw !== p) return fail('Email atau kata sandi salah'); setU({ role: m.role, name: m.name, email: m.email }); shut(); if (cb) cb(); return; }
      var ee = emailErr(e); if (ee) return fail(ee);
      var c = custs()[e]; if (!c) return fail('Email belum terdaftar. Silakan daftar dulu.');
      if (c.h !== hs(p)) return fail('Email atau kata sandi salah');
      setU({ role: 'customer', name: c.name, email: e }); shut(); if (cb) cb();
    } else if (a === 'up') {
      var n = $('#auN').value.trim().replace(/\s+/g, ' '), e2 = $('#auE').value.trim().toLowerCase(), p1 = $('#auP').value, p2 = $('#auP2').value, er2 = $('#auErr'), f2 = function (t) { er2.textContent = t; er2.classList.remove('hidden'); };
      if (n.length < 3) return f2('Nama minimal 3 huruf');
      if (!/^[A-Za-zÀ-ɏ.' ]+$/.test(n)) return f2('Nama hanya boleh huruf, spasi, titik, atau apostrof');
      var e3 = emailErr(e2); if (e3) return f2(e3);
      var C = custs(); if (ACC.some(function (x) { return x.email === e2; }) || C[e2]) return f2('Email ini sudah terdaftar. Silakan masuk.');
      if (p1.length < 8 || !/[A-Za-z]/.test(p1) || !/\d/.test(p1)) return f2('Kata sandi minimal 8 karakter, kombinasi huruf dan angka');
      if (p1 !== p2) return f2('Ulangi kata sandi belum sama');
      C[e2] = { name: n, h: hs(p1), at: Date.now() }; if (!saveC(C)) return f2('Akun gagal disimpan di browser ini');
      var cb2 = next; setU({ role: 'customer', name: n, email: e2 }); shut(); if (cb2) cb2();
    } else if (a === 'out') { setU(null); shut(); }
    else if (a === 'my') { shut(); if (window.SCCO) window.SCCO.orders(); }
    else if (a === 'dash') dash();
    else if (a === 'rv') { if (window.SCReviews) window.SCReviews.set(b.dataset.p, b.dataset.i, b.dataset.s); dash(); }
    else if (a === 'st' || a === 'cx') {
      var os = orders(), o = os[b.dataset.i]; if (!o) return;
      if (a === 'cx') o.cancelled = true; else if (b.value !== '') { o.force = +b.value; if (!o.paidAt && !o.cod) o.paidAt = Date.now(); } else return;
      saveO(os); dash();
    }
  }
  window.SCAuth = { login: login };
  function init() {
    var cart = $('#cartToggleBtn'); if (!cart) return;
    btn = document.createElement('button'); btn.type = 'button';
    btn.className = 'px-3 py-1.5 rounded-full text-xs font-bold border border-sc-beige bg-white text-sc-deep-green hover:bg-sc-soft-pink whitespace-nowrap mr-2';
    cart.parentNode.insertBefore(btn, cart);
    var ck = document.querySelector('#cartDrawer button[onclick*="checkoutWhatsApp"]');
    if (ck) { tl = document.createElement('button'); tl.type = 'button'; tl.id = 'scTrackLink'; tl.className = 'w-full text-center text-xs font-semibold text-sc-deep-green underline hover:text-sc-pink'; ck.parentNode.insertBefore(tl, ck.nextSibling); tl.addEventListener('click', function () { if (window.SCCO) window.SCCO.orders(); }); }
    paint();
    btn.addEventListener('click', function () { user ? menu() : login(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
