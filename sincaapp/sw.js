self.addEventListener('push', function(event){
  let data = { title: 'Sincap', body: '', icon: 'icon-180.png', tag: 'sincap' };
  try{ data = event.data.json(); }catch(e){}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || 'icon-180.png',
      badge: 'icon-180.png',
      tag: data.tag || 'sincap'
    })
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
