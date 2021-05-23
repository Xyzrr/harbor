import * as S from './BusyToolbar.styles';
import React from 'react';
import Icon from '../elements/Icon';
import { Switch } from '@material-ui/core';
import { PlayerStateContext } from '../contexts/PlayerStateContext';
import { NewWindowContext } from '../elements/NewWindow';

export interface BusyToolbarProps {
  className?: string;
}

const BusyToolbar: React.FC<BusyToolbarProps> = React.memo(
  function BusyToolbar({ className }) {
    const newWindow = React.useContext(NewWindowContext);

    const { busyUntil, busyType, setBusySince, setBusyUntil, setBusyType } =
      React.useContext(PlayerStateContext);

    const getTimeLeftString = React.useCallback(() => {
      if (!busyUntil) {
        return '';
      }

      const diff = busyUntil - Date.now();

      const hours = Math.floor(diff / (60 * 60 * 1000));
      const minutes = Math.ceil((diff % (60 * 60 * 1000)) / (60 * 1000));

      if (hours === 0) {
        return `${minutes}m`;
      }

      return `${hours}h ${minutes}m`;
    }, [busyUntil]);

    const [timeLeftString, setTimeLeftString] = React.useState(() =>
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

    return (
      <S.Wrapper className="busy-toolbar">
        <S.WrapperLeft>
          <S.TypeIcon name="event_busy" />
          Busy
        </S.WrapperLeft>
        <S.WrapperRight>
          <S.TimeLeft>{timeLeftString}</S.TimeLeft>
          <S.StyledSwitch
            defaultChecked
            onChange={() => {
              newWindow.setTimeout(() => {
                setBusySince(undefined);
                setBusyUntil(undefined);
                setBusyType(undefined);
              }, 200);
            }}
          />
        </S.WrapperRight>
      </S.Wrapper>
    );
  }
);

export default BusyToolbar;
