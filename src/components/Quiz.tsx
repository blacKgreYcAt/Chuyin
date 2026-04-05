import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Gender } from '../types';
import { bopomofoData } from '../data/bopomofo';
import { Home } from 'lucide-react';

interface Props {
  gender: Gender;
  currentLessonIndex: number;
  isEyeCareMode: boolean;
  onCorrect: () => void;
  onMistake: () => void;
  onBackToHome: () => void;
}

export default function Quiz({ gender, currentLessonIndex, isEyeCareMode, onCorrect, onMistake, onBackToHome }: Props) {
  const isGirl = gender === 'girl';
  const targetItem = bopomofoData[currentLessonIndex];
  
  const [options, setOptions] = useState<string[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);

  useEffect(() => {
    // Generate 3 random options + 1 correct option
    const allSymbols = bopomofoData.map(item => item.symbol);
    const otherSymbols = allSymbols.filter(s => s !== targetItem.symbol);
    
    // Shuffle and pick 3
    const shuffledOthers = [...otherSymbols].sort(() => 0.5 - Math.random());
    const selectedOthers = shuffledOthers.slice(0, 3);
    
    // Combine and shuffle all 4 options
    const allOptions = [...selectedOthers, targetItem.symbol].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  }, [targetItem]);

  const handleSelect = (symbol: string) => {
    if (symbol === targetItem.symbol) {
      onCorrect();
    } else {
      if (!wrongAnswers.includes(symbol)) {
        setWrongAnswers(prev => [...prev, symbol]);
        onMistake();
      }
    }
  };

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

  const optionClasses = isEyeCareMode
    ? 'bg-[#1E1E1E] hover:bg-[#2C2C2C] border-[#444444]'
    : isGirl
      ? 'bg-[#1a1a1a] hover:bg-[#3b2e5a] border-[#d8a7d4]'
      : 'bg-blue-700 hover:bg-cyan-600 border-cyan-400';

  const wrongClasses = isEyeCareMode
    ? 'bg-[#3A1C1C] border-[#5C2C2C] opacity-50 cursor-not-allowed'
    : 'bg-red-900/50 border-red-500/50 opacity-50 cursor-not-allowed';

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
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl text-center"
      >
        <div className={`inline-block px-6 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-3xl border-4 mb-8 md:mb-12 backdrop-blur-md ${cardClasses}`}>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">哪一個是...</h2>
          <div className="flex items-center justify-center gap-2 md:gap-4 text-3xl md:text-5xl font-black">
            <span>{targetItem.emoji}</span>
            <span>{targetItem.word}</span>
            <span>的</span>
            <span className="text-5xl md:text-6xl text-yellow-300 drop-shadow-lg">{targetItem.symbol}</span>
            <span>？</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {options.map((symbol, index) => {
            const isWrong = wrongAnswers.includes(symbol);
            return (
              <motion.button
                key={index}
                whileHover={isWrong ? {} : { scale: 1.05 }}
                whileTap={isWrong ? {} : { scale: 0.95 }}
                onClick={() => handleSelect(symbol)}
                disabled={isWrong}
                className={`aspect-square rounded-2xl md:rounded-3xl border-4 text-6xl md:text-8xl font-black flex items-center justify-center shadow-xl transition-colors ${
                  isWrong ? wrongClasses : optionClasses
                }`}
                animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                {symbol}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
