import React from 'react';
import { PlayerSummary } from '../components/MapPlayer';
import { ColyseusContext } from '../contexts/ColyseusContext';
import { PLAYER_RADIUS } from '../constants';
import { NewWindowContext } from '../elements/NewWindow';
import { PlayerStateContext } from '../contexts/PlayerStateContext';

export const useKeyboardMovement = (
  setPlayer: (f: PlayerSummary | ((draft: PlayerSummary) => void)) => void,
  playerSummaries: {
    [identity: string]: PlayerSummary;
  }
) => {
  const newWindow = React.useContext(NewWindowContext);

  const { room: colyseusRoom } = React.useContext(ColyseusContext);

  const { busyType } = React.useContext(PlayerStateContext);

  const heldCommands = React.useRef<{ [key: string]: boolean }>({});

  const getDir = React.useCallback(() => {
    const commands = heldCommands.current;
    if (commands.right && commands.up) {
      return -Math.PI / 4;
    }
    if (commands.right && commands.down) {
      return Math.PI / 4;
    }
    if (commands.left && commands.down) {
      return (Math.PI * 3) / 4;
    }
    if (commands.left && commands.up) {
      return (Math.PI * 5) / 4;
    }
    if (commands.right) {
      return 0;
    }
    if (commands.down) {
      return Math.PI / 2;
    }
    if (commands.left) {
      return -Math.PI;
    }
    if (commands.up) {
      return -Math.PI / 2;
    }
    return null;
  }, []);

  const getSpeed = React.useCallback(() => {
    const commands = heldCommands.current;
    if (commands.right || commands.up || commands.left || commands.down) {
      return 128;
    }
    return 0;
  }, []);

  const keyMap: { [key: string]: string } = {
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowLeft: 'left',
    ArrowDown: 'down',
    d: 'right',
    w: 'up',
    a: 'left',
    s: 'down',
    D: 'right',
    W: 'up',
    A: 'left',
    S: 'down',
  };

  const shakeBusyToolbar = () => {
    const toolbar = newWindow.document.querySelector('.busy-toolbar');

    toolbar?.classList.add('shaking');

    newWindow.setTimeout(() => {
      toolbar?.classList.remove('shaking');
    }, 500);
  };

  const onKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (!colyseusRoom) {
        return;
      }

      if (
        document.activeElement &&
        document.activeElement.tagName === 'INPUT'
      ) {
        return;
      }

      if (e.metaKey) {
        return;
      }

      const command = keyMap[e.key];

      if (command == null) {
        return;
      }

      if (busyType) {
        shakeBusyToolbar();
        return;
      }

      heldCommands.current[command] = true;

      if (
        command === 'right' ||
        command === 'up' ||
        command === 'left' ||
        command === 'down'
      ) {
        const dir = getDir();

        if (dir != null) {
          colyseusRoom.send('setPlayerDirection', dir);
          setPlayer((draft) => {
            draft.dir = dir;
          });
        }

        const speed = getSpeed();
        colyseusRoom.send('setPlayerSpeed', speed);
        setPlayer((draft) => {
          draft.speed = speed;
        });
      }
    },
    [colyseusRoom, busyType]
  );

  const onKeyUp = React.useCallback(
    (e: KeyboardEvent) => {
      if (!colyseusRoom) {
        return;
      }

      const command = keyMap[e.key];

      if (command == null) {
        return;
      }

      delete heldCommands.current[command];

      if (
        command === 'right' ||
        command === 'up' ||
        command === 'left' ||
        command === 'down'
      ) {
        const dir = getDir();

        if (dir != null) {
          colyseusRoom.send('setPlayerDirection', dir);
          setPlayer((draft) => {
            draft.dir = dir;
          });
        }

        const speed = getSpeed();
        colyseusRoom.send('setPlayerSpeed', speed);
        setPlayer((draft) => {
          draft.speed = speed;
        });
      }
    },
    [colyseusRoom]
  );

  React.useEffect(() => {
    if (!newWindow) {
      return;
    }

    newWindow.addEventListener('keydown', onKeyDown);
    newWindow.addEventListener('keyup', onKeyUp);
    return () => {
      newWindow.removeEventListener('keydown', onKeyDown);
      newWindow.removeEventListener('keyup', onKeyUp);
    };
  }, [onKeyUp, onKeyDown]);

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (Object.values(heldCommands.current).length > 0) {
        return;
      }

      const playerX = newWindow.innerWidth / 2;
      const playerY = newWindow.innerHeight / 2;

      const atan = Math.atan((playerY - e.y) / (playerX - e.x));
      if (Number.isNaN(atan)) {
        return;
      }

      const newDir = e.x > playerX ? atan : atan + Math.PI;
      setPlayer((draft) => {
        draft.dir = newDir;
      });
    };

    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as Element).closest('.space-map') != null) {
        if (busyType) {
          shakeBusyToolbar();
          return;
        }

        setPlayer((draft) => {
          draft.speed = 128;
        });
      }
    };

    const onMouseUp = () => {
      setPlayer((draft) => {
        draft.speed = 0;
      });
    };

    newWindow.addEventListener('mousemove', onMouseMove);
    newWindow.addEventListener('mousedown', onMouseDown);
    newWindow.addEventListener('mouseup', onMouseUp);
    return () => {
      newWindow.removeEventListener('mousemove', onMouseMove);
      newWindow.removeEventListener('mousedown', onMouseDown);
      newWindow.removeEventListener('mouseup', onMouseUp);
    };
  }, [newWindow, busyType, setPlayer]);

  React.useEffect(() => {
    if (!colyseusRoom || !newWindow) {
      return;
    }

    let animationFrame: number;
    let lastFrameTime = Date.now();

    const animate = () => {
      animationFrame = newWindow.requestAnimationFrame(animate);

      const time = Date.now();
      const delta = (time - lastFrameTime) / 1000;
      lastFrameTime = time;

      setPlayer((draft) => {
        let positionChanged = false;

        if (draft.speed > 0) {
          draft.x += draft.speed * Math.cos(draft.dir) * delta;
          draft.y += draft.speed * Math.sin(draft.dir) * delta;
          positionChanged = true;
        }

        for (const [identity, player] of Object.entries(playerSummaries)) {
          const dist = Math.sqrt(
            (player.x - draft.x) ** 2 + (player.y - draft.y) ** 2
          );

          if (dist < PLAYER_RADIUS * 2) {
            console.debug('Pushed by:', identity);

            const atan = Math.atan((draft.y - player.y) / (player.x - draft.x));
            const dir = player.x > draft.x ? atan : atan + Math.PI;
            const pushDir = dir + Math.PI;
            const pushDist = (PLAYER_RADIUS * 2) / (dist + PLAYER_RADIUS);

            draft.x += Math.cos(pushDir) * pushDist;
            draft.y -= Math.sin(pushDir) * pushDist;
            positionChanged = true;
          }
        }

        if (positionChanged) {
          colyseusRoom?.send('updatePlayer', {
            x: draft.x,
            y: draft.y,
          });
        }
      });
    };

    animationFrame = newWindow.requestAnimationFrame(animate);

    return () => {
      newWindow.cancelAnimationFrame(animationFrame);
    };
  }, [colyseusRoom, newWindow, playerSummaries]);
};
