import { GoogleGenAI, Modality } from '@google/genai';
import { bopomofoData } from '../data/bopomofo';

let ai: GoogleGenAI | null = null;
let audioCtx: AudioContext | null = null;

// IndexedDB setup for larger storage (localStorage is limited to ~5MB)
const DB_NAME = 'BopomofoVoiceDB';
const STORE_NAME = 'voices';

// Fallback memory cache if IndexedDB is blocked (e.g., in incognito or strict iframe)
const memoryCache = new Map<string, string>();

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME);
      };
    } catch (e) {
      reject(e);
    }
  });
}

async function saveToCache(key: string, data: string): Promise<void> {
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(data, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn("IndexedDB save failed, falling back to memory cache", e);
    memoryCache.set(key, data);
  }
}

export async function getCachedAudio(key: string): Promise<string | null> {
  if (memoryCache.has(key)) {
    return memoryCache.get(key) || null;
  }
  try {
    const db = await getDB();
    return await new Promise<string | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn("IndexedDB read failed", e);
    return null;
  }
}

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

  await saveToCache(cacheKey, base64Audio);
  
  return base64Audio;
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

export async function downloadAllVoices(
  onProgress: (current: number, total: number) => void,
  onRetry?: () => void
): Promise<void> {
  const total = bopomofoData.length;
  let current = await getDownloadedVoiceCount();
  onProgress(current, total);

  for (const item of bopomofoData) {
    const cacheKey = item.symbol;
    const cached = await getCachedAudio(cacheKey);
    
    if (!cached) {
      let retries = 3;
      while (retries > 0) {
        try {
          const text = `${item.ttsHint}，${item.word}`;
          await fetchAndCacheAudio(text, cacheKey);
          current++;
          onProgress(current, total);
          // Wait 5 seconds between requests to respect the 15 RPM free tier limit
          await new Promise(resolve => setTimeout(resolve, 5000));
          break;
        } catch (error: any) {
          console.error(`Failed to fetch audio for ${item.symbol}:`, error);
          retries--;
          if (retries === 0) throw error;
          
          if (onRetry) onRetry();
          // If rate limited or error, wait 30 seconds before retrying
          await new Promise(resolve => setTimeout(resolve, 30000));
        }
      }
    }
  }
}

export async function getDownloadedVoiceCount(): Promise<number> {
  let count = 0;
  for (const item of bopomofoData) {
    const cached = await getCachedAudio(item.symbol);
    if (cached) count++;
  }
  return count;
}


