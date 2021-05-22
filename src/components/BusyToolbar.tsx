import * as S from './BusyToolbar.styles';
import React from 'react';
import Icon from '../elements/Icon';
import { Switch } from '@material-ui/core';
import { PlayerStateContext } from '../contexts/PlayerStateContext';

export interface BusyToolbarProps {
  className?: string;
}

const BusyToolbar: React.FC<BusyToolbarProps> = React.memo(
  function BusyToolbar({ className }) {
    const { busyUntil, busyType, setBusySince, setBusyUntil, setBusyType } =
      React.useContext(PlayerStateContext);

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
      <S.Wrapper>
        <S.WrapperLeft>
          <Icon name="event_busy" />
          Busy
        </S.WrapperLeft>
        <S.WrapperRight>
          <S.TimeLeft>{timeLeftString}</S.TimeLeft>
          <Switch color="primary" defaultChecked />
        </S.WrapperRight>
      </S.Wrapper>
    );
  }
);

export default BusyToolbar;
