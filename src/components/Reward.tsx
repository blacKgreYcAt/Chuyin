import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Gender } from '../types';
import confetti from 'canvas-confetti';
import { Medal, ArrowRight } from 'lucide-react';

interface Props {
  gender: Gender;
  onContinue: () => void;
}

export default function Reward({ gender, onContinue }: Props) {
  const isGirl = gender === 'girl';

  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: isGirl ? ['#ff69b4', '#9370db', '#ffffff'] : ['#00bfff', '#ffd700', '#ffffff']
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: isGirl ? ['#ff69b4', '#9370db', '#ffffff'] : ['#00bfff', '#ffd700', '#ffffff']
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isGirl]);

  const themeClasses = isGirl 
    ? 'bg-gradient-to-b from-[#1a1a1a] via-[#3b2e5a] to-[#d8a7d4] text-white'
    : 'bg-gradient-to-b from-blue-900 via-blue-800 to-cyan-900 text-blue-100';

  const cardClasses = isGirl
    ? 'bg-[#3b2e5a]/80 border-[#d8a7d4]/50'
    : 'bg-blue-800/80 border-cyan-500/50';

  const buttonClasses = isGirl
    ? 'bg-gradient-to-r from-[#d8a7d4] to-[#ffb7e6] hover:from-[#c796c3] hover:to-[#e5a4cf] text-[#1a1a1a] shadow-[#d8a7d4]/50'
    : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-cyan-500/50';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${themeClasses}`}>
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
        className={`w-full max-w-md rounded-3xl border-4 p-12 text-center shadow-2xl backdrop-blur-md flex flex-col items-center ${cardClasses}`}
      >
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-8"
        >
          <Medal size={120} className={isGirl ? "text-pink-400" : "text-yellow-400"} />
        </motion.div>

        <h2 className="text-4xl font-black mb-4 text-yellow-300 drop-shadow-md">答對了！</h2>
        <p className="text-2xl mb-12 font-bold">獲得一枚獎章！</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className={`w-full py-4 rounded-2xl text-2xl font-bold flex items-center justify-center gap-3 shadow-lg ${buttonClasses}`}
        >
          繼續學習
          <ArrowRight size={28} />
        </motion.button>
      </motion.div>
    </div>
  );
}
