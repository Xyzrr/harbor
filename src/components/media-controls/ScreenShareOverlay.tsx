import * as S from './ScreenShareOverlay.styles';
import React from 'react';
import NewWindow from '../../elements/NewWindow';
import CursorsOverlay from './CursorsOverlay';
import { LocalMediaContext } from '../../contexts/LocalMediaContext';
import { LocalInfoContext } from '../../contexts/LocalInfoContext';

export interface ScreenShareOverlayProps {
  className?: string;
}

const ScreenShareOverlay: React.FC<ScreenShareOverlayProps> = React.memo(
  function ScreenShareOverlay({ className }) {
    const { localScreenShareSourceId } = React.useContext(LocalMediaContext);
    const { localIdentity } = React.useContext(LocalInfoContext);

    return (
      <NewWindow
        name="screen-share-overlay"
        features={`shareSourceId=${localScreenShareSourceId}`}
      >
        <S.Wrapper className={className}>
          <S.Frame />
          <CursorsOverlay screenOwnerIdentity={localIdentity} />
        </S.Wrapper>
      </NewWindow>
    );
  }
);

export default ScreenShareOverlay;
