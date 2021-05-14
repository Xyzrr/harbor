import * as S from './Home.styles';
import React from 'react';
import { ipcRenderer } from 'electron';
import { Redirect, useHistory } from 'react-router-dom';
import firebase from 'firebase';
import PopupTrigger from '../elements/PopupTrigger';
import { MenuItem, MenuList, Paper } from '@material-ui/core';
import { FirebaseContext } from '../contexts/FirebaseContext';
import useSpaces from '../hooks/useSpaces';
import Space from '../components/Space';
import NewWindow from '../elements/NewWindow';

export interface HomeProps {
  className?: string;
}

const Home: React.FC<HomeProps> = ({ className }) => {
  const { app: firebaseApp, user } = React.useContext(FirebaseContext);

  React.useEffect(() => {
    ipcRenderer.send('setWindowSize', { width: 720, height: 480 });
  }, []);

  const history = useHistory();
  const { spaces, error } = useSpaces();
  const [currentSpaceId, setCurrentSpaceId] =
    React.useState<string | null>(null);

  // TODO: This is meant to enable upgrading from an anonymous account to
  // a permanent one, it turns out I need to build a custom auth UI to actually
  // get that working.
  React.useEffect(() => {
    const onOpenUrl = async (event: Electron.IpcRendererEvent, url: string) => {
      ipcRenderer.send('clearUrl');
      const hasCredential = url.substr(0, 20).includes('credential');
      console.log('OPENED WITH URL:', url);
      if (hasCredential && user?.isAnonymous) {
        console.log('FOUND CREDENTIAL');
        const encodedCredential = url.split('=')[1];
        const credentialJSON = JSON.parse(
          decodeURIComponent(encodedCredential)
        );
        const credential =
          firebase.auth.AuthCredential.fromJSON(credentialJSON);
        console.log('TRYING CREDENTIAL:', credential);

        if (credential == null) {
          return;
        }

        let u: firebase.auth.UserCredential;
        try {
          u = await user.linkWithCredential(credential);
        } catch (e) {
          console.log('Failed to link with credential', e);
        }
      }
    };

    ipcRenderer.on('openUrl', onOpenUrl);

    return () => {
      ipcRenderer.off('openUrl', onOpenUrl);
    };
  }, [user]);

  if (!user) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <S.Wrapper className={className}>
        <S.TopBar>
          <S.Heading>Spaces</S.Heading>
          {user.isAnonymous ? (
            // TODO: This should instead open a URL to start the upgrade path.
            <S.GuestSignInButton
              onClick={async () => {
                await firebaseApp.auth().signOut();
                history.push('/');
              }}
            >
              Sign in
            </S.GuestSignInButton>
          ) : (
            <PopupTrigger
              anchorOrigin="bottom right"
              transformOrigin="top right"
              popupContent={() => {
                return (
                  <Paper>
                    <MenuList dense variant="menu">
                      <MenuItem>Profile</MenuItem>
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
                    <S.UserName>{user.displayName}</S.UserName>
                    <S.StyledUserAvatar
                      photoUrl={user.photoURL || undefined}
                      userName={user.displayName || undefined}
                    />
                  </S.UserInfo>
                );
              }}
            </PopupTrigger>
          )}
        </S.TopBar>
        <S.Spaces>
          {spaces &&
            spaces.map((space) => {
              return (
                <S.Space
                  key={space.metadata.spaceId}
                  active={currentSpaceId === space.metadata.spaceId}
                  onClick={() => {
                    setCurrentSpaceId(space.metadata.spaceId);
                  }}
                >
                  <S.SpaceName>{space.metadata.spaceName}</S.SpaceName>
                  {space.clients > 0 && (
                    <S.SpaceActivity>
                      <S.GreenDot />
                      {space.clients} user{space.clients === 1 ? '' : 's'}{' '}
                      online
                    </S.SpaceActivity>
                  )}
                </S.Space>
              );
            })}
          <S.CreateSpace>
            <S.CreateSpaceTitle>Create new space</S.CreateSpaceTitle>
            <S.CreateSpaceSubTitle>Coming soon!</S.CreateSpaceSubTitle>
          </S.CreateSpace>
        </S.Spaces>
      </S.Wrapper>
      {currentSpaceId != null && (
        <NewWindow name="space">
          <Space
            key={currentSpaceId}
            spaceId={currentSpaceId}
            onExit={() => {
              setCurrentSpaceId(null);
            }}
          />
        </NewWindow>
      )}
    </>
  );
};

export default Home;
