import { useState } from 'react';
import { motion } from 'motion/react';
import { Gender } from '../types';
import { bopomofoData } from '../data/bopomofo';
import { Medal, Star, CheckCircle2, RefreshCw, Moon, Sun } from 'lucide-react';

interface Props {
  gender: Gender;
  medals: number;
  completedLessons: number[];
  hasMistakes: boolean;
  isEyeCareMode: boolean;
  onSelectLesson: (index: number) => void;
  onReview: () => void;
  onToggleEyeCare: () => void;
}

export default function Dashboard({ gender, medals, completedLessons, hasMistakes, isEyeCareMode, onSelectLesson, onReview, onToggleEyeCare }: Props) {
  const isGirl = gender === 'girl';
  
  const themeClasses = isEyeCareMode
    ? 'bg-[#121212] text-[#E0E0E0]'
    : isGirl 
      ? 'bg-gradient-to-b from-[#1a1a1a] via-[#3b2e5a] to-[#d8a7d4] text-white'
      : 'bg-gradient-to-b from-blue-900 via-blue-800 to-cyan-900 text-blue-100';

  const cardClasses = isEyeCareMode
    ? 'bg-[#1E1E1E] border-[#333333] hover:border-[#555555]'
    : isGirl
      ? 'bg-[#3b2e5a]/80 border-[#d8a7d4]/50 hover:border-[#ffb7e6]'
      : 'bg-blue-800/50 border-cyan-500/30 hover:border-cyan-300';

  const completedClasses = isEyeCareMode
    ? 'bg-[#2A3B2C] text-[#A3D9A5] border-[#3E5941]'
    : isGirl
      ? 'bg-[#d8a7d4] text-[#1a1a1a] border-[#ffb7e6]'
      : 'bg-cyan-500 text-white border-cyan-300';

  return (
    <div className={`min-h-screen flex flex-col items-center p-4 md:p-6 pb-12 ${themeClasses}`}>
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-4xl flex flex-wrap justify-between items-center mb-6 md:mb-8 gap-4"
      >
        <div className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border ${cardClasses} backdrop-blur-sm`}>
          <span className="text-xl md:text-2xl">{isGirl ? '👧' : '👦'}</span>
          <span className="font-bold text-base md:text-lg">小玩家</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleEyeCare}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border ${cardClasses} backdrop-blur-sm transition-colors hover:bg-black/20`}
            title="切換護眼模式"
          >
            {isEyeCareMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-200" />}
            <span className="hidden sm:inline font-bold text-sm md:text-base">護眼模式</span>
          </button>

          <div className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border ${cardClasses} backdrop-blur-sm`}>
            <Medal className={isGirl ? "text-pink-400" : "text-yellow-400"} size={20} />
            <span className="font-bold text-lg md:text-xl">{medals}</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-4xl"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-center drop-shadow-md">請選擇要學習的注音符號</h2>
          
          {hasMistakes && (
            <button
              onClick={onReview}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-lg transition-transform hover:scale-105 text-sm md:text-base ${
                isEyeCareMode ? 'bg-[#3A2A1C] text-[#E0B080] border border-[#5C422C]' : isGirl ? 'bg-pink-500 text-white' : 'bg-yellow-500 text-yellow-900'
              }`}
            >
              <RefreshCw size={18} />
              複習易錯注音
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
          {bopomofoData.map((item, index) => {
            const isCompleted = completedLessons.includes(index);
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectLesson(index)}
                className={`relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center text-4xl md:text-5xl font-black shadow-lg transition-colors ${
                  isCompleted ? completedClasses : cardClasses
                }`}
              >
                {item.symbol}
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 shadow-md">
                    <CheckCircle2 size={16} className="text-white md:w-5 md:h-5" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="fixed top-20 left-10 opacity-20 pointer-events-none">
        <Star size={48} className={isGirl ? "text-pink-300" : "text-cyan-300"} />
      </div>
      <div className="fixed bottom-20 right-10 opacity-20 pointer-events-none">
        <Star size={64} className={isGirl ? "text-purple-300" : "text-blue-300"} />
      </div>
    </div>
  );
}
