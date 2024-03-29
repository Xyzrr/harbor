import * as S from './BusyToolbar.styles';
import React from 'react';
import Icon from '../elements/Icon';
import { PlayerStateContext } from '../contexts/PlayerStateContext';
import { NewWindowContext } from '../elements/NewWindow';
import TimeLeft from '../elements/TimeLeft';
import PopupTrigger from '../elements/PopupTrigger';
import { MenuItem, MenuList, Paper, Switch } from '@material-ui/core';

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
          {busyUntil && (
            <PopupTrigger
              anchorOrigin="bottom left"
              transformOrigin="top left"
              popupContent={({ onClose }) => {
                return (
                  <Paper>
                    <MenuList dense variant="menu">
                      <MenuItem
                        onClick={() => {
                          setBusySince(Date.now());
                          setBusyUntil(Date.now() + 1000 * 60 * 10);
                          setBusyType('default');
                          onClose();
                        }}
                      >
                        10 minutes
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setBusySince(Date.now());
                          setBusyUntil(Date.now() + 1000 * 60 * 30);
                          setBusyType('default');
                          onClose();
                        }}
                      >
                        30 minutes
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setBusySince(Date.now());
                          setBusyUntil(Date.now() + 1000 * 60 * 60);
                          setBusyType('default');
                          onClose();
                        }}
                      >
                        1 hour
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setBusySince(Date.now());
                          setBusyUntil(undefined);
                          setBusyType('default');
                          onClose();
                        }}
                      >
                        Until I&apos;m back
                      </MenuItem>
                    </MenuList>
                  </Paper>
                );
              }}
            >
              {({ anchorAttributes, open }) => {
                return (
                  <S.TimeLeftWrapper {...anchorAttributes}>
                    <S.StyledTimeLeft until={busyUntil} />
                  </S.TimeLeftWrapper>
                );
              }}
            </PopupTrigger>
          )}
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
