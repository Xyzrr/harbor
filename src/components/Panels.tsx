import React from 'react';
import * as S from './Panels.styles';
import NewWindow from './NewWindow';

export interface PanelsProps {
  className?: string;
}

const Panels: React.FC<PanelsProps> = ({ className }) => {
  return (
    <NewWindow name="panels">
      <S.Wrapper
        className={className}
        onMouseDown={(e) => {
          e.preventDefault();
          console.log('yo fuck u');
        }}
        onClick={(e) => {
          e.preventDefault();
          console.log('meh u clicked tho');
        }}
      >
        Hello fuckin world
      </S.Wrapper>
    </NewWindow>
  );
};

export default Panels;
