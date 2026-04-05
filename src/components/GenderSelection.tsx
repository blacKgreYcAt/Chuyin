import { motion } from 'motion/react';
import { Gender } from '../types';
import { User, Sparkles, Moon, Sun } from 'lucide-react';

interface Props {
  onSelect: (gender: Gender) => void;
  isEyeCareMode: boolean;
  onToggleEyeCare: () => void;
}

export default function GenderSelection({ onSelect, isEyeCareMode, onToggleEyeCare }: Props) {
  const themeClasses = isEyeCareMode
    ? 'bg-[#121212] text-[#E0E0E0]'
    : 'bg-gradient-to-b from-yellow-50 to-orange-100';

  const titleClasses = isEyeCareMode ? 'text-[#E0B080]' : 'text-orange-600';
  const subtitleClasses = isEyeCareMode ? 'text-[#C09060]' : 'text-orange-500';

  const boyCardClasses = isEyeCareMode
    ? 'bg-[#1E1E1E] border-[#333333] hover:border-[#555555]'
    : 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-200';
  const boyIconBg = isEyeCareMode ? 'bg-[#2C2C2C]' : 'bg-blue-100';

  const girlCardClasses = isEyeCareMode
    ? 'bg-[#1E1E1E] border-[#333333] hover:border-[#555555]'
    : 'bg-gradient-to-br from-[#3b2e5a] to-[#d8a7d4] border-[#1a1a1a]';
  const girlIconBg = isEyeCareMode ? 'bg-[#2C2C2C] border-[#444444]' : 'bg-[#1a1a1a] border-[#d8a7d4]';
  const girlEarClasses = isEyeCareMode ? 'bg-[#2C2C2C] border-[#444444]' : 'bg-[#1a1a1a] border-[#d8a7d4]';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-sans relative ${themeClasses}`}>
      
      {/* Eye Care Toggle */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
        <button
          onClick={onToggleEyeCare}
          className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border backdrop-blur-sm transition-colors hover:bg-black/20 ${
            isEyeCareMode ? 'bg-[#1E1E1E] border-[#333333] text-[#E0E0E0]' : 'bg-white/50 border-orange-200 text-orange-800'
          }`}
          title="切換護眼模式"
        >
          {isEyeCareMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
          <span className="hidden sm:inline font-bold text-sm md:text-base">護眼模式</span>
        </button>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-8 md:mb-12"
      >
        <h1 className={`text-3xl md:text-5xl font-bold mb-3 md:mb-4 drop-shadow-sm ${titleClasses}`}>
          歡迎來到注音學習小幫手！
        </h1>
        <p className={`text-lg md:text-xl font-medium ${subtitleClasses}`}>請選擇你的角色</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-2xl justify-center">
        {/* Boy Option */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect('boy')}
          className={`flex-1 rounded-3xl p-6 md:p-8 shadow-xl border-4 flex flex-col items-center justify-center gap-4 group relative overflow-hidden ${boyCardClasses}`}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mb-2 shadow-inner ${boyIconBg}`}>
            <span className="text-5xl md:text-6xl">👦</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wider">小男生</h2>
          <div className="flex gap-2 text-blue-200">
            <Sparkles size={24} />
            <Sparkles size={24} />
          </div>
        </motion.button>

        {/* Girl Option (Kuromi inspired) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect('girl')}
          className={`flex-1 rounded-3xl p-6 md:p-8 shadow-xl border-4 flex flex-col items-center justify-center gap-4 group relative overflow-hidden ${girlCardClasses}`}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mb-2 shadow-inner relative border-4 ${girlIconBg}`}>
            <span className="text-5xl md:text-6xl z-10">👧</span>
            {/* Kuromi-ish ears hint */}
            <div className={`absolute -top-4 -left-1 md:-top-6 md:-left-2 w-10 h-12 md:w-12 md:h-16 rounded-t-full transform -rotate-12 border-t-4 border-l-4 ${girlEarClasses}`} />
            <div className={`absolute -top-4 -right-1 md:-top-6 md:-right-2 w-10 h-12 md:w-12 md:h-16 rounded-t-full transform rotate-12 border-t-4 border-r-4 ${girlEarClasses}`} />
            <div className="absolute top-0 text-xl md:text-2xl z-20">🎀</div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wider drop-shadow-md">小女生</h2>
          <div className="flex gap-2 text-[#d8a7d4]">
            <Sparkles size={24} />
            <Sparkles size={24} />
          </div>
        </motion.button>
      </div>
    </div>
  );
}
