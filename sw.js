const CACHE = 'ammar-tayyar-v4';
const ASSETS = ['index.html','manifest.json',
    'https://cdn.tailwindcss.com','https://unpkg.com/lucide@latest',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap',
    'https://img.icons8.com/fluency/192/delivery-airplane.png',
    'https://img.icons8.com/fluency/512/delivery-airplane.png'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(u => c.add(u).catch(()=>{})))));
    self.skipWaiting();
});
self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
    self.clients.claim();
});
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cached => {
            if (cached) return cached;
            return fetch(e.request).then(res => {
                if (!res || res.status!==200 || res.type==='opaque') return res;
                const clone = res.clone();
                caches.open(CACHE).then(c => c.put(e.request, clone));
                return res;
            }).catch(() => caches.match('index.html'));
        })
    );
});
