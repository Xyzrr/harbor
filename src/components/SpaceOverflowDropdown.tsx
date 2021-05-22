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
                  on="hover"
                  anchorOrigin="top right"
                  transformOrigin="top left"
                  popupContent={() => {
                    return (
                      <Paper>
                        <MenuList dense variant="menu">
                          <MenuItem disabled>
                            Disable communication for...
                          </MenuItem>
                          <MenuItem>10 minutes</MenuItem>
                          <MenuItem>30 minutes</MenuItem>
                          <MenuItem>1 hour</MenuItem>
                          <MenuItem>Until I&apos;m back</MenuItem>
                        </MenuList>
                      </Paper>
                    );
                  }}
                >
                  {({ anchorAttributes, open }) => {
                    return (
                      <MenuItem {...anchorAttributes}>
                        Busy mode <Icon name="arrow_right" />
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
