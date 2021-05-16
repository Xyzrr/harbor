import * as S from './UserDropdown.styles';
import React from 'react';
import { MenuItem, MenuList, Paper } from '@material-ui/core';
import PopupTrigger from '../elements/PopupTrigger';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { useHistory } from 'react-router-dom';
import { UserSettingsContext } from '../contexts/UserSettingsContext';
import NewWindow from '../elements/NewWindow';
import Profile from './Profile';

export interface UserDropdownProps {
  className?: string;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ className }) => {
  const { app: firebaseApp } = React.useContext(FirebaseContext);
  const { localName, localPhotoUrl } = React.useContext(UserSettingsContext);
  const history = useHistory();
  const [showProfile, setShowProfile] = React.useState(false);

  return (
    <>
      <PopupTrigger
        anchorOrigin="bottom right"
        transformOrigin="top right"
        popupContent={() => {
          return (
            <Paper>
              <MenuList dense variant="menu">
                <MenuItem onClick={() => setShowProfile(true)}>
                  Profile
                </MenuItem>
                <MenuItem>Account settings</MenuItem>
                <MenuItem
                  onClick={async () => {
                    await firebaseApp.auth().signOut();
                    history.push('/');
                  }}
                >
                  Sign out
                </MenuItem>
              </MenuList>
            </Paper>
          );
        }}
      >
        {({ anchorAttributes, open }) => {
          return (
            <S.UserInfo {...anchorAttributes} open={open}>
              <S.UserName>{localName}</S.UserName>
              <S.StyledUserAvatar
                photoUrl={localPhotoUrl || undefined}
                userName={localName}
              />
            </S.UserInfo>
          );
        }}
      </PopupTrigger>
      {showProfile && (
        <NewWindow name="profile" onClose={() => setShowProfile(false)}>
          <Profile />
        </NewWindow>
      )}
    </>
  );
};

export default UserDropdown;
