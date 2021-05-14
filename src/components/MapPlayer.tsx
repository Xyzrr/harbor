import * as S from './MapPlayer.styles';
import React from 'react';
import UserAvatar from '../elements/UserAvatar';

export interface PlayerSummary {
  sid?: string;
  name: string;
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
    <S.Wrapper className={className}>
      <UserAvatar userName={playerSummary.name} />
    </S.Wrapper>
  );
};

export default MapPlayer;
