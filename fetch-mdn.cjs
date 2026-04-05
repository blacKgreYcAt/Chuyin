const https = require('https');

https.get('https://www.mdnkids.com/bopomo/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const matches = data.match(/[^"']+\.mp3/g) || [];
    console.log("MP3s found:", [...new Set(matches)]);
    
    const swfMatches = data.match(/[^"']+\.swf/g) || [];
    console.log("SWFs found:", [...new Set(swfMatches)]);
  });
}).on('error', (err) => {
  console.error(err);
});
