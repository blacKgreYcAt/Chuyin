import { wordAudioData } from '../data/wordAudio';

export function playWordAudio(bopomofoIndex: number): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const base64Audio = wordAudioData[bopomofoIndex];
      
      if (!base64Audio) {
        throw new Error(`Audio not found for index ${bopomofoIndex}`);
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
