import { useContext } from 'react';
import { DifficultyContext } from '@/contexts/DifficultyContext';

export function useDifficultySettings() {
  const context = useContext(DifficultyContext);
  if (context === undefined) {
    throw new Error('useDifficultySettings must be used within a DifficultyProvider');
  }
  return context;
}
