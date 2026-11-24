// ═════════════════════════════════════════════════════════════════
// 1CONVITE — SERVICE WORKER AUTO-UPDATE (NETWORK-FIRST FOR APP SHELL)
// Garante atualizações automáticas e imediatas na web e no celular (PWA)
// ═════════════════════════════════════════════════════════════════

const CACHE_VERSION = '1convite-v2.5.1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Estratégia Network-First para navegação HTML e checagem de versão
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Requisições para index.html, rotas de navegação ou version.json SEMPRE buscam da rede
  if (event.request.mode === 'navigate' || url.pathname.endsWith('version.json') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Assets com hash do Vite (ex: /assets/index-xxx.js) usam Cache-First
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Padrão geral: tenta rede, se falhar tenta cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
