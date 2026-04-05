import { GoogleGenAI, Modality } from '@google/genai';
import { getCustomApiKey } from './voiceCache';

let ai: GoogleGenAI | null = null;
let audioCtx: AudioContext | null = null;

export async function playGeminiTTS(text: string): Promise<void> {
  if (!ai) {
    const apiKey = getCustomApiKey() || process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      console.warn("No Gemini API key found");
      return;
    }
    ai = new GoogleGenAI({ apiKey });
  }

  try {
    const response = await ai.models.generateContent({
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
    if (!base64Audio) return;

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
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    throw error;
  }
}
