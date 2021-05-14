import React from 'react';
import { PlayerSummary } from '../components/MapPlayer';
import { ColyseusContext } from '../contexts/ColyseusContext';
import { PLAYER_RADIUS } from '../constants';
import { NewWindowContext } from '../elements/NewWindow';

export const useKeyboardMovement = (
  setPlayer: (f: PlayerSummary | ((draft: PlayerSummary) => void)) => void
) => {
  const newWindow = React.useContext(NewWindowContext);

  const { room: colyseusRoom } = React.useContext(ColyseusContext);

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
    [colyseusRoom]
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
    console.log('the fuck');

    if (!colyseusRoom || !newWindow) {
      return;
    }

    let animationFrame: number;
    let lastFrameTime = Date.now();

    const animate = () => {
      animationFrame = newWindow.requestAnimationFrame(animate);

      console.log('held commands', heldCommands.current);

      const time = Date.now();
      const delta = (time - lastFrameTime) / 1000;
      lastFrameTime = time;

      setPlayer((draft) => {
        draft.x += draft.speed * Math.cos(draft.dir) * delta;
        draft.y += draft.speed * Math.sin(draft.dir) * delta;

        colyseusRoom?.send('updatePlayer', {
          x: draft.x,
          y: draft.y,
        });
      });
    };

    console.log('requesting fuck');

    animationFrame = newWindow.requestAnimationFrame(animate);

    return () => {
      newWindow.cancelAnimationFrame(animationFrame);
    };
  }, [colyseusRoom, newWindow]);
};
