import { mdnAudioData } from '../data/mdnAudio';

export function getMdnAudioIndex(bopomofoIndex: number): number {
  if (bopomofoIndex >= 0 && bopomofoIndex <= 20) {
    // ㄅ to ㄙ
    return bopomofoIndex + 1;
  } else if (bopomofoIndex >= 21 && bopomofoIndex <= 33) {
    // ㄚ to ㄦ
    return bopomofoIndex + 4;
  } else if (bopomofoIndex >= 34 && bopomofoIndex <= 36) {
    // ㄧ to ㄩ
    return bopomofoIndex - 12;
  }
  return 1; // Fallback
}

export function playMdnAudio(bopomofoIndex: number): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const mdnIndex = getMdnAudioIndex(bopomofoIndex);
      const base64Audio = mdnAudioData[mdnIndex];
      
      if (!base64Audio) {
        throw new Error(`Audio not found for index ${mdnIndex}`);
      }
      
      const audio = new Audio(base64Audio);
      audio.onended = () => resolve();
      audio.onerror = (e) => reject(e);
      audio.play().catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}
