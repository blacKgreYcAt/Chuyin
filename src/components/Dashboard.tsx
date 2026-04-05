import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Gender } from '../types';
import { bopomofoData } from '../data/bopomofo';
import { Medal, Star, CheckCircle2, DownloadCloud, Loader2 } from 'lucide-react';
import { downloadAllVoices, getDownloadedVoiceCount } from '../services/voiceCache';

interface Props {
  gender: Gender;
  medals: number;
  completedLessons: number[];
  onSelectLesson: (index: number) => void;
}

export default function Dashboard({ gender, medals, completedLessons, onSelectLesson }: Props) {
  const isGirl = gender === 'girl';
  const [downloadProgress, setDownloadProgress] = useState<{current: number, total: number} | null>(null);
  const [downloadedCount, setDownloadedCount] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  
  useEffect(() => {
    getDownloadedVoiceCount().then(setDownloadedCount);
  }, []);

  const handleDownloadVoices = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadError(false);
    try {
      await downloadAllVoices((current, total) => {
        setDownloadProgress({ current, total });
        setDownloadedCount(current);
      });
    } catch (e) {
      console.error(e);
      setDownloadError(true);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null);
    }
  };

  const themeClasses = isGirl 
    ? 'bg-gradient-to-b from-[#1a1a1a] via-[#3b2e5a] to-[#d8a7d4] text-white'
    : 'bg-gradient-to-b from-blue-900 via-blue-800 to-cyan-900 text-blue-100';

  const cardClasses = isGirl
    ? 'bg-[#3b2e5a]/80 border-[#d8a7d4]/50 hover:border-[#ffb7e6]'
    : 'bg-blue-800/50 border-cyan-500/30 hover:border-cyan-300';

  const completedClasses = isGirl
    ? 'bg-[#d8a7d4] text-[#1a1a1a] border-[#ffb7e6]'
    : 'bg-cyan-500 text-white border-cyan-300';

  const totalVoices = bopomofoData.length;
  const allDownloaded = downloadedCount === totalVoices;

  return (
    <div className={`min-h-screen flex flex-col items-center p-6 pb-12 ${themeClasses}`}>
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-4xl flex justify-between items-center mb-8"
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
        className="w-full max-w-4xl"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-center drop-shadow-md">請選擇要學習的注音符號</h2>
          
          {/* Download Voice Pack UI */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${cardClasses} backdrop-blur-sm`}>
            {allDownloaded ? (
              <div className="flex items-center gap-2 text-green-400 font-bold">
                <CheckCircle2 size={20} />
                <span>語音包已下載</span>
              </div>
            ) : (
              <>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">AI 語音包 ({downloadedCount}/{totalVoices})</span>
                  {downloadProgress && (
                    <div className="w-full bg-black/30 h-2 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="bg-green-400 h-full transition-all duration-300"
                        style={{ width: `${(downloadProgress.current / downloadProgress.total) * 100}%` }}
                      />
                    </div>
                  )}
                  {downloadError && <span className="text-xs text-red-400 mt-1">下載失敗，請重試</span>}
                </div>
                <button
                  onClick={handleDownloadVoices}
                  disabled={isDownloading}
                  className={`p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="下載所有語音以獲得順暢體驗"
                >
                  {isDownloading ? <Loader2 size={20} className="animate-spin" /> : <DownloadCloud size={20} />}
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {bopomofoData.map((item, index) => {
            const isCompleted = completedLessons.includes(index);
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectLesson(index)}
                className={`relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center text-5xl font-black shadow-lg transition-colors ${
                  isCompleted ? completedClasses : cardClasses
                }`}
              >
                {item.symbol}
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 shadow-md">
                    <CheckCircle2 size={20} className="text-white" />
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
