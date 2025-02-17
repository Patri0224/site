const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/punteggio1/',
    '/punteggio1/css/punteggiPerPersona.css',
    '/punteggio1/punteggio.html',
    '/punteggio1/script.js',
    '/punteggio1/service-worker.js', // Aggiungi tutti i file necessari
    '/punteggio1/css/style.css', // Aggiungi tutti i file necessari
];

// Installa il Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching delle risorse.');
                return cache.addAll(urlsToCache);
            })
    );
});

// Intercetta le richieste di rete
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Restituisci la risposta dalla cache, se disponibile
                return response || fetch(event.request);
            })
    );
});

// Aggiorna la cache
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Rimuovo vecchia cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
