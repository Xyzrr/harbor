import * as S from './SpaceOverflowDropdown.styles';
import React from 'react';
import Icon from '../elements/Icon';
import PopupTrigger from '../elements/PopupTrigger';
import { MenuItem, MenuList, Paper } from '@material-ui/core';
import { PlayerStateContext } from '../contexts/PlayerStateContext';

export interface SpaceOverflowDropdownProps {
  className?: string;
}

const SpaceOverflowDropdown: React.FC<SpaceOverflowDropdownProps> = ({
  className,
}) => {
  const { setBusySince, setBusyUntil, setBusyType } =
    React.useContext(PlayerStateContext);

  return (
    <>
      <PopupTrigger
        anchorOrigin="bottom right"
        transformOrigin="top right"
        popupContent={({ onClose }) => {
          return (
            <Paper>
              <MenuList dense variant="menu">
                <PopupTrigger
                  on="hover"
                  anchorOrigin="top right"
                  transformOrigin="top left"
                  yOffset={-8}
                  popupContent={() => {
                    return (
                      <Paper>
                        <MenuList dense variant="menu">
                          <S.MenuTitle disabled style={{ fontSize: 14 }}>
                            Disable communication for...
                          </S.MenuTitle>
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
                      <MenuItem {...anchorAttributes}>
                        <S.MenuIcon name="event_busy" />
                        Busy mode <S.Arrow />
                      </MenuItem>
                    );
                  }}
                </PopupTrigger>
              </MenuList>
            </Paper>
          );
        }}
      >
        {({ anchorAttributes, open }) => {
          return (
            <S.Wrapper className={className} {...anchorAttributes} open={open}>
              <Icon name="more_vert" />
            </S.Wrapper>
          );
        }}
      </PopupTrigger>
    </>
  );
};

export default SpaceOverflowDropdown;
