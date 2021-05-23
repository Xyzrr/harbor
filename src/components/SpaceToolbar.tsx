import * as S from './SpaceToolbar.styles';
import React from 'react';
import AudioInputControl from './media-controls/AudioInputControl';
import VideoInputControl from './media-controls/VideoInputControl';
import AudioOutputControl from './media-controls/AudioOutputControl';
import ScreenShareControl from './media-controls/ScreenShareControl';
import SpaceOverflowDropdown from './SpaceOverflowDropdown';
import { PlayerStateContext } from '../contexts/PlayerStateContext';
import BusyToolbar from './BusyToolbar';

export interface SpaceToolbarProps {
  className?: string;
}

const SpaceToolbar: React.FC<SpaceToolbarProps> = React.memo(
  function SpaceToolbar({ className }) {
    const { busyType } = React.useContext(PlayerStateContext);

    if (busyType) {
      return <BusyToolbar />;
    }

    return (
      <S.Wrapper>
        <S.BottomButtonsLeft>
          <AudioInputControl />
          <VideoInputControl showPreviewOnHover />
          <AudioOutputControl />
          <ScreenShareControl />
        </S.BottomButtonsLeft>
        <S.BottomButtonsRight>
          <SpaceOverflowDropdown />
        </S.BottomButtonsRight>
      </S.Wrapper>
    );
  }
);

export default SpaceToolbar;
