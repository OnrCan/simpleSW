let swVersion = 'v1::';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(`${swVersion}fundamentals`)
      .then(function (cache) {
        cache.addAll([
          './main.js',
          './css/global.css'
        ])
      })
      .then(function () {
        console.log('WORKER: install event completed!')
        self.skipWaiting();
      })
  ) // event.waitUntil(
}); // self.addEventListener('install', function(event) {

self.addEventListener('fetch', function (event) {
  console.log(`WORKER: fetch event in progress`);
  if (event.request.method !== 'GET') {
    console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function (cachedInPast) {
        let networked =
          fetch(event.request.url).then(fetchedFromNetwork, unableToResolve);
        console.log('WORKER: fetch event', cachedInPast ? '(cachedInPast)' : '(network)', event.request.url);
        return cachedInPast || networked;

        function fetchedFromNetwork(response) {
          let cacheCopy = response.clone();
          console.log(`WORKER: fetch response from network`);

          caches
            .open(swVersion + 'pages')
            .then(function (cache) {
              cache.put(event.request, cacheCopy);
            }) // caches.open
            .then(function () {
              console.log(`WORKER: fetch response stored in cache ${event.request.url}`);
            })

          return response;
        } // function fetchedFromNetwork(response) {

        function unableToResolve() {
          console.log(`WORKER: fetch request failed in network ${event.request.url}`);
          return new Response(`<h1>Service Unavailable</h1>`, {
            status: 503,
            statusText: 'Service mkl;Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html'
            })
          });
        }
      }) // caches.match(event.request)
  ) // event.repondWith(
}) // self.addEventListener('fetch', function(event) {

self.addEventListener('activate', function (event) {
  console.log('WORKER: activate event in progress');

  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return !key.startsWith(swVersion);
        }) // keys.filter(function(key) {
        .map(function (key) {
          return caches.delete(key);
        }) // .map(function (key) {
      )
    }) // caches.keys().then(function (keys) {
    .then(() => {
      console.log('WORKER: activate completed!');
    })
  ) // event.waitUntil()
}) // self.addEventListener('activate', function(event) {