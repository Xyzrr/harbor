import * as S from './MapPlayer.styles';
import React from 'react';
import UserAvatar from '../elements/UserAvatar';
import Color from 'color';

export interface PlayerSummary {
  sid?: string;
  name: string;
  color: number;
  x: number;
  y: number;
  dir: number;
  speed: number;
  audioInputOn?: boolean;
  audioOutputOn?: boolean;
  videoInputOn?: boolean;
  screenShareOn?: boolean;
}

export interface MapPlayerProps {
  className?: string;
  playerSummary: PlayerSummary;
}

const MapPlayer: React.FC<MapPlayerProps> = ({ className, playerSummary }) => {
  return (
    <S.Wrapper
      className={className}
      color={Color(playerSummary.color).toString()}
      style={{
        transform: `translate(${playerSummary.x}px, ${playerSummary.y}px)`,
      }}
    >
      <S.LiquidUserAvatar userName={playerSummary.name} />
    </S.Wrapper>
  );
};

export default MapPlayer;
