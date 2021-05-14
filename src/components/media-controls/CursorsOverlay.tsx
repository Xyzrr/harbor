import * as S from './CursorsOverlay.styles';
import React from 'react';

import FakeCursor from './FakeCursor';
import { ColyseusContext } from '../../contexts/ColyseusContext';
import Color from 'color';
import { LocalInfoContext } from '../../contexts/LocalInfoContext';

export interface CursorsOverlayProps {
  className?: string;
  screenOwnerIdentity: string;
}

const CursorsOverlay: React.FC<CursorsOverlayProps> = ({
  className,
  screenOwnerIdentity,
}) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const { localIdentity } = React.useContext(LocalInfoContext);

  const [cursors, setCursors] = React.useState<{
    [identity: string]: { x: number; y: number; color: number; name: string };
  }>({});

  const flash = (x: string, y: string, color: string) => {
    if (wrapperRef.current == null) {
      return;
    }

    // If we ever actually use this function,
    // we should make it more like flashFocus,
    // with options and absolute position instead of fixed.
    const flasher = document.createElement('div');
    flasher.className = 'flasher';
    wrapperRef.current?.appendChild(flasher);
    flasher.style.left = x;
    flasher.style.top = y;
    flasher.style.borderColor = color;

    window.setTimeout(() => {
      wrapperRef.current?.removeChild(flasher);
    }, 2000);
  };

  const { addListener, removeListener, room } =
    React.useContext(ColyseusContext);

  React.useEffect(() => {
    if (!room) {
      return;
    }

    const onPlayerUpdated = () => {
      console.log('Updating cursors');
      const players = room.state.players.entries();
      const playersInAudience = players.filter(
        ([i, p]: [string, any]) =>
          i !== localIdentity &&
          p.cursor &&
          p.cursor.surfaceType === 'screen' &&
          p.cursor.surfaceId === screenOwnerIdentity
      );
      const newCursors: any = {};
      playersInAudience.forEach(([i, p]: [string, any]) => {
        newCursors[i] = {
          x: p.cursor.x,
          y: p.cursor.y,
          color: p.color,
          name: p.name,
        };
      });
      setCursors(newCursors);
    };

    addListener('player-updated', onPlayerUpdated);

    return () => {
      removeListener('player-updated', onPlayerUpdated);
    };
  }, [room]);

  React.useEffect(() => {
    if (!room) {
      return;
    }

    const remove = room.onMessage('cursorMouseDown', (mouseDownData: any) => {
      if (
        mouseDownData.surfaceType === 'screen' &&
        mouseDownData.surfaceId === screenOwnerIdentity
      ) {
        flash(
          `${mouseDownData.x * 100}%`,
          `${mouseDownData.y * 100}%`,
          Color(
            room.state.players.get(mouseDownData.cursorOwnerIdentity).color
          ).toString()
        );
      }
    });

    return remove;
  }, [room, screenOwnerIdentity]);

  return (
    <S.Wrapper className={className} ref={wrapperRef}>
      {Object.entries(cursors).map(([identity, cursor]) => {
        return (
          <FakeCursor
            key={identity}
            x={`${cursor.x * 100}%`}
            y={`${cursor.y * 100}%`}
            color={Color(cursor.color).toString()}
          />
        );
      })}
    </S.Wrapper>
  );
};

export default CursorsOverlay;
