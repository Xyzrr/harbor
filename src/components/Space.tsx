import React from 'react';
import * as S from './Space.styles';
import NewWindow from '../elements/NewWindow';
import Panels from './Panels';
import SpaceMap from './SpaceMap';

export interface SpaceProps {
  className?: string;
}

const Space: React.FC<SpaceProps> = ({ className }) => {
  return (
    <>
      <S.TrayPopoutWrapper>
        <SpaceMap />
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
