import * as S from './MapPlayer.styles';
import React from 'react';
import Color from 'color';
import { BusyType } from '../contexts/PlayerStateContext';

export interface PlayerSummary {
  sid?: string;
  name: string;
  photoUrl: string | null;
  color: number;
  x: number;
  y: number;
  dir: number;
  speed: number;
  audioInputOn?: boolean;
  audioOutputOn?: boolean;
  videoInputOn?: boolean;
  screenShareOn?: boolean;
  busyType?: BusyType;
  connected: boolean;
  spaceFocused?: boolean;
}

export interface MapPlayerProps {
  className?: string;
  playerSummary: PlayerSummary;
  self?: boolean;
}

const MapPlayer: React.FC<MapPlayerProps> = React.memo(function MapPlayer({
  className,
  playerSummary,
  self,
}) {
  const { dir } = playerSummary;
  const [interpolableDir, setInterpolableDir] = React.useState(dir);
  console.log('dir', interpolableDir);
  React.useEffect(() => {
    setInterpolableDir(
      (d) => d + (((((dir / Math.PI) * 180 - d) % 360) + 540) % 360) - 180
    );
  }, [dir]);

  return (
    <S.Wrapper
      className={className}
      connected={playerSummary.connected}
      busy={!!playerSummary.busyType}
      self={self}
      color={Color(playerSummary.color).string()}
      style={{
        transform: `translate(${playerSummary.x}px, ${playerSummary.y}px)`,
      }}
    >
      {playerSummary.spaceFocused && (
        <S.Pointer
          style={{
            transform: `translate(-50%, -50%) rotate(${interpolableDir}deg) translateX(14px) rotate(45deg)`,
          }}
        />
      )}

      <S.LiquidUserAvatar
        userName={playerSummary.name}
        photoUrl={playerSummary.photoUrl}
      />
      {playerSummary.busyType && <S.BusyIcon name="event_busy" />}
    </S.Wrapper>
  );
});

export default MapPlayer;
