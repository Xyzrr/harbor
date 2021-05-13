import React from 'react';
import * as S from './Space.styles';
import NewWindow from '../elements/NewWindow';
import Panels from './Panels';

export interface SpaceProps {
  className?: string;
}

const Space: React.FC<SpaceProps> = ({ className }) => {
  return (
    <>
      <S.Overlay />
      <S.CaretOverlay />
      <S.TrayPopoutWrapper>
        <S.Wrapper className={className}>Hello</S.Wrapper>
      </S.TrayPopoutWrapper>
      <Panels />
    </>
  );
};

export default Space;
