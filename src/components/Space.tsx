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
      <S.TrayPopoutWrapper>
        <S.Wrapper className={className}>Hello</S.Wrapper>
      </S.TrayPopoutWrapper>
      <S.Overlay />
      <S.CaretOverlay />
      <NewWindow name="panels">
        <Panels />
      </NewWindow>
    </>
  );
};

export default Space;
