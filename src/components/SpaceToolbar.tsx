import * as S from './SpaceToolbar.styles';
import React from 'react';
import AudioInputControl from './media-controls/AudioInputControl';
import VideoInputControl from './media-controls/VideoInputControl';
import AudioOutputControl from './media-controls/AudioOutputControl';
import ScreenShareControl from './media-controls/ScreenShareControl';
import SpaceOverflowDropdown from './SpaceOverflowDropdown';
import { PlayerStateContext } from '../contexts/PlayerStateContext';
import Icon from '../elements/Icon';
import { Switch } from '@material-ui/core';

export interface SpaceToolbarProps {
  className?: string;
}

const SpaceToolbar: React.FC<SpaceToolbarProps> = React.memo(
  function SpaceToolbar({ className }) {
    const { busySince, busyUntil, busyType } =
      React.useContext(PlayerStateContext);

    if (busySince) {
      return (
        <S.BusyWrapper>
          <S.BusyWrapperLeft>
            <Icon name="event_busy" />
            Busy
          </S.BusyWrapperLeft>
          <S.BusyWrapperRight>
            <Switch color="primary" defaultChecked />
          </S.BusyWrapperRight>
        </S.BusyWrapper>
      );
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
