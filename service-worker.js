const CACHE_NAME = 'agenda-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Instala o Service Worker e faz cache dos recursos
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Cache aberto');
      return cache.addAll(urlsToCache);
    })
  );
  // Força o Service Worker a ativar imediatamente
  self.skipWaiting();
});

// Ativa o Service Worker e limpa caches antigos
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Toma controle imediato de todas as páginas
  return self.clients.claim();
});

// Intercepta requisições e serve do cache quando possível
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retorna do cache se encontrado, senão busca da rede
      if (response) {
        console.log('[Service Worker] Servindo do cache:', event.request.url);
        return response;
      }

      return fetch(event.request).then((response) => {
        // Não faz cache de requisições inválidas
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clona a resposta pois só pode ser consumida uma vez
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Escuta mensagens para forçar atualização
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
