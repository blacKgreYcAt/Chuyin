const https = require('https');
const fs = require('fs');

const downloadAudio = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      const data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(data);
        resolve(buffer.toString('base64'));
      });
    }).on('error', reject);
  });
};

async function main() {
  const audioData = {};
  for (let i = 1; i <= 37; i++) {
    const numStr = i.toString().padStart(2, '0');
    const url = `https://www.mdnkids.com/bopomo/audio/${numStr}.mp3`;
    console.log(`Downloading ${url}...`);
    try {
      const base64 = await downloadAudio(url);
      audioData[i] = `data:audio/mp3;base64,${base64}`;
    } catch (e) {
      console.error(e);
    }
  }
  
  const content = `export const mdnAudioData: Record<number, string> = ${JSON.stringify(audioData, null, 2)};\n`;
  fs.writeFileSync('src/data/mdnAudio.ts', content);
  console.log('Done!');
}

main();
