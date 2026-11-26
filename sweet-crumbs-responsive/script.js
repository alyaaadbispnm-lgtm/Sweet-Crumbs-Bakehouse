/* ===== Tailwind Configuration =====
   Harus dimuat langsung (tanpa defer) tepat setelah Tailwind CDN. */
var TAILWIND_CONFIG = {
  theme: {
    extend: {
      colors: {
        'sc-pink': '#F5A9C5',
        'sc-soft-pink': '#F8DDE8',
        'sc-deep-green': '#123F32',
        'sc-forest': '#0c2b22',
        'sc-cream': '#FFF4DF',
        'sc-beige': '#E8D7B8',
        'sc-gold': '#D4AF37'
      },
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        serif: ['DM Serif Display', 'serif']
      },
      boxShadow: {
        'crumb': '0 10px 30px -5px rgba(18, 63, 50, 0.08), 0 4px 6px -2px rgba(18, 63, 50, 0.04)',
        'pink-glow': '0 15px 35px -5px rgba(245, 169, 197, 0.35)',
        'card-hover': '0 20px 40px -10px rgba(18, 63, 50, 0.16)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)'
      }
    }
  }
}

// Pasang konfigurasi hanya jika Tailwind CDN berhasil dimuat,
// supaya error jaringan tidak mematikan seluruh script di bawah.
if (typeof tailwind !== 'undefined') tailwind.config = TAILWIND_CONFIG;

/* Foto produk (.jpg) dipakai jika ada di folder images/.
   Jika belum ada, otomatis memakai ilustrasi (.svg) dengan nama yang sama. */
document.addEventListener('error', function (e) {
  var img = e.target;
  if (img && img.tagName === 'IMG' && /\.jpg(\?.*)?$/.test(img.src)) {
    img.src = img.src.replace(/\.jpg(\?.*)?$/, '.svg');
  }
}, true);

/* ===== Interaksi Halaman (dijalankan setelah DOM siap) ===== */
document.addEventListener('DOMContentLoaded', function () {

  /* --- Toast (pengganti alert) --- */
  const toast = document.createElement('div');
  toast.className = 'fixed left-1/2 -translate-x-1/2 bottom-6 z-[70] max-w-sm w-[calc(100%-2rem)] px-5 py-3 rounded-2xl bg-sc-deep-green text-sc-cream text-sm shadow-2xl transition-all duration-300 opacity-0 pointer-events-none translate-y-4';
  toast.id = 'scToast'; toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove('opacity-0', 'translate-y-4');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('opacity-0', 'translate-y-4'), 4500);
  }

  /* --- Navigasi Halaman (Beranda, Menu, Racik Hadiah, Ulasan, Kontak) --- */
  const pages = Array.from(document.querySelectorAll('[data-page]'));
  const pageTitles = { 'beranda': 'Beranda', 'menu': 'Katalog Menu', 'racik-hadiah': 'Racik Hadiahmu', 'ulasan': 'Rating & Ulasan', 'kontak': 'Kontak & FAQ' };
  const baseTitle = document.title;
  let currentPage = null;

  function setPage(name) {
    pages.forEach(p => { p.hidden = p.dataset.page !== name; });
    document.querySelectorAll('[data-nav]').forEach(a => {
      const on = a.dataset.nav === name;
      a.classList.toggle('text-sc-pink', on);
      a.classList.toggle('font-bold', on);
    });
    document.querySelectorAll('[data-nav-bottom]').forEach(a => {
      const on = a.dataset.navBottom === name;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.title = name === 'beranda' ? baseTitle : pageTitles[name] + ' | ' + baseTitle;
    currentPage = name;
  }

  function route() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (pageTitles[id]) {                       // #menu, #kontak, ...
      if (id !== currentPage) { setPage(id); window.scrollTo(0, 0); }
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = id ? document.getElementById(id) : null;
    const host = target && target.closest('[data-page]');
    if (host) {                                 // #faq, #testimoni, ... buka halaman induknya
      if (host.dataset.page !== currentPage) setPage(host.dataset.page);
      target.scrollIntoView();
      return;
    }
    if (!currentPage) setPage('beranda');       // pertama kali dibuka
  }

  // Tautan kosong ("#") tidak boleh melempar ke halaman lain
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });
  window.addEventListener('hashchange', route);
  route();

  /* --- Menu hamburger (HP & tablet) --- */
  const menuBtn = document.getElementById('menuToggleBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  function setMenu(open) {
    if (!menuBtn || !mobileMenu) return;
    mobileMenu.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  }
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', e => { e.stopPropagation(); setMenu(!mobileMenu.classList.contains('is-open')); });
    mobileMenu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('click', e => { if (!mobileMenu.contains(e.target)) setMenu(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', () => { if (window.innerWidth >= 1024) setMenu(false); });
    window.addEventListener('hashchange', () => setMenu(false));
  }

  const WA_NUMBER ='6281234567890'; // ganti dengan nomor WhatsApp toko
  function openWhatsApp(text) {
    const a = document.createElement('a');
    a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
    a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  }

  /* --- Keranjang & Drawer --- */
  const cartToggleBtn = document.getElementById('cartToggleBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const drawerItemCount = document.getElementById('drawerItemCount');
  const cartItemList = document.getElementById('cartItemList');
  const cartSubtotalText = document.getElementById('cartSubtotalText');
  const cartShippingText = document.getElementById('cartShippingText');
  const cartTotalText = document.getElementById('cartTotalText');
  const shippingProgressBar = document.getElementById('shippingProgressBar');
  const shippingProgressPercent = document.getElementById('shippingProgressPercent');
  const shippingProgressText = document.getElementById('shippingProgressText');

  function openCart() {
    cartDrawer.classList.remove('translate-x-full');
    cartBackdrop.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closeCart() {
    cartDrawer.classList.add('translate-x-full');
    cartBackdrop.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  function triggerCartBump() {
    if (cartCountBadge) {
      cartCountBadge.classList.remove('cart-bump');
      void cartCountBadge.offsetWidth;
      cartCountBadge.classList.add('cart-bump');
    }
  }

  // Interactive Confetti / Sparkle Particle Effect
  function createSparkles(x, y) {
    const emojis = ['✨', '🌸', '🧁', '⭐', '💖'];
    for (let i = 0; i < 7; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'sparkle-burst text-lg';
      sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      document.body.appendChild(sparkle);

      const angle = Math.random() * Math.PI * 2;
      const velocity = 40 + Math.random() * 50;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 20;

      sparkle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
      ], {
        duration: 750 + Math.random() * 250,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      }).onfinish = () => sparkle.remove();
    }
  }

  function recalculateCart() {
    let totalItems = 0;
    let subtotal = 0;
    const items = cartItemList.querySelectorAll('[data-price]');

    items.forEach(item => {
      const price = parseInt(item.getAttribute('data-price')) || 0;
      const qtyEl = item.querySelector('.item-qty');
      const qty = parseInt(qtyEl.textContent) || 0;
      const priceLabel = item.querySelector('.item-price-label');

      if (qty <= 0) {
        item.remove();
      } else {
        totalItems += qty;
        const itemTotal = price * qty;
        subtotal += itemTotal;
        if (priceLabel) {
          priceLabel.textContent = `Rp ${itemTotal.toLocaleString('id-ID')}`;
        }
      }
    });

    if (cartCountBadge) cartCountBadge.textContent = totalItems;
    var em=document.getElementById('cartEmptyMsg'); if(em) em.style.display = totalItems? 'none':'block';
    if (drawerItemCount) drawerItemCount.textContent = totalItems;
    if (cartSubtotalText) cartSubtotalText.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;

    // Free shipping threshold: Rp 75.000
    const threshold = 75000;
    const shipping = subtotal >= threshold ? 0 : 8000;

    if (cartShippingText) {
      if (shipping === 0) {
        cartShippingText.textContent = 'GRATIS';
        cartShippingText.className = 'font-semibold text-emerald-600';
      } else {
        cartShippingText.textContent = `Rp ${shipping.toLocaleString('id-ID')}`;
        cartShippingText.className = 'font-semibold text-sc-deep-green';
      }
    }

    const total = subtotal + (subtotal > 0 ? shipping : 0);
    if (cartTotalText) cartTotalText.textContent = `Rp ${total.toLocaleString('id-ID')}`;

    // Update Progress Bar
    const progress = Math.min(100, Math.round((subtotal / threshold) * 100));
    if (shippingProgressBar) shippingProgressBar.style.width = `${progress}%`;
    if (shippingProgressPercent) shippingProgressPercent.textContent = `${progress}%`;
    if (shippingProgressText) {
      if (subtotal >= threshold) {
        if (!window.__scFree) { window.__scFree = 1; try { window.dispatchEvent(new CustomEvent('sc-free')); } catch (e) {} }
        shippingProgressText.innerHTML = '🎉 Kamu dapat <strong>GRATIS ONGKIR</strong> Madiun!';
      } else {
        const remaining = threshold - subtotal;
        shippingProgressText.innerHTML = `Tambah <strong>Rp ${remaining.toLocaleString('id-ID')}</strong> lagi untuk Bebas Ongkir!`;
      }
    }
  }

  window.updateItemQty = function(btn, delta) {
    const parentRow = btn.closest('[data-price]');
    const qtySpan = parentRow.querySelector('.item-qty');
    let currentQty = parseInt(qtySpan.textContent) || 0;
    currentQty += delta;
    if (currentQty <= 0) {
      parentRow.remove();
      try { window.dispatchEvent(new CustomEvent('sc-cart-remove')); } catch (e) {}
    } else {
      qtySpan.textContent = currentQty;
    }
    recalculateCart();
    triggerCartBump();
  };

  const escHtml = v => String(v).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  window.addToCart = function(event, productName, price, imageUrl, descText, note) {
    const key = note ? productName + '|' + note : productName;
    /* Efek keranjang berbasis jenis produk ditangani oleh fx.js saat produk tiba. */

    // Check if item already exists in drawer
    let existingItem = null;
    const items = cartItemList.querySelectorAll('[data-name]');
    items.forEach(el => {
      if ((el.getAttribute('data-key') || el.getAttribute('data-name')) === key) existingItem = el;
    });

    if (existingItem) {
      const qtySpan = existingItem.querySelector('.item-qty');
      qtySpan.textContent = parseInt(qtySpan.textContent) + 1;
    } else {
      const itemEl = document.createElement('div');
      itemEl.className = 'flex gap-4 p-3 bg-sc-cream/40 rounded-2xl border border-sc-beige/70 transition-all hover:bg-sc-cream/70';
      itemEl.setAttribute('data-name', productName);
      itemEl.setAttribute('data-key', key);
      if (note) itemEl.setAttribute('data-note', note);
      itemEl.setAttribute('data-price', price);
      itemEl.innerHTML = `
        <img alt="${escHtml(productName)}" class="w-16 h-16 rounded-xl object-cover" src="${escHtml(imageUrl)}"/>
        <div class="flex-1">
          <h4 class="font-bold text-xs text-sc-deep-green">${escHtml(productName)}</h4>
          <p class="text-[11px] text-sc-deep-green/60">${escHtml(descText || 'Fresh Artisan Bake')}</p>
          <div class="flex items-center justify-between mt-2">
            <span class="font-heading text-xs font-bold text-sc-deep-green item-price-label">Rp ${price.toLocaleString('id-ID')}</span>
            <div class="flex items-center gap-2 bg-white px-2 py-0.5 rounded-lg border border-sc-beige text-xs shadow-2xs">
              <button class="text-sc-deep-green hover:text-sc-pink px-1 font-bold" onclick="updateItemQty(this, -1)">-</button>
              <span class="font-bold text-xs item-qty">1</span>
              <button class="text-sc-deep-green hover:text-sc-pink px-1 font-bold" onclick="updateItemQty(this, 1)">+</button>
            </div>
          </div>
        </div>
      `;
      cartItemList.appendChild(itemEl);
    }

    recalculateCart();
    try { window.dispatchEvent(new CustomEvent('sc-cart', { detail: { name: productName, total: document.querySelectorAll('#cartItemList [data-price]').length } })); } catch (e) {}
    triggerCartBump();
  };

  window.checkoutWhatsApp = function() {
    const items = cartItemList.querySelectorAll('[data-price]');
    if (items.length === 0) {
      showToast('Keranjang belanja kamu masih kosong!');
      return;
    }
    let message = 'Halo Bakehouse Sweet Crumbs Madiun! Saya ingin memesan:\n\n';
    items.forEach((item, i) => {
      const name = item.getAttribute('data-name');
      const qty = item.querySelector('.item-qty').textContent;
      const price = item.querySelector('.item-price-label').textContent;
      message += `${i + 1}. ${name} (${qty}x) - ${price}\n`;
      const note = item.getAttribute('data-note');
      if (note) message += `   ${note}\n`;
    });
    message += `\nSubtotal: ${cartSubtotalText.textContent}`;
    message += `\nOngkir: ${cartShippingText.textContent}`;
    message += `\nTotal Bayar: ${cartTotalText.textContent}`;
    message += '\n\nMohon info ketersediaan dan jadwal pengantaran di Madiun. Terima kasih!';
    openWhatsApp(message);
  };



  /* --- Katalog: pencarian, kategori, urutan, quick view --- */
  const searchInput = document.getElementById('catalogSearchInput');
  const sortSelect = document.getElementById('catalogSort');
  const grid = document.getElementById('productGridContainer');
  const productCards = grid ? Array.from(grid.children) : [];
  const categoryBtns = document.querySelectorAll('[data-category-btn]');
  let activeCategory = 'all';

  const ACTIVE_CLS = ['bg-sc-deep-green', 'text-white', 'shadow-sm'];
  const IDLE_CLS = ['bg-sc-cream', 'text-sc-deep-green', 'hover:bg-sc-soft-pink', 'border', 'border-sc-beige'];

  // Simpan urutan awal, harga, dan rating tiap kartu
  productCards.forEach((card, i) => {
    card.dataset.order = i;
    const priceText = (card.querySelector('.font-heading') || {}).textContent || '';
    card.dataset.price = parseInt(priceText.replace(/\D/g, '')) || 0;
  });

  // Pesan jika hasil kosong
  const emptyMsg = document.createElement('div');
  emptyMsg.className = 'hidden col-span-full text-center py-16 text-sc-deep-green/70';
  emptyMsg.innerHTML = '<div class="text-5xl mb-3">🍩</div><p class="font-bold">Belum ada menu yang cocok</p><p class="text-sm">Coba kata kunci atau kategori lain ya.</p>';
  if (grid) grid.appendChild(emptyMsg);

  function applyCatalog() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let visible = 0;

    productCards.forEach(card => {
      const title = (card.querySelector('h3') || {}).textContent || '';
      const desc = (card.querySelector('p') || {}).textContent || '';
      const matchText = (title + ' ' + desc).toLowerCase().includes(query);
      const cats = (card.dataset.category || '').split(' ');
      const matchCat = activeCategory === 'all' || cats.includes(activeCategory);
      const m0 = sortSelect ? sortSelect.selectedIndex : 0;
      const matchBadge = m0 === 1 ? card.dataset.badge === 'terlaris' : m0 === 2 ? card.dataset.badge === 'baru' : true;
      const show = matchText && matchCat && matchBadge;
      card.style.display = show ? 'flex' : 'none';
      if (show) visible++;
    });

    // Urutkan
    const mode = sortSelect ? sortSelect.selectedIndex : 0;
    const bdg = (c, k) => (c.dataset.badge === k ? 0 : 1), ttl = c => c.querySelector('h3').textContent.trim();
    const sorted = productCards.slice().sort((a, b) => {
      if (mode === 1) return (bdg(a, 'terlaris') - bdg(b, 'terlaris')) || (a.dataset.order - b.dataset.order);
      if (mode === 2) return (bdg(a, 'baru') - bdg(b, 'baru')) || (a.dataset.order - b.dataset.order);
      if (mode === 3) return a.dataset.price - b.dataset.price;
      if (mode === 4) return b.dataset.price - a.dataset.price;
      if (mode === 5) return ttl(a).localeCompare(ttl(b), 'id');
      return a.dataset.order - b.dataset.order;
    });
    sorted.forEach(card => grid.insertBefore(card, emptyMsg));

    emptyMsg.classList.toggle('hidden', visible > 0);
  }

  function setActiveCategory(cat) {
    activeCategory = cat;
    categoryBtns.forEach(btn => {
      const on = btn.dataset.categoryBtn === cat;
      btn.classList.remove(...ACTIVE_CLS, ...IDLE_CLS);
      btn.classList.add(...(on ? ACTIVE_CLS : IDLE_CLS));
    });
    applyCatalog();
  }

  categoryBtns.forEach(btn => btn.addEventListener('click', () => setActiveCategory(btn.dataset.categoryBtn)));
  if (searchInput) searchInput.addEventListener('input', applyCatalog);
  if (sortSelect) sortSelect.addEventListener('change', applyCatalog);

  window.resetSearch = function () {
    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.selectedIndex = 0;
    setActiveCategory('all');
  };

  /* --- Helper DOM --- */
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  const cardName = card => card.querySelector('h3').textContent.trim();
  const formatRp = n => 'Rp ' + Number(n).toLocaleString('id-ID');

  /* --- Rating & Ulasan (disimpan di browser pelanggan) --- */
  const REVIEW_KEY = 'sc_reviews_v1';
  let reviewStore = {};
  try { reviewStore = JSON.parse(localStorage.getItem(REVIEW_KEY) || '{}') || {}; } catch (e) { reviewStore = {}; }
  function saveReviews() { try { localStorage.setItem(REVIEW_KEY, JSON.stringify(reviewStore)); } catch (e) { /* penyimpanan tidak tersedia */ } }
  function okRv(rv) { return !rv.s || rv.s === 'a'; }
  function ratingStats(name) {
    const list = (reviewStore[name] || []).filter(okRv);
    const n = list.length;
    return { n, avg: n ? list.reduce((a, x) => a + x.r, 0) / n : 0 };
  }
  function addReview(name, r, n, c, an) {
    (reviewStore[name] = reviewStore[name] || []).unshift({ n, r, c, an: !!an, s: 'p', id: 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), d: new Date().toISOString() });
    saveReviews();
    refreshRatings();
    renderReviewsPage();
  }
  const starText = avg => '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));

  productCards.forEach(card => {
    const row = card.querySelector('.text-amber-400');
    if (row) row.setAttribute('data-rating-row', '');
    card.dataset.rating = 0;
  });

  window.SCReviews = {
    list() { const a = []; Object.entries(reviewStore).forEach(([p, l]) => l.forEach(rv => { if (!rv.id) rv.id = 'r' + Math.random().toString(36).slice(2, 8); a.push({ p, rv }); })); a.sort((x, y) => y.rv.d.localeCompare(x.rv.d)); return a; },
    set(p, id, s) { const l = reviewStore[p] || [], i = l.findIndex(r => r.id === id); if (i < 0) return; if (s === 'del') l.splice(i, 1); else l[i].s = s; saveReviews(); refreshRatings(); renderReviewsPage(); }
  };
  function refreshRatings() {
    document.querySelectorAll('[data-rating-row]').forEach(row => {
      const card = row.closest('.menu-card');
      if (!card) return;
      const st = ratingStats(cardName(card));
      row.textContent = '';
      row.style.display = st.n ? '' : 'none';
      if (!st.n) { if (productCards.includes(card)) card.dataset.rating = 0; return; }
      row.appendChild(el('span', st.n ? 'text-amber-400 tracking-tight' : 'text-sc-beige tracking-tight', starText(st.avg)));
      row.appendChild(el('span', 'text-sc-deep-green/60 text-[11px] font-medium ml-1', st.n ? st.avg.toFixed(1) + ' (' + st.n + ' ulasan)' : 'Baru'));
      if (productCards.includes(card)) card.dataset.rating = st.avg;
    });
  }

  /* --- Detail Produk (ikon mata): rating & ulasan --- */
  const qv = el('div', 'hidden fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm');
  qv.setAttribute('role', 'dialog');
  qv.setAttribute('aria-modal', 'true');
  const qvBox = el('div', 'bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl relative');
  qv.appendChild(qvBox);
  document.body.appendChild(qv);
  let qvCard = null;
  let qvRating = 0;
  const closeQV = () => qv.classList.add('hidden');
  qv.addEventListener('click', e => { if (e.target === qv) closeQV(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeQV(); });

  function renderReviewList(box, name) {
    box.textContent = '';
    const list = (reviewStore[name] || []).filter(okRv);
    if (!list.length) {
      box.appendChild(el('p', 'text-sm text-sc-deep-green/60', 'Belum ada ulasan untuk menu ini. Jadilah yang pertama!'));
      return;
    }
    list.slice(0, 20).forEach(rv => {
      const item = el('div', 'py-3 border-b border-sc-beige/60 last:border-0');
      const top = el('div', 'flex items-center justify-between gap-3');
      top.appendChild(el('span', 'font-semibold text-sm text-sc-deep-green', rv.an ? 'Pelanggan Sweet Crumbs' : rv.n));
      top.appendChild(el('span', 'text-amber-400 text-sm', starText(rv.r)));
      item.appendChild(top);
      item.appendChild(el('p', 'text-sm text-sc-deep-green/80 mt-1 break-words', rv.c));
      item.appendChild(el('p', 'text-[11px] text-sc-deep-green/50 mt-1', new Date(rv.d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })));
      box.appendChild(item);
    });
  }

  function openQuickView(card) {
    qvCard = card;
    qvRating = 0;
    const name = cardName(card);
    const st = ratingStats(name);
    qvBox.textContent = '';

    const close = el('button', 'absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 text-sc-deep-green shadow flex items-center justify-center', '✕');
    close.type = 'button'; close.setAttribute('aria-label', 'Tutup');
    close.addEventListener('click', closeQV);
    const img = el('img', 'w-full h-60 object-cover');
    img.src = card.querySelector('img').getAttribute('src'); img.alt = name;

    const body = el('div', 'p-6 sm:p-7');
    body.appendChild(el('h3', 'font-bold text-xl text-sc-deep-green', name));
    const sum = el('div', 'flex items-center gap-2 mt-1');
    sum.appendChild(el('span', st.n ? 'text-amber-400' : 'text-sc-beige', starText(st.avg)));
    sum.appendChild(el('span', 'text-xs text-sc-deep-green/60', st.n ? st.avg.toFixed(1) + ' dari ' + st.n + ' ulasan' : 'Belum ada ulasan'));
    body.appendChild(sum);
    body.appendChild(el('p', 'text-sm text-sc-deep-green/75 mt-3', card.querySelector('p').textContent.trim()));

    const buy = el('div', 'flex items-center justify-between mt-5');
    buy.appendChild(el('span', 'font-heading text-2xl font-bold text-sc-deep-green', formatRp(card.dataset.price)));
    const add = el('button', 'px-5 py-2.5 bg-sc-deep-green text-white font-semibold rounded-xl text-sm hover:bg-sc-forest active:scale-95 transition-all', '+ Keranjang');
    add.type = 'button';
    add.addEventListener('click', () => {
      const trigger = qvCard.querySelector('.add-to-cart-trigger');
      closeQV();
      if (trigger) trigger.click();
    });
    buy.appendChild(add);
    body.appendChild(buy);

    body.appendChild(el('h4', 'font-bold text-sc-deep-green mt-7 mb-1', 'Rating & Ulasan'));
    const listBox = el('div', 'max-h-56 overflow-y-auto pr-1');
    renderReviewList(listBox, name);
    body.appendChild(listBox);

    // Form ulasan
    const form = el('form', 'mt-5 p-4 rounded-2xl bg-sc-cream/50 border border-sc-beige space-y-3');
    form.appendChild(el('p', 'text-sm font-bold text-sc-deep-green', 'Tulis ulasanmu'));
    const stars = el('div', 'flex gap-1');
    const starBtns = [1, 2, 3, 4, 5].map(n => {
      const b = el('button', 'text-3xl leading-none text-sc-beige hover:text-amber-400 transition-colors', '★');
      b.type = 'button'; b.setAttribute('aria-label', n + ' bintang');
      b.addEventListener('click', () => { qvRating = n; starBtns.forEach((x, i) => { x.classList.toggle('text-amber-400', i < n); x.classList.toggle('text-sc-beige', i >= n); }); });
      stars.appendChild(b);
      return b;
    });
    form.appendChild(stars);
    const nameIn = el('input', 'w-full text-sm rounded-xl border-sc-beige focus:border-sc-pink focus:ring-sc-pink bg-white py-2.5');
    nameIn.type = 'text'; nameIn.maxLength = 30; nameIn.placeholder = 'Nama kamu'; nameIn.setAttribute('aria-label', 'Nama');
    const cmt = el('textarea', 'w-full text-sm rounded-xl border-sc-beige focus:border-sc-pink focus:ring-sc-pink bg-white');
    cmt.rows = 3; cmt.maxLength = 300; cmt.placeholder = 'Ceritakan rasa dan pengalamanmu...'; cmt.setAttribute('aria-label', 'Ulasan');
    const send = el('button', 'w-full py-3 bg-sc-pink text-sc-deep-green font-bold rounded-xl text-sm hover:brightness-105 active:scale-95 transition-all', 'Kirim Ulasan');
    send.type = 'submit';
    const anonL = el('label', 'flex items-center gap-2 text-xs text-sc-deep-green/80'); const anonC = document.createElement('input'); anonC.type = 'checkbox'; anonC.className = 'rounded border-sc-beige text-sc-pink focus:ring-sc-pink'; anonL.append(anonC, document.createTextNode('Tampilkan sebagai anonim (nama tidak ditampilkan)'));
    form.append(nameIn, anonL, cmt, send);
    form.addEventListener('submit', e => {
      e.preventDefault();
      const n = nameIn.value.trim(), c = cmt.value.trim();
      if (!qvRating) return showToast('Pilih jumlah bintang dulu ya.');
      if (!n) return showToast('Isi namamu dulu ya.');
      if (c.length < 3) return showToast('Tulis ulasan singkat minimal 3 huruf.');
      addReview(name, qvRating, n, c, anonC.checked);
      openQuickView(card);
      showToast('Terima kasih sudah memberikan ulasan! Masukanmu sangat berarti dan selalu kami baca dengan baik. 💗'); window.dispatchEvent(new CustomEvent('sc-review'));
    });
    body.appendChild(form);

    qvBox.append(close, img, body);
    qv.classList.remove('hidden');
    qvBox.scrollTop = 0;
  }
  productCards.forEach(card => {
    const eye = card.querySelector('[data-quickview]');
    if (eye) eye.addEventListener('click', () => openQuickView(card));
  });

  refreshRatings();

  /* --- Halaman Rating & Ulasan --- */
  const rvList = document.getElementById('rvList');
  const rvFilter = document.getElementById('rvFilter');
  const rvProduct = document.getElementById('rvProduct');
  let rvRating = 0;

  function renderReviewsPage() {
    if (!rvList) return;
    const all = [];
    Object.entries(reviewStore).forEach(([product, list]) => list.filter(okRv).forEach(rv => all.push({ product, ...rv, n: rv.an ? 'Pelanggan Sweet Crumbs' : rv.n })));
    all.sort((a, b) => b.d.localeCompare(a.d));

    // Ringkasan
    const sum = document.getElementById('rvSummary');
    sum.textContent = '';
    const total = all.length;
    const avg = total ? all.reduce((a, x) => a + x.r, 0) / total : 0;
    const row = el('div', 'flex flex-col sm:flex-row gap-6 sm:items-center');
    const big = el('div', 'text-center sm:pr-6 sm:border-r border-sc-beige/70 shrink-0');
    big.appendChild(el('p', 'font-heading text-5xl font-bold text-sc-deep-green', total ? avg.toFixed(1) : '–'));
    big.appendChild(el('p', total ? 'text-amber-400 text-lg' : 'text-sc-beige text-lg', starText(avg)));
    big.appendChild(el('p', 'text-xs text-sc-deep-green/60 mt-1', total ? total + ' ulasan' : 'Belum ada ulasan'));
    const bars = el('div', 'flex-1 min-w-0 space-y-1.5');
    for (let star = 5; star >= 1; star--) {
      const n = all.filter(x => x.r === star).length;
      const line = el('div', 'flex items-center gap-2 text-xs text-sc-deep-green/70');
      line.appendChild(el('span', 'w-4 text-right', String(star)));
      const track = el('div', 'flex-1 h-2 rounded-full bg-sc-cream overflow-hidden');
      const fill = el('div', 'h-full rounded-full bg-amber-400');
      fill.style.width = (total ? (n / total) * 100 : 0) + '%';
      track.appendChild(fill);
      line.append(track, el('span', 'w-6 text-right tabular-nums', String(n)));
      bars.appendChild(line);
    }
    row.append(big, bars);
    sum.appendChild(row);

    // Daftar
    const only = rvFilter.value;
    const shown = all.filter(x => !only || x.product === only).slice(0, 50);
    rvList.textContent = '';
    if (!shown.length) {
      rvList.appendChild(el('div', 'bg-white rounded-3xl border border-dashed border-sc-beige p-8 text-center text-sm text-sc-deep-green/60', total ? 'Belum ada ulasan untuk menu ini.' : 'Belum ada ulasan. Jadilah yang pertama menulis ulasan!'));
      return;
    }
    shown.forEach(rv => {
      const card = el('article', 'bg-white rounded-2xl border border-sc-beige p-5');
      const top = el('div', 'flex items-start justify-between gap-3');
      const who = el('div', 'min-w-0');
      who.appendChild(el('p', 'font-semibold text-sm text-sc-deep-green', rv.n));
      who.appendChild(el('p', 'text-xs text-sc-pink font-semibold break-words', rv.product));
      top.append(who, el('span', 'text-amber-400 shrink-0', starText(rv.r)));
      card.appendChild(top);
      card.appendChild(el('p', 'text-sm text-sc-deep-green/80 mt-2 break-words', rv.c));
      card.appendChild(el('p', 'text-[11px] text-sc-deep-green/50 mt-2', new Date(rv.d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })));
      rvList.appendChild(card);
    });
  }

  if (rvList) {
    const CAT = { donuts: 'Donuts', cakes: 'Cakes & Cheesecakes', breads: 'Roti & Croissants', cookies: 'Cookies & Brownies', desserts: 'Puddings & Mille Crepes' };
    rvFilter.appendChild(new Option('Semua menu', ''));
    Object.keys(CAT).forEach(cat => {
      const g1 = document.createElement('optgroup'); g1.label = CAT[cat];
      const g2 = document.createElement('optgroup'); g2.label = CAT[cat];
      productCards.filter(c => c.dataset.category.split(' ')[0] === cat).forEach(c => {
        g1.appendChild(new Option(cardName(c), cardName(c)));
        g2.appendChild(new Option(cardName(c), cardName(c)));
      });
      rvFilter.appendChild(g1); rvProduct.appendChild(g2);
    });
    rvFilter.addEventListener('change', renderReviewsPage);

    const rvStars = document.getElementById('rvStars');
    const rvBtns = [1, 2, 3, 4, 5].map(n => {
      const b = el('button', 'text-3xl leading-none text-sc-beige hover:text-amber-400 transition-colors', '★');
      b.type = 'button'; b.setAttribute('aria-label', n + ' bintang');
      b.addEventListener('click', () => { rvRating = n; rvBtns.forEach((x, i) => { x.classList.toggle('text-amber-400', i < n); x.classList.toggle('text-sc-beige', i >= n); }); });
      rvStars.appendChild(b);
      return b;
    });
    document.getElementById('rvForm').addEventListener('submit', e => {
      e.preventDefault();
      const n = document.getElementById('rvName').value.trim();
      const c = document.getElementById('rvText').value.trim();
      if (!rvRating) return showToast('Pilih jumlah bintang dulu ya.');
      if (!n) return showToast('Isi namamu dulu ya.');
      if (c.length < 3) return showToast('Tulis ulasan singkat minimal 3 huruf.');
      addReview(rvProduct.value, rvRating, n, c, (document.getElementById('rvAnon') || {}).checked); if (document.getElementById('rvAnon')) document.getElementById('rvAnon').checked = false;
      document.getElementById('rvName').value = '';
      document.getElementById('rvText').value = '';
      rvRating = 0; rvBtns.forEach(x => { x.classList.remove('text-amber-400'); x.classList.add('text-sc-beige'); });
      showToast('Terima kasih sudah memberikan ulasan! Masukanmu sangat berarti dan selalu kami baca dengan baik. 💗'); window.dispatchEvent(new CustomEvent('sc-review'));
    });
    renderReviewsPage();
  }


  /* --- Racik Hadiahmu (hampers buatan sendiri) --- */
  // Atur ukuran kotak, harga, dan acara di sini. Isi hampers diambil otomatis dari katalog.
  const GIFT_BOXES = [
    { id: 's', label: 'Kecil', slots: 4, price: 25000 },
    { id: 'm', label: 'Sedang', slots: 6, price: 35000 },
    { id: 'l', label: 'Besar', slots: 9, price: 50000 }
  ];
  const GIFT_RIBBONS = [
    { id: 'pink', label: 'Pink Blush', hex: '#F5A9C5' },
    { id: 'mint', label: 'Mint', hex: '#8FD3B6' },
    { id: 'gold', label: 'Emas', hex: '#D4AF37' },
    { id: 'maroon', label: 'Marun', hex: '#8E1B34' },
    { id: 'sky', label: 'Biru Langit', hex: '#8FB8ED' },
    { id: 'cream', label: 'Krem', hex: '#E3D2B3' }
  ];
  const GIFT_EVENTS = [
    { id: 'ultah', label: 'Ulang Tahun', msg: 'Selamat ulang tahun! Semoga harimu semanis isi kotak ini.' },
    { id: 'hariraya', label: 'Hari Raya', msg: 'Selamat Hari Raya. Mohon maaf lahir dan batin.' },
    { id: 'natal', label: 'Natal & Tahun Baru', msg: 'Selamat Natal dan Tahun Baru. Semoga damai dan bahagia menyertaimu.' },
    { id: 'nikah', label: 'Pernikahan', msg: 'Selamat menempuh hidup baru. Semoga bahagia selalu.' },
    { id: 'wisuda', label: 'Wisuda', msg: 'Selamat atas kelulusanmu! Bangga sekali padamu.' },
    { id: 'terimakasih', label: 'Terima Kasih', msg: 'Terima kasih atas kebaikan dan bantuanmu.' },
    { id: 'kantor', label: 'Kantor / Relasi', msg: 'Terima kasih atas kerja sama yang baik. Salam hangat.' },
    { id: 'sembuh', label: 'Semoga Lekas Sembuh', msg: 'Lekas sembuh ya. Semoga harimu segera kembali ceria.' }
  ];
  const GIFT_CATS = [['all', 'Semua'], ['donuts', 'Donuts'], ['cakes', 'Cakes'], ['breads', 'Roti & Croissants'], ['cookies', 'Cookies & Brownies']];

  const hgItemsBox = document.getElementById('hgItems');
  if (hgItemsBox) {
    const items = productCards
      .filter(c => ['donuts', 'cakes', 'breads', 'cookies'].includes(c.dataset.category.split(' ')[0]) && cardName(c) !== 'The Box of Six Artisan Donuts')
      .map(c => ({ name: cardName(c), cat: c.dataset.category.split(' ')[0], price: Number(c.dataset.price), img: c.querySelector('img').getAttribute('src') }));
    const state = { box: GIFT_BOXES[1], ribbon: GIFT_RIBBONS[0], event: GIFT_EVENTS[0], qty: new Map(), cat: 'all', lastTemplate: GIFT_EVENTS[0].msg };
    const used = () => Array.from(state.qty.values()).reduce((a, b) => a + b, 0);
    const itemsTotal = () => Array.from(state.qty.entries()).reduce((a, [n, q]) => a + q * items.find(i => i.name === n).price, 0);
    const cleanMsg = v => v.replace(/[^\p{L}\p{N} .,!?&'():;\-\n]/gu, '');
    const cleanName = v => v.replace(/[^\p{L}\p{N} .,&'-]/gu, '');
    const $ = id => document.getElementById(id);
    const SEL = ['border-sc-deep-green', 'ring-2', 'ring-sc-pink/40', 'bg-sc-soft-pink/30'];
    const mark = (btn, on) => { SEL.forEach(c => btn.classList.toggle(c, on)); btn.setAttribute('aria-pressed', on ? 'true' : 'false'); };

    // 1. Ukuran kotak
    const boxBtns = GIFT_BOXES.map(box => {
      const b = el('button', 'text-left rounded-2xl border border-sc-beige bg-white p-4 hover:border-sc-pink transition-all');
      b.type = 'button';
      b.appendChild(el('p', 'font-bold text-sm text-sc-deep-green', 'Kotak ' + box.label));
      b.appendChild(el('p', 'text-xs text-sc-deep-green/60', box.slots + ' isi'));
      b.appendChild(el('p', 'font-heading font-bold text-sc-deep-green mt-1', formatRp(box.price)));
      b.appendChild(el('p', 'text-[10px] text-sc-deep-green/50', 'sudah termasuk pita'));
      b.addEventListener('click', () => {
        state.box = box;
        // buang isi berlebih jika kotak lebih kecil
        let over = used() - box.slots;
        if (over > 0) {
          const names = Array.from(state.qty.keys()).reverse();
          for (const n of names) { while (over > 0 && state.qty.get(n) > 0) { state.qty.set(n, state.qty.get(n) - 1); over--; } if (!state.qty.get(n)) state.qty.delete(n); if (over <= 0) break; }
          showToast('Isi dikurangi menyesuaikan ukuran kotak.');
        }
        update();
      });
      $('hgSizes').appendChild(b);
      return b;
    });

    // 2. Isi hampers
    const catBtns = GIFT_CATS.map(([id, label]) => {
      const b = el('button', 'px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border border-sc-beige transition-colors', label);
      b.type = 'button';
      b.addEventListener('click', () => { state.cat = id; update(); });
      $('hgCats').appendChild(b);
      return [id, b];
    });
    const itemEls = items.map(it => {
      const card = el('div', 'rounded-2xl border border-sc-beige bg-white overflow-hidden flex flex-col');
      const im = el('img', 'w-full h-20 object-cover'); im.src = it.img; im.alt = it.name; im.loading = 'lazy';
      const body = el('div', 'p-2.5 flex-1 flex flex-col justify-between gap-2');
      const top = el('div');
      top.appendChild(el('p', 'text-[11px] font-bold text-sc-deep-green leading-snug', it.name));
      top.appendChild(el('p', 'text-[10px] text-sc-deep-green/60 mt-0.5', formatRp(it.price)));
      const ctl = el('div', 'flex items-center justify-between bg-sc-cream/60 rounded-lg px-1.5 py-0.5');
      const minus = el('button', 'w-7 h-7 font-bold text-sc-deep-green hover:text-sc-pink disabled:opacity-30', '−'); minus.type = 'button'; minus.setAttribute('aria-label', 'Kurangi ' + it.name);
      const qty = el('span', 'text-xs font-bold tabular-nums text-sc-deep-green', '0');
      const plus = el('button', 'w-7 h-7 font-bold text-sc-deep-green hover:text-sc-pink disabled:opacity-30', '+'); plus.type = 'button'; plus.setAttribute('aria-label', 'Tambah ' + it.name);
      minus.addEventListener('click', () => { const q = (state.qty.get(it.name) || 0) - 1; if (q > 0) state.qty.set(it.name, q); else state.qty.delete(it.name); update(); });
      plus.addEventListener('click', () => { if (used() >= state.box.slots) return; state.qty.set(it.name, (state.qty.get(it.name) || 0) + 1); update(); });
      ctl.append(minus, qty, plus);
      body.append(top, ctl);
      card.append(im, body);
      hgItemsBox.appendChild(card);
      return { it, card, minus, plus, qty };
    });


    // 4. Acara
    const eventBtns = GIFT_EVENTS.map(ev => {
      const b = el('button', 'px-4 py-2 rounded-full text-xs font-semibold border border-sc-beige transition-colors', ev.label);
      b.type = 'button';
      b.addEventListener('click', () => {
        state.event = ev;
        // isi pesan contoh jika masih kosong atau belum diubah pelanggan
        if (!$('hgMsg').value.trim() || $('hgMsg').value === state.lastTemplate) { $('hgMsg').value = ev.msg; }
        state.lastTemplate = ev.msg;
        update();
      });
      $('hgEvents').appendChild(b);
      return b;
    });

    // 5. Kartu
    $('hgMsg').value = GIFT_EVENTS[0].msg;
    $('hgCardOn').addEventListener('change', update);
    ['hgTo', 'hgFrom'].forEach(id => $(id).addEventListener('input', () => { const c = cleanName($(id).value); if (c !== $(id).value) $(id).value = c; update(); }));
    $('hgMsg').addEventListener('input', () => { const c = cleanMsg($('hgMsg').value); if (c !== $('hgMsg').value) $('hgMsg').value = c; update(); });

    function renderPreview() {
      const box = $('hgPreview');
      box.textContent = '';
      box.style.borderColor = state.ribbon.hex;
      const cols = state.box.slots === 4 ? 2 : 3;
      const grid = el('div', 'grid gap-2');
      grid.style.gridTemplateColumns = 'repeat(' + cols + ', minmax(0, 1fr))';
      const slots = [];
      state.qty.forEach((q, n) => { for (let i = 0; i < q; i++) slots.push(items.find(x => x.name === n)); });
      for (let i = 0; i < state.box.slots; i++) {
        const it = slots[i];
        const cell = el('div', 'aspect-square rounded-xl overflow-hidden flex items-center justify-center ' + (it ? 'bg-white shadow-sm' : 'border-2 border-dashed border-sc-beige text-sc-beige text-xl'));
        if (it) { const im = el('img', 'w-full h-full object-cover'); im.src = it.img; im.alt = it.name; cell.appendChild(im); } else cell.textContent = '+';
        grid.appendChild(cell);
      }
      const bow = el('div', 'absolute left-1/2 -translate-x-1/2 -top-[26px] w-10 h-10 rounded-full flex items-center justify-center shadow');
      bow.style.background = state.ribbon.hex;
      bow.appendChild(el('span', 'w-3 h-3 rounded-full bg-white/70'));
      box.append(grid, bow);
    }

    function update() {
      boxBtns.forEach((b, i) => mark(b, GIFT_BOXES[i] === state.box));
      catBtns.forEach(([id, b]) => {
        const on = id === state.cat;
        b.classList.toggle('bg-sc-deep-green', on); b.classList.toggle('text-white', on);
        b.classList.toggle('bg-sc-cream', !on); b.classList.toggle('text-sc-deep-green', !on);
      });
      const full = used() >= state.box.slots;
      itemEls.forEach(({ it, card, minus, plus, qty }) => {
        card.style.display = (state.cat === 'all' || it.cat === state.cat) ? '' : 'none';
        const q = state.qty.get(it.name) || 0;
        qty.textContent = q; minus.disabled = q === 0; plus.disabled = full;
        card.classList.toggle('border-sc-deep-green', q > 0);
      });
      const cnt = $('hgCount'); cnt.textContent = used() + ' / ' + state.box.slots + ' terisi';
      cnt.classList.toggle('bg-emerald-100', full); cnt.classList.toggle('bg-sc-cream', !full);
      eventBtns.forEach((b, i) => {
        const on = GIFT_EVENTS[i] === state.event;
        b.classList.toggle('bg-sc-deep-green', on); b.classList.toggle('text-white', on);
        b.classList.toggle('bg-sc-cream', !on); b.classList.toggle('text-sc-deep-green', !on);
      });
      const cardOn = $('hgCardOn').checked;
      $('hgCardBox').hidden = !cardOn;
      $('hgMsgCount').textContent = $('hgMsg').value.length;

      renderPreview();

      const to = $('hgTo').value.trim(), from = $('hgFrom').value.trim(), msg = $('hgMsg').value.trim();
      $('hgSumBox').textContent = 'Kotak ' + state.box.label + ' (' + state.box.slots + ' isi)';
      $('hgSumEvent').textContent = state.event.label;
      $('hgSumCard').textContent = !cardOn ? 'Tanpa kartu' : (msg ? '“' + (msg.length > 40 ? msg.slice(0, 40) + '…' : msg) + '”' : 'Kartu kosong');
      const ul = $('hgSumItems'); ul.textContent = '';
      if (!state.qty.size) ul.appendChild(el('li', 'text-sc-deep-green/50', 'Belum ada isi. Pilih menu di langkah 2.'));
      state.qty.forEach((q, n) => {
        const li = el('li', 'flex justify-between gap-3');
        li.appendChild(el('span', 'text-sc-deep-green min-w-0 break-words', q + '× ' + n));
        li.appendChild(el('span', 'text-sc-deep-green/70 whitespace-nowrap', formatRp(q * items.find(i => i.name === n).price)));
        ul.appendChild(li);
      });
      const total = state.box.price + itemsTotal();
      $('hgPriceBox').textContent = formatRp(state.box.price);
      $('hgPriceItems').textContent = formatRp(itemsTotal());
      $('hgTotal').textContent = formatRp(total);
      $('hgBarSlots').textContent = used() + ' dari ' + state.box.slots + ' isi terpilih';
    }

    function hgShow(step) {
      $('hgStepBuild').hidden = step !== 'build';
      $('hgStepSummary').hidden = step !== 'summary';
      const top = document.querySelector('[data-purpose="gift-builder"]');
      if (top) top.scrollIntoView({ block: 'start' });
    }
    $('hgNext').addEventListener('click', () => {
      if (!used()) { showToast('Pilih minimal satu isi hampers dulu ya.'); return; }
      hgShow('summary');
    });
    $('hgBack').addEventListener('click', () => hgShow('build'));

    $('hgAdd').addEventListener('click', () => {
      if (!used()) { showToast('Pilih minimal satu isi hampers dulu ya.'); return; }
      const cardOn = $('hgCardOn').checked;
      const to = $('hgTo').value.trim(), from = $('hgFrom').value.trim(), msg = $('hgMsg').value.trim().replace(/\s*\n\s*/g, ' ');
      let text = 'Halo Bakehouse Sweet Crumbs Madiun! Saya ingin memesan hampers racikan:\n\n';
      text += `Kotak: ${state.box.label} (${state.box.slots} isi) - ${formatRp(state.box.price)}\n`;
      text += (used() < state.box.slots ? `Isi (${used()} dari ${state.box.slots} slot terisi):\n` : 'Isi:\n');
      state.qty.forEach((q, n) => { text += `- ${q}x ${n} - ${formatRp(q * items.find(i => i.name === n).price)}\n`; });
      text += `\nAcara: ${state.event.label}\n`;
      text += cardOn ? `Kartu ucapan: untuk ${to || '-'}, dari ${from || '-'}${msg ? ', "' + msg + '"' : ''}\n` : 'Kartu ucapan: tanpa kartu\n';
      text += `\nTotal: ${formatRp(state.box.price + itemsTotal())}`;
      text += '\n\nMohon info ketersediaan dan jadwal pengambilan atau pengantaran. Terima kasih!';
      openWhatsApp(text);
    });
    update();
  }

  /* --- Link footer: kategori katalog, lacak pesanan, kebijakan privasi --- */
  function openPrivacy() {
    let m = document.getElementById('scPrivacy');
    if (!m) {
      m = document.createElement('div');
      m.id = 'scPrivacy'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', 'Kebijakan Privasi');
      m.className = 'fixed inset-0 z-[10002] bg-black/50 items-end sm:items-center justify-center';
      m.innerHTML =
        '<div class="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-6 text-sc-deep-green">' +
        '<div class="flex items-start justify-between gap-3 mb-1"><h2 class="font-heading text-xl font-bold">Kebijakan Privasi</h2>' +
        '<button type="button" data-close class="text-sc-deep-green/60 px-2 text-lg" aria-label="Tutup">&#10005;</button></div>' +
        '<p class="text-[11px] text-sc-deep-green/50 mb-4">Terakhir diperbarui: 19 November 2026</p>' +
        '<p class="text-sm mb-4">Sweet Crumbs Bakehouse Madiun menghargai data pribadimu. Halaman ini menjelaskan data apa yang kami minta dan untuk apa.</p>' +
        '<div class="text-sm space-y-4">' +
        '<section><h3 class="font-bold mb-1">1. Data yang kami kumpulkan</h3><p class="text-sc-deep-green/80">Nama penerima, nomor HP, alamat pengiriman, jadwal, dan catatan pesanan. Kalau kamu membuat akun, kami juga menyimpan nama dan email. Kalau kamu menulis ulasan, kami menyimpan isi ulasan itu.</p></section>' +
        '<section><h3 class="font-bold mb-1">2. Untuk apa data dipakai</h3><p class="text-sc-deep-green/80">Untuk memproses dan mengantar pesananmu, menghubungimu bila ada hal soal pesanan, serta menampilkan status dan riwayat pesanan.</p></section>' +
        '<section><h3 class="font-bold mb-1">3. Dengan siapa data dibagikan</h3><p class="text-sc-deep-green/80">Data tidak kami jual. Data hanya dipakai tim Sweet Crumbs. Kalau pesananmu diantar, nama, nomor HP, dan alamat diberikan ke kurir supaya pesanan sampai.</p></section>' +
        '<section><h3 class="font-bold mb-1">4. Penyimpanan</h3><p class="text-sc-deep-green/80">Data pesanan disimpan di perangkat yang kamu pakai untuk memesan, sehingga riwayat pesanan terlihat di perangkat itu. Kami hanya menyimpan data sebatas yang dibutuhkan untuk pesananmu.</p></section>' +
        '<section><h3 class="font-bold mb-1">5. Hakmu</h3><p class="text-sc-deep-green/80">Kamu bisa meminta data pribadimu dilihat, diperbaiki, atau dihapus dengan menghubungi kami lewat WhatsApp.</p></section>' +
        '<section><h3 class="font-bold mb-1">6. Hubungi kami</h3><p class="text-sc-deep-green/80">WhatsApp: +62 812-3456-7890<br>Pangongangan, Jl. Kolonel Marhadi No.12, Nambangan Lor, Kec. Manguharjo, Kota Madiun, Jawa Timur 63121<br>Buka setiap hari, 08:00 - 21:00 WIB</p></section>' +
        '</div></div>';
      document.body.appendChild(m);
      m.addEventListener('click', ev => { if (ev.target === m || ev.target.closest('[data-close]')) closePrivacy(); });
    }
    m.style.display = 'flex'; document.body.style.overflow = 'hidden';
  }
  function closePrivacy() {
    const m = document.getElementById('scPrivacy');
    if (m) m.style.display = 'none';
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePrivacy(); });
  document.addEventListener('click', e => {
    const cat = e.target.closest('[data-foot-cat]');
    if (cat) {
      e.preventDefault();
      const go = () => {
        const b = document.querySelector('[data-category-btn="' + cat.dataset.footCat + '"]'); if (b) b.click();
        const g = document.getElementById('menu-katalog'); if (g) g.scrollIntoView();
      };
      if (location.hash !== '#menu') { location.hash = '#menu'; setTimeout(go, 120); } else go();
      return;
    }
    if (e.target.closest('[data-track]')) { e.preventDefault(); if (window.SCCO) window.SCCO.orders(); return; }
    if (e.target.closest('[data-privacy]')) { e.preventDefault(); openPrivacy(); }
  });


});
