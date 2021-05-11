import React from 'react';
import * as S from './Space.styles';

export interface SpaceProps {
  className?: string;
}

const Space: React.FC<SpaceProps> = ({ className }) => {
  return <S.Wrapper className={className}>Hello</S.Wrapper>;
};

export default Space;
