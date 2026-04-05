import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Gender } from '../types';
import { bopomofoData } from '../data/bopomofo';
import { ArrowRight, Volume2, Loader2, Home } from 'lucide-react';
import { playMdnAudio } from '../services/mdnAudio';
import { playWordAudio } from '../services/wordAudio';

interface Props {
  gender: Gender;
  currentLessonIndex: number;
  onNext: () => void;
  onBackToHome: () => void;
}

export default function Learning({ gender, currentLessonIndex, onNext, onBackToHome }: Props) {
  const isGirl = gender === 'girl';
  const item = bopomofoData[currentLessonIndex];
  const [isSpeakingSymbol, setIsSpeakingSymbol] = useState(false);
  const [isSpeakingWord, setIsSpeakingWord] = useState(false);
  
  const themeClasses = isGirl 
    ? 'bg-gradient-to-b from-[#1a1a1a] via-[#3b2e5a] to-[#d8a7d4] text-white'
    : 'bg-gradient-to-b from-blue-900 via-blue-800 to-cyan-900 text-blue-100';

  const cardClasses = isGirl
    ? 'bg-[#3b2e5a]/80 border-[#d8a7d4]/50'
    : 'bg-blue-800/80 border-cyan-500/50';

  const buttonClasses = isGirl
    ? 'bg-gradient-to-r from-[#d8a7d4] to-[#ffb7e6] hover:from-[#c796c3] hover:to-[#e5a4cf] text-[#1a1a1a] shadow-[#d8a7d4]/50'
    : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-cyan-500/50';

  const playSymbolSound = async () => {
    if (isSpeakingSymbol || isSpeakingWord) return;
    setIsSpeakingSymbol(true);

    try {
      await playMdnAudio(currentLessonIndex);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSpeakingSymbol(false);
    }
  };

  const playWordSound = async () => {
    if (isSpeakingSymbol || isSpeakingWord) return;
    setIsSpeakingWord(true);

    try {
      await playWordAudio(currentLessonIndex);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSpeakingWord(false);
    }
  };

  // Auto-play symbol sound when entering the lesson
  useEffect(() => {
    playSymbolSound();
  }, [item]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 relative ${themeClasses}`}>
      
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 text-white/80 hover:bg-black/40 transition-colors font-bold"
        >
          <Home size={20} />
          回首頁
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
            onClick={playSymbolSound}
            disabled={isSpeakingSymbol || isSpeakingWord}
            className={`absolute -right-4 -bottom-4 p-4 rounded-full ${buttonClasses} ${(isSpeakingSymbol || isSpeakingWord) ? 'opacity-70 cursor-not-allowed' : ''}`}
            title="聽注音發音"
          >
            {isSpeakingSymbol ? <Loader2 size={32} className="animate-spin" /> : <Volume2 size={32} />}
          </button>
        </div>

        <div className="flex items-center gap-6 mb-12 bg-black/20 px-8 py-4 rounded-2xl relative w-full">
          <span className="text-6xl">{item.emoji}</span>
          <div className="text-left flex-1">
            <div className="text-4xl font-bold tracking-widest">{item.word}</div>
          </div>
          <button 
            onClick={playWordSound}
            disabled={isSpeakingSymbol || isSpeakingWord}
            className={`p-3 rounded-full ${buttonClasses} ${(isSpeakingSymbol || isSpeakingWord) ? 'opacity-70 cursor-not-allowed' : ''}`}
            title="聽例詞發音"
          >
            {isSpeakingWord ? <Loader2 size={24} className="animate-spin" /> : <Volume2 size={24} />}
          </button>
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
