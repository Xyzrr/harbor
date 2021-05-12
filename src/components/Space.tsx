import React from 'react';
import * as S from './Space.styles';
import NewWindow from './NewWindow';
import Panels from './Panels';

export interface SpaceProps {
  className?: string;
}

const Space: React.FC<SpaceProps> = ({ className }) => {
  return (
    <>
      <S.Wrapper className={className}>Hello</S.Wrapper>
      <Panels />
    </>
  );
};

export default Space;
