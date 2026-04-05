const https = require('https');
const fs = require('fs');

const words = ["包子", "蘋果", "貓咪", "飛機", "大象", "兔子", "鳥兒", "老虎", "狗狗", "恐龍", "猴子", "機器人", "企鵝", "西瓜", "蜘蛛", "吃飯", "獅子", "太陽", "字典", "草莓", "雨傘", "鴨子", "喔", "天鵝", "耶", "愛心", "黑熊", "貓頭鷹", "海鷗", "安全帽", "閃電", "骯髒", "蜜蜂", "耳朵", "衣服", "烏龜", "魚兒"];

const downloadAudio = (word) => {
  const url = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=zh-TW&client=tw-ob&q=' + encodeURIComponent(word);
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${word}' (${res.statusCode})`));
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
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    console.log(`Downloading ${word}...`);
    try {
      const base64 = await downloadAudio(word);
      audioData[i] = `data:audio/mp3;base64,${base64}`;
    } catch (e) {
      console.error(e);
    }
    // Sleep a bit to avoid rate limits
    await new Promise(r => setTimeout(r, 500));
  }
  
  const content = `export const wordAudioData: Record<number, string> = ${JSON.stringify(audioData, null, 2)};\n`;
  fs.writeFileSync('src/data/wordAudio.ts', content);
  console.log('Done!');
}

main();
