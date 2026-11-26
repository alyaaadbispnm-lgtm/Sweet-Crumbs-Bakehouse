/* Sweet Crumbs - Checkout, voucher, dan pesanan */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var rp = function (n) { return 'Rp ' + Math.round(n).toLocaleString('id-ID'); };
  var pad = function (n, l) { return ('000' + n).slice(-(l || 2)); };
  var WA = '6281234567890', FREE = 75000, CODMAX = 300000, KEY = 'sc_orders';
  var AR = {
    'Kota Madiun': { k: ['Kartoharjo', 'Manguharjo', 'Taman'], reg: 8000, ins: 15000, free: 1, cod: 1 },
    'Kabupaten Madiun': { k: ['Balerejo', 'Dagangan', 'Dolopo', 'Geger', 'Gemarang', 'Jiwan', 'Kare', 'Kebonsari', 'Madiun', 'Mejayan', 'Pilangkenceng', 'Saradan', 'Sawahan', 'Wonoasri', 'Wungu'], reg: 15000, cod: 1 },
    'Magetan': { k: ['Barat', 'Bendo', 'Karangrejo', 'Karas', 'Kartoharjo', 'Kawedanan', 'Lembeyan', 'Magetan', 'Maospati', 'Ngariboyo', 'Nguntoronadi', 'Panekan', 'Parang', 'Plaosan', 'Poncol', 'Sidorejo', 'Sukomoro', 'Takeran'], reg: 15000 },
    'Ngawi': { k: ['Bringin', 'Geneng', 'Gerih', 'Jogorogo', 'Karanganyar', 'Karangjati', 'Kasreman', 'Kedunggalar', 'Kendal', 'Kwadungan', 'Mantingan', 'Ngawi', 'Ngrambe', 'Padas', 'Pangkur', 'Paron', 'Pitu', 'Sine', 'Widodaren'], reg: 25000, h1: 1 },
    'Ponorogo': { k: ['Babadan', 'Badegan', 'Balong', 'Bungkal', 'Jambon', 'Jenangan', 'Jetis', 'Kauman', 'Mlarak', 'Ngebel', 'Ngrayun', 'Ponorogo', 'Pudak', 'Pulung', 'Sambit', 'Sampung', 'Sawoo', 'Siman', 'Slahung', 'Sooko', 'Sukorejo'], reg: 25000, h1: 1 },
    'Nganjuk': { k: ['Bagor', 'Baron', 'Berbek', 'Gondang', 'Jatikalen', 'Kertosono', 'Lengkong', 'Loceret', 'Nganjuk', 'Ngetos', 'Ngluyu', 'Ngronggot', 'Pace', 'Patianrowo', 'Prambon', 'Rejoso', 'Sawahan', 'Sukomoro', 'Tanjunganom', 'Wilangan'], reg: 25000, h1: 1 }
  };
  /* Voucher: b = label badge, t = judul, min = minimal belanja (untuk voucher produk: minimal belanja produk terkait),
     ship/shipOff = gratis/potongan ongkir, pct/flat/max = cashback, items = produk khusus, pay = metode bayar khusus */
  var VO = {
    QRISFREE: { b: 'GRATIS ONGKIR', t: 'Gratis Ongkir via QRIS', min: 30000, ship: 1, pay: ['qris'], payL: 'QRIS' },
    CASHBACK2: { b: 'CASHBACK 2%', t: 'Cashback 2%', min: 30000, pct: 2, max: 5000 },
    CASHBACK5: { b: 'CASHBACK 5%', t: 'Cashback 5%', min: 100000, pct: 5, max: 20000 },
    COOKIE10: { b: 'CASHBACK 10%', t: 'Cashback 10% khusus Cookies', min: 30000, pct: 10, max: 15000, items: /cookie/i, lbl: 'cookies' },
    CROISSANT8: { b: 'CASHBACK 8%', t: 'Cashback 8% khusus Croissant', min: 24000, pct: 8, max: 10000, items: /croissant/i, lbl: 'croissant' },
    EWALLET7: { b: 'CASHBACK 7%', t: 'Cashback 7% via E-Wallet', min: 50000, pct: 7, max: 15000, pay: ['ewallet'], payL: 'E-Wallet' }
  };
  function vbase(v, c, sub) { return v.items ? c.filter(function (i) { return v.items.test(i.name); }).reduce(function (n, i) { return n + i.price * i.qty; }, 0) : sub; }
  function elig(v, c, sub) {
    if (!v) return { ok: false, why: '' };
    var base = vbase(v, c, sub);
    if (v.items && base <= 0) return { ok: false, why: 'Tambahkan ' + v.lbl + ' ke keranjang untuk memakai voucher ini' };
    if (base < v.min) return { ok: false, why: 'Belanja ' + (v.items ? v.lbl + ' ' : '') + rp(v.min - base) + ' lagi untuk memakai voucher ini' };
    if (v.pay && v.pay.indexOf(S.pay) < 0) return { ok: false, why: 'Pilih pembayaran ' + v.payL + ' untuk memakai voucher ini' };
    return { ok: true, why: '' };
  }
  function vdisc(v, base, ship) { var d = v.pct ? Math.round(base * v.pct / 100) : v.flat ? v.flat : v.shipOff ? Math.min(v.shipOff, ship) : ship; return v.max ? Math.min(d, v.max) : d; }
  var PAYS = [['bank', 'Transfer Bank', 'BCA, BRI, atau Mandiri'], ['qris', 'QRIS', 'Semua e-wallet dan m-banking'], ['ewallet', 'E-Wallet', 'GoPay, OVO, atau DANA'], ['cod', 'COD (Bayar di Tempat)', 'Bayar saat pesanan sampai. Maks. ' + rp(CODMAX)], ['store', 'Bayar di Toko', 'Khusus ambil di toko']];
  var TABS = ['Semua', 'Belum Bayar', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];
  var S = { ship: 'reg', pay: '', bank: 'BCA', wal: 'GoPay', v: '', vo: false, touched: {}, tab: 'Semua' };
  var orders = [], mem = [], R, tm, orig;
  try { orders = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { orders = mem; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(orders)); } catch (e) { mem = orders; } }
  var IN = 'w-full border border-sc-beige rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sc-pink';
  var BTN = 'bg-sc-deep-green text-white font-bold rounded-xl px-4 py-2.5 text-sm hover:bg-sc-forest transition-all active:scale-95';
  var f = function (id) { var e = document.getElementById(id); return e ? e.value : ''; };
  var box = function (t, c) { return '<section class="bg-white rounded-2xl border border-sc-beige p-4"><h3 class="font-bold text-sc-deep-green mb-3">' + t + '</h3>' + c + '</section>'; };
  var fld = function (id, label, inner) { return '<div class="mb-3"><label class="text-xs font-semibold text-sc-deep-green/80 block mb-1" for="' + id + '">' + label + '</label>' + inner + '<p id="e_' + id + '" class="text-xs text-red-500 mt-1 hidden"></p></div>'; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  function cart() {
    return [].map.call(document.querySelectorAll('#cartItemList [data-price]'), function (e) {
      return { name: e.dataset.name, price: +e.dataset.price, qty: parseInt((e.querySelector('.item-qty') || {}).textContent) || 0, note: e.dataset.note || '', img: (e.querySelector('img') || { getAttribute: function () { return ''; } }).getAttribute('src') };
    }).filter(function (i) { return i.qty > 0; });
  }
  function calc() {
    var c = cart(), sub = c.reduce(function (s, i) { return s + i.price * i.qty; }, 0), a = AR[f('coCity')], ship = 0, free = false;
    if (S.ship === 'reg' && a && !a.none) { ship = a.reg; if (a.free && sub >= FREE) { free = true; ship = 0; } }
    if (S.ship === 'ins' && a && a.ins) ship = a.ins;
    var v = VO[S.v], d = 0;
    if (v && elig(v, c, sub).ok) d = vdisc(v, vbase(v, c, sub), ship);
    d = Math.min(d, sub + ship);
    return { c: c, sub: sub, ship: ship, free: free, d: d, total: sub + ship - d };
  }
  function bigOrder() { return cart().some(function (i) { return /box|hamper|gift/i.test(i.name); }); }

  /* ---------- status pesanan ---------- */
  function stage(o) {
    if (o.cancelled) return -1;
    if (o.force != null) return o.force;
    if (!(o.cod ? o.created : o.paidAt)) return o.expires < Date.now() ? -1 : -2;
    return 0; /* tetap "Pesanan diterima" sampai admin mengubah statusnya */
  }
  function label(o) { var s = stage(o); return s === -1 ? 'Dibatalkan' : s === -2 ? 'Belum Bayar' : s <= 2 ? 'Diproses' : s === 3 ? (o.ship === 'pick' ? 'Siap Diambil' : 'Dikirim') : 'Selesai'; }
  function stops(o) { return ['Pesanan diterima', 'Sedang dipanggang', 'Dikemas', o.ship === 'pick' ? 'Siap diambil' : 'Dikirim', 'Selesai']; }

  /* ---------- kerangka ---------- */
  function root() {
    if (R) return R;
    R = document.createElement('div'); R.id = 'scCo';
    R.className = 'fixed inset-0 z-[9999] bg-sc-cream overflow-y-auto hidden';
    document.body.appendChild(R);
    R.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.id === 'trId') { e.preventDefault(); track(); } });
    R.addEventListener('input', onInput); R.addEventListener('change', onInput); R.addEventListener('click', onClick);
    R.addEventListener('focusout', function (e) { if (e.target.id) { S.touched[e.target.id] = 1; showErr(); } });
    return R;
  }
  function hdr(t, back) {
    return '<div class="sticky top-0 z-10 bg-white border-b border-sc-beige px-4 py-3 flex items-center gap-3"><button data-act="' + (back || 'close') + '" class="text-xl text-sc-deep-green px-2" aria-label="Kembali">&larr;</button><h2 class="font-heading font-bold text-sc-deep-green text-lg flex-1">' + t + '</h2><button data-act="orders" class="text-xs font-bold text-sc-deep-green border border-sc-beige rounded-full px-3 py-1.5 hover:bg-sc-soft-pink">' + (window.SCUser ? 'Pesanan Saya' : 'Lacak Pesanan') + '</button></div>';
  }
  function show(html) { stopT(); root().innerHTML = html; R.classList.remove('hidden'); R.scrollTop = 0; document.body.style.overflow = 'hidden'; }
  function close() { stopT(); if (R) R.classList.add('hidden'); document.body.style.overflow = ''; }
  function stopT() { clearInterval(tm); tm = 0; }
  var foot = '';

  /* ---------- halaman checkout ---------- */
  function viewCheckout() {
    S.touched = {}; S.v = ''; S.vo = false;
    var cities = '<option value="">Pilih kota/kabupaten</option>' + Object.keys(AR).map(function (k) { return '<option>' + k + '</option>'; }).join('');
    var items = cart().map(function (i) { return '<div class="flex gap-3 items-center mb-2"><img src="' + esc(i.img) + '" class="w-12 h-12 rounded-lg object-cover" alt=""><div class="flex-1 text-xs"><p class="font-bold text-sc-deep-green">' + esc(i.name) + '</p><p class="text-sc-deep-green/60">' + i.qty + ' x ' + rp(i.price) + (i.note ? ' &middot; ' + esc(i.note) : '') + '</p></div><span class="text-xs font-bold">' + rp(i.price * i.qty) + '</span></div>'; }).join('');
    show(hdr('Checkout') + '<div class="max-w-5xl mx-auto p-4 grid lg:grid-cols-[1fr_380px] gap-5 items-start"><div class="space-y-4">' +
      box('Alamat Pengiriman', '<p id="coPre" style="display:none" class="text-[11px] text-emerald-700 mb-3">Terisi otomatis dari akunmu. Boleh kamu ubah kalau perlu.</p>' + fld('coName', 'Nama penerima', '<input id="coName" class="' + IN + '" maxlength="50" autocomplete="name">') + fld('coPhone', 'Nomor HP', '<input id="coPhone" class="' + IN + '" inputmode="tel" placeholder="08xxxxxxxxxx" maxlength="16" autocomplete="tel">') +
        '<div id="coAddrF">' + fld('coCity', 'Kota/Kabupaten', '<select id="coCity" class="' + IN + '">' + cities + '</select>') + fld('coKec', 'Kecamatan', '<select id="coKec" class="' + IN + '"><option value="">Pilih kota dulu</option></select>') + fld('coAddr', 'Alamat lengkap', '<textarea id="coAddr" rows="2" class="' + IN + '" maxlength="200" placeholder="Jalan, nomor rumah, RT/RW"></textarea>') + fld('coLand', 'Patokan (opsional)', '<input id="coLand" class="' + IN + '" maxlength="60">') + '</div>') +
      box('Pengiriman', '<div id="coShip"></div>') +
      box('Jadwal', '<div class="grid grid-cols-2 gap-3">' + fld('coDate', 'Tanggal', '<input id="coDate" type="date" class="' + IN + '">') + fld('coTime', 'Jam', '<select id="coTime" class="' + IN + '"></select>') + '</div><p id="coSchedNote" class="text-xs text-sc-deep-green/60"></p>') +
      box('Catatan untuk Penjual (opsional)', fld('coNote', 'Opsional, boleh dikosongkan. Contoh: tanpa kacang, tulisan di kue', '<textarea id="coNote" rows="2" class="' + IN + '" maxlength="150"></textarea>') + '<p id="coCnt" class="text-[11px] text-right text-sc-deep-green/50 -mt-2">0/150</p>') +
      box('Voucher', '<div id="coVR"></div>') +
      box('Metode Pembayaran', '<div id="coPay"></div>') + '</div>' +
      '<aside class="lg:sticky lg:top-20">' + box('Ringkasan Pesanan', items + '<div id="coSum" class="border-t border-sc-beige pt-3 mt-2 text-sm space-y-1"></div><button id="coBuy" data-act="buy" class="' + BTN + ' w-full mt-4 py-3">Buat Pesanan</button>') + '</aside></div>');
    refresh(); prefill();
  }
  function schedule() {
    var a = AR[f('coCity')], d = $('#coDate'), t = $('#coTime'); if (!d) return;
    var now = new Date(), min = new Date(now), late = now.getHours() >= 17;
    if (bigOrder() || (a && a.h1) || late) min.setDate(min.getDate() + 1);
    var iso = function (x) { return x.getFullYear() + '-' + pad(x.getMonth() + 1) + '-' + pad(x.getDate()); };
    if (S.ship === 'ins') { d.min = iso(now); d.value = iso(now); d.disabled = true; t.innerHTML = '<option>Maks. 2 jam</option>'; t.disabled = true; $('#coSchedNote').textContent = 'Instan diantar hari ini, maksimal 2 jam setelah pesanan dibayar.'; return; }
    d.disabled = false; t.disabled = false;
    d.min = iso(min); if (!d.value || d.value < d.min) d.value = d.min;
    var today = d.value === iso(now), h = now.getHours() + 2, o = '';
    for (var s = 8; s < 21; s += 2) if (!today || s >= h) o += '<option>' + pad(s) + ':00 - ' + pad(Math.min(s + 2, 21)) + ':00</option>';
    var keep = t.value; t.innerHTML = o || '<option value="">Tidak ada slot</option>'; if (keep) t.value = keep;
    $('#coSchedNote').textContent = 'Toko buka setiap hari, 08:00 - 21:00 WIB.' + (bigOrder() ? ' Hampers dan box minimal dipesan H-1.' : '') + (a && a.h1 ? ' Area ini diantar H+1.' : '');
  }
  function refresh() {
    var a = AR[f('coCity')], pick = S.ship === 'pick', t = calc(), h = new Date().getHours();
    if (S.ship === 'ins' && !(a && a.ins && h >= 8 && h < 19)) S.ship = 'reg';
    $('#coAddrF').style.display = S.ship === 'pick' ? 'none' : '';
    var op = function (k, n, d, c, dis) { return '<label class="flex items-center gap-3 p-3 rounded-xl border mb-2 cursor-pointer ' + (S.ship === k ? 'border-sc-deep-green bg-sc-soft-pink/30' : 'border-sc-beige') + (dis ? ' opacity-50' : '') + '"><input type="radio" name="ship" data-ship="' + k + '" ' + (S.ship === k ? 'checked' : '') + (dis ? ' disabled' : '') + '><div class="flex-1 text-sm"><p class="font-bold text-sc-deep-green">' + n + '</p><p class="text-xs text-sc-deep-green/60">' + d + '</p></div><span class="text-sm font-bold">' + c + '</span></label>'; };
    var reg = !a ? 'Pilih kota' : a.none ? 'Tidak tersedia' : (t.free && S.ship === 'reg' ? '<s class="text-xs font-normal">' + rp(a.reg) + '</s> GRATIS' : rp(a.reg));
    $('#coShip').innerHTML = op('reg', 'Reguler', a && a.h1 ? 'Diantar H+1 sesuai jadwal' : 'Diantar sesuai jadwal', reg, !a || a.none) +
      op('ins', 'Instan Hari Ini', a && a.ins ? (h >= 8 && h < 19 ? 'Sampai maks. 2 jam (khusus Kota Madiun)' : 'Hanya dipesan 08:00 - 19:00') : 'Khusus Kota Madiun', a && a.ins ? rp(a.ins) : '-', !(a && a.ins && h >= 8 && h < 19)) +
      op('pick', 'Ambil di Toko', 'Bakehouse Sweet Crumbs, Jl. Kolonel Marhadi No. 12, Madiun', 'Rp 0') + (a && a.none ? '<p class="text-xs text-red-500">Maaf, belum melayani kota ini. <a class="underline font-bold" target="_blank" rel="noopener" href="https://wa.me/' + WA + '">Hubungi toko via WhatsApp</a></p>' : '');
    var ok = { cod: !pick && a && a.cod && t.total <= CODMAX, store: pick };
    if (S.pay && ok[S.pay] === false || (S.pay === 'store' && !pick) || (S.pay === 'cod' && !ok.cod)) S.pay = '';
    $('#coPay').innerHTML = PAYS.map(function (p) {
      var dis = (p[0] === 'cod' && !ok.cod) || (p[0] === 'store' && !pick), sel = S.pay === p[0];
      var sub = sel && p[0] === 'bank' ? '<select id="coBank" class="' + IN + ' mt-2">' + ['BCA', 'BRI', 'Mandiri'].map(function (b) { return '<option' + (S.bank === b ? ' selected' : '') + '>' + b + '</option>'; }).join('') + '</select>' : sel && p[0] === 'ewallet' ? '<select id="coWal" class="' + IN + ' mt-2">' + ['GoPay', 'OVO', 'DANA'].map(function (b) { return '<option' + (S.wal === b ? ' selected' : '') + '>' + b + '</option>'; }).join('') + '</select>' : '';
      return '<label class="block p-3 rounded-xl border mb-2 ' + (sel ? 'border-sc-deep-green bg-sc-soft-pink/30' : 'border-sc-beige') + (dis ? ' opacity-50' : ' cursor-pointer') + '"><div class="flex items-center gap-3"><input type="radio" name="pay" data-pay="' + p[0] + '" ' + (sel ? 'checked' : '') + (dis ? ' disabled' : '') + '><div class="text-sm"><p class="font-bold text-sc-deep-green">' + p[1] + '</p><p class="text-xs text-sc-deep-green/60">' + p[2] + '</p></div></div>' + sub + '</label>';
    }).join('');
    $('#coSum').innerHTML = '<div class="flex justify-between"><span>Subtotal</span><span>' + rp(t.sub) + '</span></div><div class="flex justify-between"><span>Ongkir</span><span>' + (t.free ? 'GRATIS' : rp(t.ship)) + '</span></div>' + (t.d ? '<div class="flex justify-between text-emerald-600"><span>Diskon voucher</span><span>-' + rp(t.d) + '</span></div>' : '') + '<div class="flex justify-between font-bold text-base pt-2 border-t border-sc-beige"><span>Total</span><span>' + rp(t.total) + '</span></div>';
    renderV(); schedule(); showErr();
  }
  /* ---------- validasi ---------- */
  function phone() { var p = f('coPhone').replace(/[\s\-().]/g, ''); if (/^\+?62/.test(p)) p = '0' + p.replace(/^\+?62/, ''); return p; }
  function errs() {
    var e = {}, n = f('coName').trim(), p = phone(), a = AR[f('coCity')], pick = S.ship === 'pick';
    if (n.length < 3) e.coName = 'Nama minimal 3 karakter'; else if (n.length > 50) e.coName = 'Nama maksimal 50 karakter'; else if (!/^[A-Za-z\u00C0-\u024F.' ]+$/.test(n)) e.coName = 'Nama hanya boleh huruf, spasi, titik, atau apostrof';
    if (!/^[0-9+]+$/.test(f('coPhone').replace(/[\s\-().]/g, ''))) e.coPhone = 'Nomor HP hanya boleh angka'; else if (!/^08/.test(p)) e.coPhone = 'Nomor harus diawali 08, 628, atau +628'; else if (p.length < 10) e.coPhone = 'Nomor HP minimal 10 digit'; else if (p.length > 13) e.coPhone = 'Nomor HP maksimal 13 digit';
    if (!pick) {
      if (!a) e.coCity = 'Pilih kota atau kabupaten'; else if (a.none) e.coCity = 'Kota ini belum dilayani';
      if (a && !a.none && !f('coKec')) e.coKec = 'Pilih kecamatan';
      var ad = f('coAddr').trim(); if (ad.length < 10) e.coAddr = 'Alamat minimal 10 karakter'; else if (ad.length > 200) e.coAddr = 'Alamat maksimal 200 karakter';
    }
    if (S.ship !== 'ins') { if (!f('coDate')) e.coDate = 'Pilih tanggal'; else if (f('coDate') < $('#coDate').min) e.coDate = 'Tanggal tidak boleh sebelum ' + $('#coDate').min; if (!f('coTime')) e.coTime = 'Pilih jam'; }
    if (!S.pay) e.coPay = 'Pilih metode pembayaran';
    return e;
  }
  function showErr() {
    var e = errs();
    ['coName', 'coPhone', 'coCity', 'coKec', 'coAddr', 'coDate', 'coTime'].forEach(function (id) {
      var p = document.getElementById('e_' + id), i = document.getElementById(id); if (!p) return;
      var on = S.touched[id] && e[id]; p.textContent = on ? e[id] : ''; p.classList.toggle('hidden', !on); if (i) i.classList.toggle('border-red-400', !!on);
    });
    var b = $('#coBuy'); if (b) { var bad = Object.keys(e).length > 0; b.style.opacity = bad ? '.5' : '1'; }
  }
  function onInput(e) {
    var t = e.target, id = t.id;
    if (id === 'coCity') { var a = AR[t.value]; $('#coKec').innerHTML = a && a.k.length ? '<option value="">Pilih kecamatan</option>' + a.k.map(function (k) { return '<option>' + k + '</option>'; }).join('') : '<option value="">-</option>'; refresh(); }
    else if (id === 'coBank') S.bank = t.value; else if (id === 'coWal') S.wal = t.value;
    else if (id === 'coNote') $('#coCnt').textContent = t.value.length + '/150';
    else if (id === 'coDate') { schedule(); showErr(); }
    else if (t.dataset && t.dataset.ship) { S.ship = t.dataset.ship; refresh(); }
    else if (t.dataset && t.dataset.pay) { S.pay = t.dataset.pay; refresh(); }
    else showErr();
  }
  function vopen() {
    S.vo = !S.vo; renderV();
  }
  function vclear() { S.v = ''; refresh(); }
  function voucher(code) {
    var v = VO[code], t = calc(); if (!v || !elig(v, t.c, t.sub).ok) return;
    S.v = code; S.vo = false; refresh();
  }
  function renderV() {
    var t = calc(), row = $('#coVR'); if (!row) return;
    if (S.v && !elig(VO[S.v], t.c, t.sub).ok) { S.v = ''; t = calc(); }
    var v0 = VO[S.v], open = S.vo;
    var chev = '<svg class="w-4 h-4 shrink-0 text-sc-deep-green/60 transition-transform ' + (open ? 'rotate-180' : '') + '" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8l5 5 5-5"/></svg>';
    var head = '<div class="flex items-stretch gap-2"><button type="button" data-act="vtoggle" aria-expanded="' + (open ? 'true' : 'false') + '" class="flex-1 flex items-center gap-3 text-left rounded-xl border ' + (v0 ? 'border-sc-deep-green bg-sc-soft-pink/30' : 'border-sc-beige hover:bg-sc-soft-pink/20') + ' px-3 py-3">' +
      (v0
        ? '<span class="shrink-0 text-[10px] font-bold text-white bg-sc-deep-green rounded-md px-1.5 py-1">' + v0.b + '</span><span class="flex-1 text-sm"><b class="text-sc-deep-green">' + v0.t + '</b>' + (t.d ? '<br><span class="text-xs text-emerald-600">Hemat ' + rp(t.d) + '</span>' : '') + '</span>'
        : '<span class="flex-1 text-sm font-semibold text-sc-deep-green">' + 'Voucher' + '</span>') + chev + '</button>' +
      (v0 ? '<button type="button" data-act="vclear" aria-label="Lepas voucher" class="px-3 rounded-xl border border-sc-beige text-sc-deep-green/60 hover:text-red-500">&#10005;</button>' : '') + '</div>';
    var list = '';
    if (open) {
      var l = Object.keys(VO).map(function (c) { return { c: c, v: VO[c], e: elig(VO[c], t.c, t.sub) }; });
      l.sort(function (a, b) { return (b.e.ok - a.e.ok) || (a.v.min - b.v.min); });
      list = '<div id="coVL" class="mt-2 max-h-80 overflow-y-auto pr-0.5">' + l.map(function (x) {
        var v = x.v, on = S.v === x.c, sh = v.ship || v.shipOff, sv = Math.min(vdisc(v, vbase(v, t.c, t.sub), t.ship), t.sub + t.ship);
        var note = x.e.ok ? (sh && !t.ship ? 'Berlaku saat ongkir berbayar' : sv > 0 ? 'Hemat ' + rp(sv) : 'Potongan ongkir kirim') : x.e.why;
        var cond = 'Min. belanja ' + (v.items ? v.lbl + ' ' : '') + rp(v.min) + (v.max ? ' &middot; maks. potongan ' + rp(v.max) : '') + (v.pay ? ' &middot; bayar via ' + v.payL : '');
        return '<button type="button" data-act="vpick" data-c="' + x.c + '"' + (x.e.ok ? '' : ' disabled') + ' class="w-full text-left flex items-stretch rounded-xl border mb-2 overflow-hidden ' + (on ? 'border-sc-deep-green bg-sc-soft-pink/30' : 'border-sc-beige bg-white') + (x.e.ok ? ' hover:bg-sc-soft-pink/20' : ' opacity-60 cursor-not-allowed') + '">' +
          '<div class="w-20 shrink-0 flex items-center justify-center text-center px-1 text-[10px] leading-tight font-bold text-white ' + (sh ? 'bg-sky-600' : 'bg-sc-deep-green') + '">' + v.b + '</div>' +
          '<div class="flex-1 p-2.5"><p class="text-sm font-bold text-sc-deep-green">' + v.t + '</p><p class="text-[11px] text-sc-deep-green/60">' + cond + '</p>' +
          '<p class="text-[11px] ' + (x.e.ok ? 'text-emerald-600' : 'text-red-500') + '">' + note + '</p></div>' +
          '<div class="flex items-center pr-3 text-sc-deep-green font-bold">' + (on ? '&#10003;' : '') + '</div></button>';
      }).join('') + '</div>';
    }
    row.innerHTML = head + list;
  }

  /* ---------- buat pesanan ---------- */
  function buy() {
    reload();
    ['coName', 'coPhone', 'coCity', 'coKec', 'coAddr', 'coDate', 'coTime'].forEach(function (id) { S.touched[id] = 1; });
    var e = errs(); showErr();
    if (e.coPay) { var pm = $('#coPay'); pm.insertAdjacentHTML('beforebegin', '<p id="e_coPay" class="text-xs text-red-500 mb-2">' + e.coPay + '</p>'); setTimeout(function () { var x = $('#e_coPay'); if (x) x.remove(); }, 3000); }
    var first = Object.keys(e)[0]; if (first) { var el = document.getElementById(first) || $('#coPay'); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    var t = calc(), d = new Date(), pick = S.ship === 'pick', cod = S.pay === 'cod' || S.pay === 'store';
    var today = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()), n = orders.filter(function (o) { return o.id.indexOf(today) > -1; }).length + 1;
    var o = { email: (window.SCUser && window.SCUser.email) || 'tamu', id: 'SC-' + today + '-' + pad(n, 3), created: Date.now(), items: t.c, sub: t.sub, ship: S.ship, shipCost: t.ship, disc: t.d, voucher: S.v, total: t.total, pay: S.pay, bank: S.bank, wal: S.wal, cod: cod, expires: Date.now() + 30 * 60000, paidAt: 0,
      name: f('coName').trim(), phone: phone(), addr: pick ? 'Ambil di toko' : f('coAddr').trim() + ', ' + f('coKec') + ', ' + f('coCity') + (f('coLand') ? ' (' + f('coLand') + ')' : ''), date: S.ship === 'ins' ? 'Hari ini (maks. 2 jam)' : f('coDate') + ', ' + f('coTime'), note: f('coNote').trim() };
    orders.unshift(o); save(); clearCart(); S.v = ''; rememberPhone(o);
    cod ? done(o) : pay(o);
  }
  function clearCart() {
    [].slice.call(document.querySelectorAll('#cartItemList [data-price]')).forEach(function (e) {
      var q = e.querySelector('.item-qty'), m = e.querySelector('button[onclick*="-1"]'); if (q && m && window.updateItemQty) { q.textContent = '1'; window.updateItemQty(m, -1); } else e.remove();
    });
  }

  /* ---------- halaman pembayaran ---------- */
  function qr(seed) {
    var h = 7, i, x, y, s = ''; for (i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    var r = function () { h = (h * 1664525 + 1013904223) >>> 0; return (h >>> 16) & 1; };
    for (y = 0; y < 25; y++) for (x = 0; x < 25; x++) {
      var fx = x < 7 ? x : x > 17 ? x - 18 : -1, fy = y < 7 ? y : y > 17 ? y - 18 : -1, on;
      if (fx > -1 && fy > -1 && !(x > 17 && y > 17)) on = fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx > 1 && fx < 5 && fy > 1 && fy < 5); else on = r();
      if (on) s += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
    }
    return '<svg viewBox="-1 -1 27 27" class="w-44 h-44 mx-auto bg-white p-2 rounded-xl border border-sc-beige"><g fill="#123F32">' + s + '</g></svg>';
  }
  function pay(o) {
    var num = 0, i; for (i = 0; i < o.id.length; i++) num = (num * 31 + o.id.charCodeAt(i)) % 1000000007;
    var va = ({ BCA: '39201', BRI: '88810', Mandiri: '70012' }[o.bank] || '88810') + pad(String(num).slice(0, 9), 9) , body;
    if (o.pay === 'bank') body = '<p class="text-xs text-sc-deep-green/60">Nomor Virtual Account ' + o.bank + '</p><div class="flex items-center justify-center gap-2 my-2"><span class="font-heading text-2xl font-bold tracking-wider text-sc-deep-green">' + va + '</span><button data-act="copy" data-v="' + va + '" class="text-xs border border-sc-beige rounded-lg px-2 py-1 hover:bg-sc-soft-pink">Salin</button></div>';
    else if (o.pay === 'qris') body = '<p class="text-xs text-sc-deep-green/60 mb-2">Scan kode QRIS dengan aplikasi pembayaranmu</p>' + qr(o.id);
    else body = '<p class="text-sm">Buka aplikasi <b>' + o.wal + '</b>, pilih Bayar, lalu masukkan kode <b class="font-heading">' + va.slice(0, 12) + '</b>.</p>';
    show(hdr('Pembayaran', 'close') + '<div class="max-w-md mx-auto p-4"><section class="bg-white rounded-2xl border border-sc-beige p-5 text-center"><p class="text-xs text-sc-deep-green/60">Selesaikan pembayaran dalam</p><p id="coCd" class="font-heading text-3xl font-bold text-sc-deep-green my-1">30:00</p><p class="text-xs text-sc-deep-green/60 mb-4">Pesanan ' + o.id + '</p><p class="text-xs">Total yang harus dibayar</p><p class="font-heading text-2xl font-bold mb-4">' + rp(o.total) + '</p>' + body + '<button data-act="paid" data-id="' + o.id + '" class="' + BTN + ' w-full mt-5 py-3">Saya Sudah Bayar</button><button data-act="cancel" data-id="' + o.id + '" class="w-full mt-2 text-xs text-red-500 py-2">Batalkan pesanan</button><p id="coChk" class="text-sm font-bold text-sc-deep-green mt-3 hidden">Memeriksa pembayaran...</p></section></div>' + foot);
    var tick = function () { var l = Math.max(0, Math.floor((o.expires - Date.now()) / 1000)), e = $('#coCd'); if (e) e.textContent = pad(Math.floor(l / 60)) + ':' + pad(l % 60); if (!l) { stopT(); viewOrders(); } };
    tick(); tm = setInterval(tick, 1000);
  }
  function find(id) { return orders.filter(function (o) { return o.id === id; })[0]; }

  /* ---------- pesanan berhasil ---------- */
  function done(o) {
    try { window.dispatchEvent(new CustomEvent('sc-order', { detail: { pay: o.pay } })); } catch (e) {}
    show('<div class="min-h-screen flex items-center justify-center p-4"><section class="bg-white rounded-3xl border border-sc-beige p-6 text-center max-w-md w-full"><div class="text-5xl mb-2">&#127881;</div><h2 class="font-heading text-2xl font-bold text-sc-deep-green">Pesanan Berhasil!</h2><p class="text-sm text-sc-deep-green/70 mt-1">Nomor pesanan <b>' + o.id + '</b></p>' +
      (o.pay === 'cod' ? '<p class="mt-3 p-3 rounded-xl bg-sc-soft-pink/40 text-sm">Siapkan uang <b>' + rp(o.total) + '</b> saat pesanan tiba.</p>' : o.pay === 'store' ? '<p class="mt-3 p-3 rounded-xl bg-sc-soft-pink/40 text-sm">Bayar <b>' + rp(o.total) + '</b> saat mengambil pesanan di toko.</p>' : '<p class="mt-3 p-3 rounded-xl bg-emerald-50 text-sm text-emerald-700">Pembayaran <b>' + rp(o.total) + '</b> diterima.</p>') +
      '<div class="text-left text-xs mt-4 space-y-1">' + o.items.map(function (i) { return '<div class="flex justify-between"><span>' + i.qty + 'x ' + esc(i.name) + '</span><span>' + rp(i.price * i.qty) + '</span></div>'; }).join('') + '</div>' +
      '<div class="grid gap-2 mt-5"><button data-act="detail" data-id="' + o.id + '" class="' + BTN + ' py-3">' + (window.SCUser ? 'Lihat Pesanan Saya' : 'Lacak Pesanan Ini') + '</button><button data-act="close" class="border border-sc-beige rounded-xl py-2.5 text-sm font-bold text-sc-deep-green">Belanja Lagi</button><button data-act="wa" data-id="' + o.id + '" class="text-xs text-sc-deep-green underline py-1">Tanya toko via WhatsApp</button></div></section></div>' + foot);
    var imgs = o.items.map(function (i) { return i.img; }).filter(Boolean);
    if (imgs.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var L = document.createElement('div'); L.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:10000;overflow:hidden'; document.body.appendChild(L);
      for (var k = 0; k < 24; k++) { var im = new Image(), s = 36 + Math.random() * 30; im.src = imgs[k % imgs.length]; im.style.cssText = 'position:absolute;top:-80px;border-radius:50%;object-fit:cover;box-shadow:0 4px 10px rgba(0,0,0,.2);width:' + s + 'px;height:' + s + 'px;left:' + Math.random() * (innerWidth - s) + 'px'; L.appendChild(im);
        im.animate([{ transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(' + (innerHeight + 120) + 'px) rotate(' + (Math.random() * 720 - 360) + 'deg)' }], { duration: 1600 + Math.random() * 1400, delay: Math.random() * 600, easing: 'cubic-bezier(.3,.1,.6,1)', fill: 'both' }); }
      setTimeout(function () { L.remove(); }, 3800);
    }
  }

  /* ---------- pesanan saya ---------- */
  function sig() { return orders.map(function (o) { return o.id + stage(o); }).join(); }
  function reload() { try { orders = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) {} }
  function viewOrders() {
    reload();
    if (!window.SCUser) return viewTrack();
    var shown = orders.filter(function (o) { if (o.email !== window.SCUser.email) return false; var l = label(o); return S.tab === 'Semua' || l === S.tab || (S.tab === 'Dikirim' && l === 'Siap Diambil'); });
    show(hdr('Pesanan Saya') + '<div class="max-w-2xl mx-auto p-4"><div class="flex gap-2 overflow-x-auto pb-3">' + TABS.map(function (t) { return '<button data-act="tab" data-t="' + t + '" class="whitespace-nowrap text-xs font-bold px-3 py-1.5 rounded-full border ' + (S.tab === t ? 'bg-sc-deep-green text-white border-sc-deep-green' : 'bg-white border-sc-beige text-sc-deep-green') + '">' + t + '</button>'; }).join('') + '</div>' +
      (shown.length ? shown.map(function (o) { var im = o.items[0] || {}; return '<section data-act="detail" data-id="' + o.id + '" class="bg-white rounded-2xl border border-sc-beige p-4 mb-3 cursor-pointer"><div class="flex justify-between text-xs mb-2"><b>' + o.id + '</b><span class="font-bold text-sc-deep-green">' + label(o) + '</span></div><div class="flex gap-3 items-center"><img src="' + esc(im.img || '') + '" class="w-14 h-14 rounded-lg object-cover" alt=""><div class="flex-1 text-xs"><p class="font-bold">' + esc(im.name || '') + (o.items.length > 1 ? ' +' + (o.items.length - 1) + ' lainnya' : '') + '</p><p class="text-sc-deep-green/60">' + new Date(o.created).toLocaleDateString('id-ID') + '</p></div><span class="font-bold text-sm">' + rp(o.total) + '</span></div></section>'; }).join('') : '<p class="text-center text-sm text-sc-deep-green/60 py-16">Belum ada pesanan di sini.</p>') + '</div>' + foot);
    var s0 = sig(); tm = setInterval(function () { reload(); if (sig() !== s0) viewOrders(); }, 2000);
  }
  function tl(o) {
    var s = stage(o), st = stops(o);
    if (s < 0) return '<p class="text-sm font-bold ' + (s === -1 ? 'text-red-500' : 'text-amber-600') + '">' + (s === -1 ? 'Pesanan dibatalkan' : 'Menunggu pembayaran') + '</p>';
    return st.map(function (t, i) { return '<div class="flex items-center gap-3 mb-2"><span class="w-5 h-5 rounded-full text-[10px] flex items-center justify-center ' + (i <= s ? 'bg-sc-deep-green text-white' : 'bg-sc-beige text-sc-deep-green/50') + '">' + (i <= s ? '&#10003;' : i + 1) + '</span><span class="text-sm ' + (i <= s ? 'font-bold text-sc-deep-green' : 'text-sc-deep-green/50') + '">' + t + '</span></div>'; }).join('');
  }
  function detail(id) {
    reload();
    var o = find(id); if (!o) return viewOrders(); var s0 = stage(o);
    show(hdr('Detail Pesanan', 'orders') + '<div class="max-w-2xl mx-auto p-4 space-y-3">' + box(o.id, '<div id="coTl">' + tl(o) + '</div>') +
      box('Rincian', o.items.map(function (i) { return '<div class="flex gap-3 items-center mb-2"><img src="' + esc(i.img) + '" class="w-12 h-12 rounded-lg object-cover" alt=""><div class="flex-1 text-xs"><p class="font-bold">' + esc(i.name) + '</p><p>' + i.qty + ' x ' + rp(i.price) + '</p></div><b class="text-xs">' + rp(i.price * i.qty) + '</b></div>'; }).join('') + '<div class="border-t border-sc-beige pt-2 text-sm space-y-1"><div class="flex justify-between"><span>Subtotal</span><span>' + rp(o.sub) + '</span></div><div class="flex justify-between"><span>Ongkir</span><span>' + (o.shipCost ? rp(o.shipCost) : 'Rp 0') + '</span></div>' + (o.disc ? '<div class="flex justify-between text-emerald-600"><span>Voucher ' + o.voucher + '</span><span>-' + rp(o.disc) + '</span></div>' : '') + '<div class="flex justify-between font-bold"><span>Total</span><span>' + rp(o.total) + '</span></div></div>') +
      box('Pengiriman', '<p class="text-sm"><b>' + esc(o.name) + '</b> (' + o.phone + ')<br>' + esc(o.addr) + '<br>Jadwal: ' + esc(o.date) + (o.note ? '<br>Catatan: ' + esc(o.note) : '') + '</p><p class="text-xs mt-2 text-sc-deep-green/60">Pembayaran: ' + ({ bank: 'Transfer ' + o.bank, qris: 'QRIS', ewallet: o.wal, cod: 'COD (bayar saat diterima)', store: 'Bayar di toko' }[o.pay]) + '</p>') +
      '<div id="coAct" class="flex flex-wrap gap-2"></div></div>' + foot);
    var acts = function () {
      var o2 = find(id), s = stage(o2), h = '';
      if (s === -2) h += '<button data-act="topay" data-id="' + id + '" class="' + BTN + '">Bayar Sekarang</button><button data-act="cancel" data-id="' + id + '" class="border border-red-300 text-red-500 rounded-xl px-4 py-2.5 text-sm font-bold">Batalkan</button>';
      if (s === 4 || s === -1) h += '<button data-act="rebuy" data-id="' + id + '" class="' + BTN + '">Beli Lagi</button>';
      if (s === 4) h += '<button data-act="review" class="border border-sc-beige rounded-xl px-4 py-2.5 text-sm font-bold text-sc-deep-green">Beri Ulasan</button>';
      h += '<button data-act="wa" data-id="' + id + '" class="text-xs underline text-sc-deep-green px-2">Tanya toko via WhatsApp</button>'; $('#coAct').innerHTML = h;
    }; acts();
    tm = setInterval(function () { reload(); var o2 = find(id) || o, s = stage(o2); $('#coTl').innerHTML = tl(o2); if (s !== s0) { s0 = s; acts(); } }, 1000);
  }

  /* ---------- data pembeli ---------- */
  function np(p) { p = String(p || '').replace(/[\s\-().]/g, ''); if (/^\+?62/.test(p)) p = '0' + p.replace(/^\+?62/, ''); return p; }
  function custGet(em) { try { return JSON.parse(localStorage.getItem('sc_customers') || '{}')[em] || null; } catch (e) { return null; } }
  function prefill() {
    var u = window.SCUser; if (!u || u.role !== 'customer') return;
    var c = custGet(u.email) || {}, n = $('#coName'), p = $('#coPhone'), hit = 0;
    if (n && !n.value) { n.value = u.name; hit = 1; }
    if (p && !p.value && c.phone) { p.value = c.phone; hit = 1; }
    var h = $('#coPre'); if (h && hit) h.style.display = '';
    if (hit) { S.touched = {}; showErr(); }
  }
  function rememberPhone(o) {
    var u = window.SCUser; if (!u || u.role !== 'customer') return;
    try { var C = JSON.parse(localStorage.getItem('sc_customers') || '{}'); if (C[u.email]) { C[u.email].phone = o.phone; localStorage.setItem('sc_customers', JSON.stringify(C)); } } catch (e) {}
  }
  function viewTrack(msg) {
    var lb = 'text-xs font-semibold text-sc-deep-green/80 block mb-1';
    show(hdr('Lacak Pesanan') + '<div class="max-w-md mx-auto p-4"><section class="bg-white rounded-2xl border border-sc-beige p-5">' +
      '<p class="text-sm text-sc-deep-green/70 mb-4">Masukkan nomor pesanan yang kamu terima setelah checkout.</p>' +
      '<div class="mb-3"><label class="' + lb + '" for="trId">Nomor pesanan</label><input id="trId" class="' + IN + ' uppercase" placeholder="SC-20261119-001" maxlength="20" autocomplete="off"></div>' +
      '<p id="trErr" class="text-xs text-red-500 mb-3"' + (msg ? '' : ' style="display:none"') + '>' + (msg || '') + '</p>' +
      '<button data-act="track" class="' + BTN + ' w-full py-3">Lacak Pesanan</button></section>' +
      '<section class="mt-4 text-center"><p class="text-sm text-sc-deep-green/70">Punya akun? Masuk untuk melihat semua riwayat pesananmu.</p><button data-act="login" class="mt-2 border border-sc-deep-green text-sc-deep-green font-bold rounded-xl px-4 py-2 text-sm hover:bg-sc-soft-pink/30">Masuk / Daftar</button></section></div>');
  }
  function track() {
    reload();
    var id = ($('#trId').value || '').trim().toUpperCase();
    if (!id) return viewTrack('Isi nomor pesanan dulu');
    var o = orders.filter(function (x) { return x.id.toUpperCase() === id; })[0];
    if (!o) return viewTrack('Nomor pesanan tidak ditemukan');
    detail(o.id);
  }

  /* ---------- aksi ---------- */
  function onClick(e) {
    var b = e.target.closest('[data-act]'); if (!b) return; reload(); var a = b.dataset.act, id = b.dataset.id, o = id && find(id);
    if (a === 'close') close(); else if (a === 'orders') viewOrders(); else if (a === 'buy') buy(); else if (a === 'vtoggle') vopen(); else if (a === 'vpick') voucher(b.dataset.c); else if (a === 'vclear') vclear(); else if (a === 'track') track(); else if (a === 'login') { if (window.SCAuth) window.SCAuth.login(function () { viewOrders(); }); }
    else if (a === 'tab') { S.tab = b.dataset.t; viewOrders(); } else if (a === 'detail') detail(id);
    else if (a === 'copy') { try { navigator.clipboard.writeText(b.dataset.v); } catch (x) {} b.textContent = 'Tersalin'; }
    else if (a === 'paid') { b.disabled = true; $('#coChk').classList.remove('hidden'); setTimeout(function () { reload(); var o2 = find(id) || o; o2.paidAt = Date.now(); save(); done(o2); }, 2200); }
    else if (a === 'cancel') { if (o) { o.cancelled = true; save(); } viewOrders(); }
    else if (a === 'topay') pay(o);
    else if (a === 'rebuy') { close(); o.items.forEach(function (i) { for (var k = 0; k < i.qty; k++) window.addToCart(null, i.name, i.price, i.img, '', i.note || ''); }); var cb = $('#cartToggleBtn'); if (cb) cb.click(); }
    else if (a === 'review') { close(); var l = $('a[href="#ulasan"], [data-nav="ulasan"]'); if (l) l.click(); else location.hash = '#ulasan'; }
    else if (a === 'wa') window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent('Halo Sweet Crumbs, aku mau tanya soal pesanan ' + (o ? o.id : '')), '_blank');
  }
  window.SCCO = { stage: stage, label: label, orders: function () { viewOrders(); } };
  function hook() {
    orig = window.checkoutWhatsApp;
    window.checkoutWhatsApp = function () { if (!cart().length) return orig && orig.apply(this, arguments); viewCheckout(); };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(hook, 0); }); else setTimeout(hook, 0);
})();

/* Sweet Crumbs - Keranjang: hapus produk satu per satu atau sekaligus */
(function () {
  'use strict';
  var ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>';
  var L, bar, btnAll, empty, armed = 0, tmr;
  function drop(row) {
    var q = row.querySelector('.item-qty'), m = row.querySelector('button[onclick*="-1"]');
    if (q && m && window.updateItemQty) { q.textContent = '1'; window.updateItemQty(m, -1); } else row.remove();
    sync();
  }
  function reset() { armed = 0; clearTimeout(tmr); if (btnAll) btnAll.textContent = 'Kosongkan keranjang'; }
  function sync() {
    if (!L) return;
    var rows = L.querySelectorAll('[data-price]');
    [].forEach.call(rows, function (r) {
      if (r.querySelector('[data-del]')) return;
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-del', '1'); b.setAttribute('aria-label', 'Hapus dari keranjang'); b.title = 'Hapus';
      b.className = 'self-start p-2 -mr-1 -mt-1 rounded-lg text-sc-deep-green/40 hover:text-red-500 hover:bg-white transition-colors'; b.innerHTML = ICON; r.appendChild(b);
    });
    bar.style.display = rows.length > 1 ? '' : 'none';
    empty.style.display = rows.length ? 'none' : '';
    if (rows.length < 2) reset();
  }
  function init() {
    L = document.getElementById('cartItemList'); if (!L) return;
    bar = document.createElement('div'); bar.className = 'px-6 pt-3 flex justify-end';
    btnAll = document.createElement('button'); btnAll.type = 'button'; btnAll.setAttribute('data-clearall', '1'); btnAll.className = 'text-xs font-semibold text-red-500 hover:underline'; btnAll.textContent = 'Kosongkan keranjang';
    bar.appendChild(btnAll);
    empty = document.createElement('p'); empty.className = 'px-6 py-10 text-center text-sm text-sc-deep-green/60'; empty.textContent = 'Keranjangmu masih kosong. Yuk pilih kue favoritmu!';
    L.parentNode.insertBefore(bar, L); L.parentNode.insertBefore(empty, L);
    new MutationObserver(sync).observe(L, { childList: true });
    document.addEventListener('click', function (e) {
      var d = e.target.closest('[data-del]'), a = e.target.closest('[data-clearall]');
      if (d) { var row = d.closest('[data-price]'); if (row) drop(row); }
      else if (a) {
        if (!armed) { armed = 1; btnAll.textContent = 'Klik lagi untuk hapus semua'; tmr = setTimeout(reset, 3000); }
        else { reset(); [].slice.call(L.querySelectorAll('[data-price]')).forEach(drop); }
      }
    });
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
