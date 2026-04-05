import { motion } from 'motion/react';
import { Gender } from '../types';
import { bopomofoData } from '../data/bopomofo';
import { Medal, Play, Star } from 'lucide-react';

interface Props {
  gender: Gender;
  medals: number;
  currentLessonIndex: number;
  onStartLearning: () => void;
}

export default function Dashboard({ gender, medals, currentLessonIndex, onStartLearning }: Props) {
  const isGirl = gender === 'girl';
  
  const themeClasses = isGirl 
    ? 'bg-gradient-to-b from-[#1a1a1a] via-[#3b2e5a] to-[#d8a7d4] text-white'
    : 'bg-gradient-to-b from-blue-900 via-blue-800 to-cyan-900 text-blue-100';

  const cardClasses = isGirl
    ? 'bg-[#3b2e5a]/80 border-[#d8a7d4]/50'
    : 'bg-blue-800/50 border-cyan-500/30';

  const buttonClasses = isGirl
    ? 'bg-gradient-to-r from-[#d8a7d4] to-[#ffb7e6] hover:from-[#c796c3] hover:to-[#e5a4cf] text-[#1a1a1a] shadow-[#d8a7d4]/50'
    : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-cyan-500/50';

  const currentBopomofo = bopomofoData[currentLessonIndex] || bopomofoData[0];
  const isCompleted = currentLessonIndex >= bopomofoData.length;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${themeClasses}`}>
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md flex justify-between items-center mb-12"
      >
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${cardClasses} backdrop-blur-sm`}>
          <span className="text-2xl">{isGirl ? '👧' : '👦'}</span>
          <span className="font-bold text-lg">小玩家</span>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${cardClasses} backdrop-blur-sm`}>
          <Medal className={isGirl ? "text-pink-400" : "text-yellow-400"} size={24} />
          <span className="font-bold text-xl">{medals}</span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`w-full max-w-md rounded-3xl border-2 p-8 text-center shadow-2xl backdrop-blur-md ${cardClasses}`}
      >
        {isCompleted ? (
          <div>
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold mb-4">太棒了！</h2>
            <p className="text-xl mb-8">你已經學完所有的注音符號囉！</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6 opacity-90">下一個要學習的是...</h2>
            <div className="text-8xl font-black mb-8 drop-shadow-lg">
              {currentBopomofo.symbol}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartLearning}
              className={`w-full py-4 rounded-2xl text-2xl font-bold flex items-center justify-center gap-3 shadow-lg ${buttonClasses}`}
            >
              <Play fill="currentColor" size={28} />
              開始學習
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Decorative elements */}
      <div className="fixed top-20 left-10 opacity-20">
        <Star size={48} className={isGirl ? "text-pink-300" : "text-cyan-300"} />
      </div>
      <div className="fixed bottom-20 right-10 opacity-20">
        <Star size={64} className={isGirl ? "text-purple-300" : "text-blue-300"} />
      </div>
    </div>
  );
}
