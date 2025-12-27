const CACHE_NAME = 'opalp-online-v1';

// 1. INSTALL: Paksa aktif segera
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

// 2. ACTIVATE: Hapus cache lama jika ada (Pembersihan)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        return caches.delete(key);
      }));
    }).then(() => self.clients.claim())
  );
});

// 3. FETCH: NETWORK ONLY (Wajib Online)
// Tidak ada perintah 'caches.match'. Semua request langsung ke Internet.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request, {
      cache: 'no-store' // Instruksi agar browser tidak menyimpan cache
    }).catch(() => {
      // Tampilan jika Offline / Internet Mati
      return new Response(`
        <html>
          <body style="background:#000; color:white; font-family:sans-serif; text-align:center; display:flex; flex-direction:column; justify-content:center; height:100vh;">
            <h1 style="color:#d97706">KONEKSI TERPUTUS</h1>
            <p>Aplikasi ini memerlukan koneksi internet untuk memuat panduan terbaru.</p>
            <button onclick="location.reload()" style="padding:10px 20px; margin-top:20px; background:#fff; border:none; border-radius:5px;">Coba Lagi</button>
          </body>
        </html>`, 
        {
          headers: { "Content-Type": "text/html" }
        }
      );
    })
  );
});
