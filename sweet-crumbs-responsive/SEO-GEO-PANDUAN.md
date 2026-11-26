# Implementasi SEO & GEO — Sweet Crumbs Bakehouse

## Yang sudah diterapkan
- Judul halaman dan meta description berbahasa Indonesia dengan kata kunci yang relevan.
- Meta robots, theme color, Open Graph dasar, dan Twitter Card.
- Structured data JSON-LD untuk Organization, WebSite, dan FAQPage berdasarkan informasi yang sudah tampil pada halaman.
- `robots.txt` dasar yang mengizinkan crawler mengakses halaman.

## Catatan penting untuk versi simulasi
Website ini belum memiliki domain publik dan merupakan proyek simulasi. Karena itu, canonical URL, `og:url`, `og:image` absolut, dan sitemap XML final belum dibuat. Structured data sengaja tidak memakai tipe `Bakery`/`LocalBusiness` atau mengklaim alamat dan nomor telepon sebagai data bisnis terverifikasi. Informasi alamat dan hotline yang sudah tampil di halaman tetap dibiarkan sesuai pilihan pemilik proyek, tetapi perlu diverifikasi sebelum website dipublikasikan sebagai bisnis nyata.

## Setelah domain tersedia
1. Ganti semua URL contoh/relatif yang memerlukan URL absolut dengan domain HTTPS final.
2. Tambahkan `<link rel="canonical" href="https://DOMAIN-ANDA/">` pada `<head>`.
3. Isi `og:url` dan `og:image` dengan URL absolut yang benar (gambar harus dapat diakses publik).
4. Buat `sitemap.xml` berisi URL final halaman yang memang bisa diakses, lalu tambahkan `Sitemap: https://DOMAIN-ANDA/sitemap.xml` di `robots.txt`.
5. Daftarkan domain di Google Search Console, verifikasi kepemilikan, kirim sitemap, lalu periksa URL utama.
6. Uji JSON-LD dengan Schema Markup Validator dan hasil pencarian dengan Google Rich Results Test. FAQ rich result tidak dijamin tampil; markup membantu mesin memahami konten.
7. Pastikan alamat, nomor WhatsApp, jam operasional, klaim bahan, harga, dan area pengiriman benar sebelum publikasi.

## Arah konten GEO
Pertahankan FAQ yang menjawab pertanyaan pelanggan secara langsung. Buat deskripsi tiap kategori/produk yang spesifik (nama, komposisi yang benar, ukuran, pilihan, cara simpan, dan ketersediaan). Hindari keyword berulang, klaim "terbaik/nomor satu" tanpa bukti, dan data bisnis yang belum diverifikasi. GEO bukan jaminan website akan disebut oleh AI; tujuannya membuat informasi mudah ditemukan, dipahami, dan dipercaya.
