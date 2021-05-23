import * as S from './BusyToolbar.styles';
import React from 'react';
import Icon from '../elements/Icon';
import { Switch } from '@material-ui/core';
import { PlayerStateContext } from '../contexts/PlayerStateContext';
import { NewWindowContext } from '../elements/NewWindow';
import TimeLeft from '../elements/TimeLeft';

export interface BusyToolbarProps {
  className?: string;
}

const BusyToolbar: React.FC<BusyToolbarProps> = React.memo(
  function BusyToolbar({ className }) {
    const newWindow = React.useContext(NewWindowContext);

    const { busyUntil, busyType, setBusySince, setBusyUntil, setBusyType } =
      React.useContext(PlayerStateContext);

    React.useEffect(() => {
      const interval = window.setInterval(() => {
        if (busyUntil && busyUntil < Date.now()) {
          setBusySince(undefined);
          setBusyUntil(undefined);
          setBusyType(undefined);
        }
      }, 1000);

      return () => {
        window.clearInterval(interval);
      };
    }, [busyUntil, setBusySince, setBusyUntil, setBusyType]);

    return (
      <S.Wrapper className="busy-toolbar">
        <S.WrapperLeft>
          <S.TypeIcon name="event_busy" />
          Busy
        </S.WrapperLeft>
        <S.WrapperRight>
          {busyUntil && <S.StyledTimeLeft until={busyUntil} />}
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
