import { GoogleGenAI, Modality } from '@google/genai';
import { bopomofoData } from '../data/bopomofo';

let ai: GoogleGenAI | null = null;
let audioCtx: AudioContext | null = null;

const CACHE_PREFIX = 'bopomofo_tts_';

export async function initAI() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("No Gemini API key found");
    }
    ai = new GoogleGenAI({ apiKey });
  }
}

export async function fetchAndCacheAudio(text: string, cacheKey: string): Promise<string> {
  await initAI();
  
  const response = await ai!.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `請用幼稚園老師親切、開心的語氣慢慢唸：${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio generated");

  try {
    localStorage.setItem(CACHE_PREFIX + cacheKey, base64Audio);
  } catch (e) {
    console.warn("Failed to save to localStorage, might be full", e);
  }
  
  return base64Audio;
}

export function getCachedAudio(cacheKey: string): string | null {
  return localStorage.getItem(CACHE_PREFIX + cacheKey);
}

export async function playBase64Audio(base64Audio: string): Promise<void> {
  const binaryString = atob(base64Audio);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }

  const int16Array = new Int16Array(bytes.buffer);
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32768.0;
  }

  const buffer = audioCtx.createBuffer(1, float32Array.length, 24000);
  buffer.getChannelData(0).set(float32Array);

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start();
  
  return new Promise((resolve) => {
    source.onended = () => resolve();
  });
}

export async function downloadAllVoices(onProgress: (current: number, total: number) => void): Promise<void> {
  const total = bopomofoData.length;
  let current = 0;

  for (const item of bopomofoData) {
    const cacheKey = item.symbol;
    if (!getCachedAudio(cacheKey)) {
      try {
        const text = `${item.ttsHint}，${item.word}`;
        await fetchAndCacheAudio(text, cacheKey);
        // Add a small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error(`Failed to fetch audio for ${item.symbol}:`, error);
        // Stop downloading if we hit an error (like rate limit)
        throw error;
      }
    }
    current++;
    onProgress(current, total);
  }
}

export function getDownloadedVoiceCount(): number {
  let count = 0;
  for (const item of bopomofoData) {
    if (getCachedAudio(item.symbol)) {
      count++;
    }
  }
  return count;
}

export function clearVoiceCache() {
  for (const item of bopomofoData) {
    localStorage.removeItem(CACHE_PREFIX + item.symbol);
  }
}
