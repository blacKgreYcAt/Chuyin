export type Gender = 'boy' | 'girl';
export type AppState = 'selection' | 'dashboard' | 'learning' | 'quiz' | 'reward';

export interface UserProgress {
  gender: Gender | null;
  medals: number;
  currentLessonIndex: number;
  completedLessons: number[];
  mistakeCounts?: Record<number, number>;
  isEyeCareMode?: boolean;
}
