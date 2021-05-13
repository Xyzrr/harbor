import * as S from './SpaceMap.styles';
import React from 'react';

export interface SpaceMapProps {
  className?: string;
}

const SpaceMap: React.FC<SpaceMapProps> = ({ className }) => {
  return <S.Wrapper className={className} />;
};

export default SpaceMap;
