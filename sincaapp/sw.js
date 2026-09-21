const CACHE_NAME = 'sincap-cache-v1';
const APP_SHELL = [
  './',
  'index.html',
  'icon-180.png',
  'icon-512.png',
  'favicon.png',
  'pet-stage0.png',
  'pet-stage1.png',
  'pet-stage2.png',
  'pet-stage3.png',
  'pet-stage4.png',
  'pet-stage5.png'
];

self.addEventListener('install', function(event){
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(()=>{})
  );
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(()=> self.clients.claim())
  );
});

self.addEventListener('fetch', function(event){
  if(event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(res => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone)).catch(()=>{});
        return res;
      })
      .catch(() =>
        caches.match(event.request).then(cached => cached || caches.match('index.html'))
      )
  );
});

self.addEventListener('push', function(event){
  let data = { title: 'Sincap', body: '', icon: 'icon-180.png', tag: 'sincap' };
  try{ data = event.data.json(); }catch(e){}
  event.waitUntil(
    (async () => {
      await self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon || 'icon-180.png',
        badge: 'icon-180.png',
        tag: data.tag || 'sincap'
      });
      try{
        if('setAppBadge' in self.navigator){
          await self.navigator.setAppBadge(1);
        }
      }catch(e){}
    })()
  );
});

self.addEventListener('notificationclick', function(event){
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList){
      for(const client of clientList){
        if('focus' in client) return client.focus();
      }
      if(clients.openWindow) return clients.openWindow('/');
    })
  );
});
