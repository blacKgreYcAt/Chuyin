import { motion } from 'motion/react';
import { Gender } from '../types';
import { User, Sparkles } from 'lucide-react';

interface Props {
  onSelect: (gender: Gender) => void;
}

export default function GenderSelection({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100 flex flex-col items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-4 drop-shadow-sm">
          歡迎來到注音小學堂！
        </h1>
        <p className="text-xl text-orange-500 font-medium">請選擇你的角色</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-2xl justify-center">
        {/* Boy Option */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect('boy')}
          className="flex-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-8 shadow-xl border-4 border-blue-200 flex flex-col items-center justify-center gap-4 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-2 shadow-inner">
            <span className="text-6xl">👦</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-wider">小男生</h2>
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
          className="flex-1 bg-gradient-to-br from-[#3b2e5a] to-[#d8a7d4] rounded-3xl p-8 shadow-xl border-4 border-[#1a1a1a] flex flex-col items-center justify-center gap-4 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="w-32 h-32 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-2 shadow-inner relative border-4 border-[#d8a7d4]">
            <span className="text-6xl z-10">👧</span>
            {/* Kuromi-ish ears hint */}
            <div className="absolute -top-6 -left-2 w-12 h-16 bg-[#1a1a1a] rounded-t-full transform -rotate-12 border-t-4 border-l-4 border-[#d8a7d4]" />
            <div className="absolute -top-6 -right-2 w-12 h-16 bg-[#1a1a1a] rounded-t-full transform rotate-12 border-t-4 border-r-4 border-[#d8a7d4]" />
            <div className="absolute top-0 text-2xl z-20">🎀</div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-wider drop-shadow-md">小女生</h2>
          <div className="flex gap-2 text-[#d8a7d4]">
            <Sparkles size={24} />
            <Sparkles size={24} />
          </div>
        </motion.button>
      </div>
    </div>
  );
}
