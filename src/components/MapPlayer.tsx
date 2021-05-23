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
  return (
    <S.Wrapper
      className={className}
      busy={!!playerSummary.busyType}
      self={self}
      color={Color(playerSummary.color).string()}
      style={{
        transform: `translate(${playerSummary.x}px, ${playerSummary.y}px)`,
      }}
    >
      <S.LiquidUserAvatar
        userName={playerSummary.name}
        photoUrl={playerSummary.photoUrl}
      />
      {playerSummary.busyType && <S.BusyIcon name="event_busy" />}
    </S.Wrapper>
  );
});

export default MapPlayer;
