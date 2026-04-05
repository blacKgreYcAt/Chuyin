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

  return (
    <div className="w-full min-h-screen overflow-hidden font-sans">
      {appState === 'selection' && (
        <GenderSelection onSelect={handleGenderSelect} />
      )}
      
      {appState === 'dashboard' && progress.gender && (
        <Dashboard 
          gender={progress.gender}
          medals={progress.medals}
          completedLessons={progress.completedLessons}
          onSelectLesson={handleSelectLesson}
        />
      )}

      {appState === 'learning' && progress.gender && (
        <Learning
          gender={progress.gender}
          currentLessonIndex={progress.currentLessonIndex}
          onNext={handleLearningNext}
        />
      )}

      {appState === 'quiz' && progress.gender && (
        <Quiz
          gender={progress.gender}
          currentLessonIndex={progress.currentLessonIndex}
          onCorrect={handleQuizCorrect}
        />
      )}

      {appState === 'reward' && progress.gender && (
        <Reward
          gender={progress.gender}
          onContinue={handleRewardContinue}
        />
      )}
    </div>
  );
}
