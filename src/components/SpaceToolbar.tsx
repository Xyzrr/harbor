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
    const {
      busySince,
      busyUntil,
      busyType,
      setBusySince,
      setBusyUntil,
      setBusyType,
    } = React.useContext(PlayerStateContext);

    const getTimeLeftString = React.useCallback(() => {
      if (!busyUntil) {
        return '';
      }

      const diff = busyUntil - Date.now();

      const hours = Math.floor(diff / (60 * 60 * 1000));
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));

      if (hours === 0) {
        return `${minutes}m`;
      }

      return `${hours}h ${minutes}m`;
    }, [busyUntil]);

    const [timeLeftString, setTimeLeftString] = React.useState(
      getTimeLeftString()
    );

    React.useEffect(() => {
      const interval = window.setInterval(() => {
        if (busyUntil && busyUntil < Date.now()) {
          setBusySince(undefined);
          setBusyUntil(undefined);
          setBusyType(undefined);
        }

        setTimeLeftString(getTimeLeftString());
      }, 1000);

      return () => {
        window.clearInterval(interval);
      };
    }, [getTimeLeftString, busyUntil, setBusySince, setBusyUntil, setBusyType]);

    if (busySince) {
      return (
        <S.BusyWrapper>
          <S.BusyWrapperLeft>
            <Icon name="event_busy" />
            Busy
          </S.BusyWrapperLeft>
          <S.BusyWrapperRight>
            <S.TimeLeft>{timeLeftString}</S.TimeLeft>
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
