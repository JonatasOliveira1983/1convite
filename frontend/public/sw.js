// ═════════════════════════════════════════════════════════════════
// 1CONVITE — AUTO-CLEANUP SERVICE WORKER
// Desregistra workers antigos e limpa todo o cache local corrompido
// ═════════════════════════════════════════════════════════════════

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((k) => caches.delete(k)));
    }).then(() => {
      return self.registration.unregister();
    }).then(() => {
      return self.clients.matchAll();
    }).then((clients) => {
      clients.forEach((client) => {
        client.navigate(client.url);
      });
    })
  );
});
