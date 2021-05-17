import React from 'react';
import { PlayerSummary } from '../components/MapPlayer';

export const useKeyboardMovement = (
  setPlayer: (f: PlayerSummary | ((draft: PlayerSummary) => void)) => void,
  playerSummaries: {
    [identity: string]: PlayerSummary;
  }
) => {
  React.useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);
};
