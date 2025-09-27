import { useContext } from 'react';
import { FullscreenContext } from '@/lib/fullscreenContext';

export function useFullscreen() {
  const context = useContext(FullscreenContext);
  if (context === undefined) {
    throw new Error('useFullscreen deve ser usado dentro de um FullscreenProvider');
  }
  return context;
}
