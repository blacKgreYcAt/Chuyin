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
  isEyeCareMode: boolean;
  onNext: () => void;
  onBackToHome: () => void;
}

export default function Learning({ gender, currentLessonIndex, isEyeCareMode, onNext, onBackToHome }: Props) {
  const isGirl = gender === 'girl';
  const item = bopomofoData[currentLessonIndex];
  const [isSpeakingSymbol, setIsSpeakingSymbol] = useState(false);
  const [isSpeakingWord, setIsSpeakingWord] = useState(false);
  
  const themeClasses = isEyeCareMode
    ? 'bg-[#121212] text-[#E0E0E0]'
    : isGirl 
      ? 'bg-gradient-to-b from-[#1a1a1a] via-[#3b2e5a] to-[#d8a7d4] text-white'
      : 'bg-gradient-to-b from-blue-900 via-blue-800 to-cyan-900 text-blue-100';

  const cardClasses = isEyeCareMode
    ? 'bg-[#1E1E1E] border-[#333333]'
    : isGirl
      ? 'bg-[#3b2e5a]/80 border-[#d8a7d4]/50'
      : 'bg-blue-800/80 border-cyan-500/50';

  const buttonClasses = isEyeCareMode
    ? 'bg-[#2C2C2C] hover:bg-[#3C3C3C] border border-[#444444] text-[#E0E0E0] shadow-none'
    : isGirl
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
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative ${themeClasses}`}>
      
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
        <button
          onClick={onBackToHome}
          className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full transition-colors font-bold text-sm md:text-base ${
            isEyeCareMode ? 'bg-[#2C2C2C] text-[#E0E0E0] hover:bg-[#3C3C3C]' : 'bg-black/30 text-white/80 hover:bg-black/40'
          }`}
        >
          <Home size={18} className="md:w-5 md:h-5" />
          <span className="hidden sm:inline">回首頁</span>
        </button>
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-full max-w-lg rounded-3xl border-4 p-6 md:p-8 text-center shadow-2xl backdrop-blur-md flex flex-col items-center ${cardClasses}`}
      >
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 opacity-90">跟我一起唸</h2>
        
        <div className="relative mb-8 md:mb-12">
          <motion.div 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-[8rem] md:text-[12rem] leading-none font-black drop-shadow-2xl"
          >
            {item.symbol}
          </motion.div>
          <button 
            onClick={playSymbolSound}
            disabled={isSpeakingSymbol || isSpeakingWord}
            className={`absolute -right-2 -bottom-2 md:-right-4 md:-bottom-4 p-3 md:p-4 rounded-full ${buttonClasses} ${(isSpeakingSymbol || isSpeakingWord) ? 'opacity-70 cursor-not-allowed' : ''}`}
            title="聽注音發音"
          >
            {isSpeakingSymbol ? <Loader2 size={24} className="animate-spin md:w-8 md:h-8" /> : <Volume2 size={24} className="md:w-8 md:h-8" />}
          </button>
        </div>

        <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12 bg-black/20 px-6 md:px-8 py-3 md:py-4 rounded-2xl relative w-full">
          <span className="text-5xl md:text-6xl">{item.emoji}</span>
          <div className="text-left flex-1">
            <div className="text-3xl md:text-4xl font-bold tracking-widest">{item.word}</div>
          </div>
          <button 
            onClick={playWordSound}
            disabled={isSpeakingSymbol || isSpeakingWord}
            className={`p-2 md:p-3 rounded-full ${buttonClasses} ${(isSpeakingSymbol || isSpeakingWord) ? 'opacity-70 cursor-not-allowed' : ''}`}
            title="聽例詞發音"
          >
            {isSpeakingWord ? <Loader2 size={20} className="animate-spin md:w-6 md:h-6" /> : <Volume2 size={20} className="md:w-6 md:h-6" />}
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className={`w-full py-3 md:py-4 rounded-2xl text-xl md:text-2xl font-bold flex items-center justify-center gap-3 shadow-lg ${buttonClasses}`}
        >
          去測驗
          <ArrowRight size={24} className="md:w-7 md:h-7" />
        </motion.button>
      </motion.div>
    </div>
  );
}
