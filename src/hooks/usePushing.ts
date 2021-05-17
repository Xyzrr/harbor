import React from 'react';
import { PlayerSummary } from '../components/MapPlayer';
import { PLAYER_RADIUS } from '../constants';
import { NewWindowContext } from '../elements/NewWindow';

/**
 * Unused because having multiple requestAnimationFrame loops seems buggy.
 * So I copied this logic into useKeyboardMovement for now.
 */
export const usePushing = (
  setPlayer: (f: PlayerSummary | ((draft: PlayerSummary) => void)) => void,
  playerSummaries: {
    [identity: string]: PlayerSummary;
  }
) => {
  const newWindow = React.useContext(NewWindowContext);

  React.useEffect(() => {
    if (!newWindow) {
      return;
    }

    let animationFrame: number;
    const animate = () => {
      animationFrame = newWindow.requestAnimationFrame(animate);
      setPlayer((draft) => {
        for (const [identity, player] of Object.entries(playerSummaries)) {
          const dist = Math.sqrt(
            (player.x - draft.x) ** 2 + (player.y - draft.y) ** 2
          );

          if (dist < PLAYER_RADIUS * 2) {
            console.log('Pushed by:', identity);

            const atan = Math.atan((draft.y - player.y) / (player.x - draft.x));
            const dir = player.x > draft.x ? atan : atan + Math.PI;
            const pushDir = dir + Math.PI;
            const pushDist = (PLAYER_RADIUS * 2) / (dist + PLAYER_RADIUS);

            draft.x += Math.cos(pushDir) * pushDist;
            draft.y -= Math.sin(pushDir) * pushDist;
          }
        }
      });
    };

    animationFrame = newWindow.requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [setPlayer, playerSummaries, newWindow]);
};
