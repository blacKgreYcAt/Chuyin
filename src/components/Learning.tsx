import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Gender } from '../types';
import { bopomofoData } from '../data/bopomofo';
import { ArrowRight, Volume2, Loader2, Sparkles } from 'lucide-react';
import { playGeminiTTS } from '../services/tts';

interface Props {
  gender: Gender;
  currentLessonIndex: number;
  useAIVoice: boolean;
  onToggleVoice: () => void;
  onNext: () => void;
}

export default function Learning({ gender, currentLessonIndex, useAIVoice, onToggleVoice, onNext }: Props) {
  const isGirl = gender === 'girl';
  const item = bopomofoData[currentLessonIndex];
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const themeClasses = isGirl 
    ? 'bg-gradient-to-b from-[#1a1a1a] via-[#3b2e5a] to-[#d8a7d4] text-white'
    : 'bg-gradient-to-b from-blue-900 via-blue-800 to-cyan-900 text-blue-100';

  const cardClasses = isGirl
    ? 'bg-[#3b2e5a]/80 border-[#d8a7d4]/50'
    : 'bg-blue-800/80 border-cyan-500/50';

  const buttonClasses = isGirl
    ? 'bg-gradient-to-r from-[#d8a7d4] to-[#ffb7e6] hover:from-[#c796c3] hover:to-[#e5a4cf] text-[#1a1a1a] shadow-[#d8a7d4]/50'
    : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-cyan-500/50';

  const playSound = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);

    try {
      if (useAIVoice) {
        await playGeminiTTS(`${item.ttsHint}，${item.word}`);
        setIsSpeaking(false);
      } else {
        window.speechSynthesis.cancel();
        const text = `${item.ttsHint}，${item.word}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-TW';
        utterance.rate = 0.85;
        
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.error(e);
      setIsSpeaking(false);
    }
  };

  // Auto-play sound when entering the lesson or toggling voice
  useEffect(() => {
    playSound();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [item, useAIVoice]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 relative ${themeClasses}`}>
      
      {/* Voice Toggle Button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={onToggleVoice}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
            useAIVoice 
              ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-400/50' 
              : 'bg-black/30 text-white/80 hover:bg-black/40'
          }`}
        >
          <Sparkles size={16} />
          {useAIVoice ? 'AI 真人語音 (已開啟)' : 'AI 真人語音 (已關閉)'}
        </button>
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-full max-w-lg rounded-3xl border-4 p-8 text-center shadow-2xl backdrop-blur-md flex flex-col items-center ${cardClasses}`}
      >
        <h2 className="text-2xl font-bold mb-8 opacity-90">跟我一起唸</h2>
        
        <div className="relative mb-12">
          <motion.div 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-[12rem] leading-none font-black drop-shadow-2xl"
          >
            {item.symbol}
          </motion.div>
          <button 
            onClick={playSound}
            disabled={isSpeaking}
            className={`absolute -right-4 -bottom-4 p-4 rounded-full ${buttonClasses} ${isSpeaking ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSpeaking ? <Loader2 size={32} className="animate-spin" /> : <Volume2 size={32} />}
          </button>
        </div>

        <div className="flex items-center gap-6 mb-12 bg-black/20 px-8 py-4 rounded-2xl">
          <span className="text-6xl">{item.emoji}</span>
          <div className="text-left">
            <div className="text-4xl font-bold tracking-widest">{item.word}</div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className={`w-full py-4 rounded-2xl text-2xl font-bold flex items-center justify-center gap-3 shadow-lg ${buttonClasses}`}
        >
          去測驗
          <ArrowRight size={28} />
        </motion.button>
      </motion.div>
    </div>
  );
}
