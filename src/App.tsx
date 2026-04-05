import { useState } from 'react';
import { AppState, Gender, UserProgress } from './types';
import { bopomofoData } from './data/bopomofo';
import GenderSelection from './components/GenderSelection';
import Dashboard from './components/Dashboard';
import Learning from './components/Learning';
import Quiz from './components/Quiz';
import Reward from './components/Reward';

export default function App() {
  const [appState, setAppState] = useState<AppState>('selection');
  const [progress, setProgress] = useState<UserProgress>({
    gender: null,
    medals: 0,
    currentLessonIndex: 0,
    completedLessons: [],
    mistakeCounts: {},
    isEyeCareMode: false,
  });

  const handleGenderSelect = (gender: Gender) => {
    setProgress(prev => ({ ...prev, gender }));
    setAppState('dashboard');
  };

  const handleSelectLesson = (index: number) => {
    setProgress(prev => ({ ...prev, currentLessonIndex: index }));
    setAppState('learning');
  };

  const handleLearningNext = () => {
    setAppState('quiz');
  };

  const handleQuizCorrect = () => {
    setAppState('reward');
  };

  const handleMistake = () => {
    setProgress(prev => {
      const currentCount = prev.mistakeCounts?.[prev.currentLessonIndex] || 0;
      return {
        ...prev,
        mistakeCounts: {
          ...prev.mistakeCounts,
          [prev.currentLessonIndex]: currentCount + 1,
        }
      };
    });
  };

  const handleBackToHome = () => {
    setAppState('dashboard');
  };

  const handleToggleEyeCare = () => {
    setProgress(prev => ({ ...prev, isEyeCareMode: !prev.isEyeCareMode }));
  };

  const handleRewardContinue = () => {
    setProgress(prev => {
      const newCompleted = prev.completedLessons.includes(prev.currentLessonIndex)
        ? prev.completedLessons
        : [...prev.completedLessons, prev.currentLessonIndex];

      // Find next uncompleted lesson
      let nextLesson = 0;
      for (let i = 0; i < bopomofoData.length; i++) {
        if (!newCompleted.includes(i)) {
          nextLesson = i;
          break;
        }
      }

      return {
        ...prev,
        medals: prev.medals + 1,
        completedLessons: newCompleted,
        currentLessonIndex: nextLesson,
      };
    });
    setAppState('dashboard');
  };

  const handleReview = () => {
    // Find the lesson with the highest mistake count
    const mistakes = progress.mistakeCounts || {};
    let maxMistakes = 0;
    let reviewIndex = -1;
    
    Object.entries(mistakes).forEach(([indexStr, count]) => {
      if (count > maxMistakes) {
        maxMistakes = count;
        reviewIndex = parseInt(indexStr, 10);
      }
    });

    if (reviewIndex !== -1) {
      handleSelectLesson(reviewIndex);
    }
  };

  return (
    <div className="w-full min-h-screen overflow-hidden font-sans">
      {appState === 'selection' && (
        <GenderSelection 
          onSelect={handleGenderSelect} 
          isEyeCareMode={!!progress.isEyeCareMode}
          onToggleEyeCare={handleToggleEyeCare}
        />
      )}
      
      {appState === 'dashboard' && progress.gender && (
        <Dashboard 
          gender={progress.gender}
          medals={progress.medals}
          completedLessons={progress.completedLessons}
          onSelectLesson={handleSelectLesson}
          hasMistakes={Object.keys(progress.mistakeCounts || {}).length > 0}
          onReview={handleReview}
          isEyeCareMode={!!progress.isEyeCareMode}
          onToggleEyeCare={handleToggleEyeCare}
        />
      )}

      {appState === 'learning' && progress.gender && (
        <Learning
          gender={progress.gender}
          currentLessonIndex={progress.currentLessonIndex}
          onNext={handleLearningNext}
          onBackToHome={handleBackToHome}
          isEyeCareMode={!!progress.isEyeCareMode}
        />
      )}

      {appState === 'quiz' && progress.gender && (
        <Quiz
          gender={progress.gender}
          currentLessonIndex={progress.currentLessonIndex}
          onCorrect={handleQuizCorrect}
          onMistake={handleMistake}
          onBackToHome={handleBackToHome}
          isEyeCareMode={!!progress.isEyeCareMode}
        />
      )}

      {appState === 'reward' && progress.gender && (
        <Reward
          gender={progress.gender}
          onContinue={handleRewardContinue}
          isEyeCareMode={!!progress.isEyeCareMode}
        />
      )}
    </div>
  );
}
