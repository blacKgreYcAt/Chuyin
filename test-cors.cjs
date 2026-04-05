const https = require('https');

https.get('https://www.mdnkids.com/bopomo/audio/01.mp3', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
}).on('error', (err) => {
  console.error(err);
});
