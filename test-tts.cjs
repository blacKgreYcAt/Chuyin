const https = require('https');
const url = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=zh-TW&client=tw-ob&q=' + encodeURIComponent('包子');
https.get(url, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
});
