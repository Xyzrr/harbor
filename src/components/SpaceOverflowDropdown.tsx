import * as S from './SpaceOverflowDropdown.styles';
import React from 'react';
import Icon from '../elements/Icon';
import PopupTrigger from '../elements/PopupTrigger';
import { MenuItem, MenuList, Paper } from '@material-ui/core';

export interface SpaceOverflowDropdownProps {
  className?: string;
}

const SpaceOverflowDropdown: React.FC<SpaceOverflowDropdownProps> = ({
  className,
}) => {
  return (
    <>
      <PopupTrigger
        anchorOrigin="bottom right"
        transformOrigin="top right"
        popupContent={() => {
          return (
            <Paper>
              <MenuList dense variant="menu">
                <PopupTrigger
                  anchorOrigin="top right"
                  transformOrigin="top left"
                  popupContent={() => {
                    return (
                      <Paper>
                        <MenuList dense variant="menu">
                          <MenuItem>Hello world</MenuItem>
                        </MenuList>
                      </Paper>
                    );
                  }}
                >
                  {({ anchorAttributes, open }) => {
                    return <MenuItem {...anchorAttributes}>Busy mode</MenuItem>;
                  }}
                </PopupTrigger>
              </MenuList>
            </Paper>
          );
        }}
      >
        {({ anchorAttributes, open }) => {
          return (
            <S.Wrapper className={className} {...anchorAttributes}>
              <Icon name="more_vert" />
            </S.Wrapper>
          );
        }}
      </PopupTrigger>
    </>
  );
};

export default SpaceOverflowDropdown;
