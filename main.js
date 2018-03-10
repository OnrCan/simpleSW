(function () {
  if ('serviceWorker' in navigator) {
    console.log('CLIENT: service worker registration in progress.');
    navigator.serviceWorker.register('./sw.js')
      .then(function () {
        console.log('CLIENT: service worker registration complete.');
      }, function (err) {
        console.log('CLIENT: service worker registration failure.');
        console.log(err, ':D');
      });
  } else {
    console.log('CLIENT: service worker is not supported!');
  }
})()