import * as S from './ScreenShareControl.styles';
import React from 'react';
import { LocalMediaContext } from '../../contexts/LocalMediaContext';
import Icon from '../../elements/Icon';
import { ipcRenderer } from 'electron';
import PermissionHelperWindow from './PermissionHelperWindow';
import ScreenSharePicker from './ScreenSharePicker';
import ScreenShareToolbar from './ScreenShareToolbar';
import ScreenShareOverlay from './ScreenShareOverlay';

export interface VideoInputControlProps {
  className?: string;
  minimized?: boolean;
}

const VideoInputControl: React.FC<VideoInputControlProps> = ({
  className,
  minimized,
}) => {
  const [screenSharePickerOpen, setScreenSharePickerOpen] =
    React.useState(false);
  const [screenPermissionHelperOpen, setScreenPermissionHelperOpen] =
    React.useState(false);

  const {
    localScreenShareOn,
    setLocalScreenShareOn,
    setLocalScreenShareSourceId,
  } = React.useContext(LocalMediaContext);

  return (
    <>
      <S.Wrapper
        className={className}
        color={localScreenShareOn ? 'highlight' : undefined}
      >
        <S.PrimaryButtonWrapper
          onClick={async () => {
            if (localScreenShareOn) {
              setLocalScreenShareOn(false);
              return;
            }
            if (!screenSharePickerOpen) {
              const screenAccess = await ipcRenderer.invoke(
                'getMediaAccessStatus',
                'screen'
              );
              if (screenAccess === 'granted') {
                setScreenSharePickerOpen(true);
              } else {
                setScreenPermissionHelperOpen(true);
              }
            } else {
              setScreenSharePickerOpen(false);
            }
          }}
        >
          <Icon
            name={localScreenShareOn ? 'stop_screen_share' : 'screen_share'}
          />
        </S.PrimaryButtonWrapper>
      </S.Wrapper>
      {screenPermissionHelperOpen && (
        <PermissionHelperWindow
          onClose={() => {
            setScreenPermissionHelperOpen(false);
          }}
          onGranted={() => {
            setScreenPermissionHelperOpen(false);
            setScreenSharePickerOpen(true);
          }}
        />
      )}
      {screenSharePickerOpen && (
        <ScreenSharePicker
          onClose={() => {
            setScreenSharePickerOpen(false);
          }}
          onStart={(id) => {
            console.log('Started sharing screen', id);
            setScreenSharePickerOpen(false);
            setLocalScreenShareSourceId(id);
            setLocalScreenShareOn(true);
          }}
        />
      )}
      {localScreenShareOn && (
        <>
          <ScreenShareToolbar />
          <ScreenShareOverlay />
        </>
      )}
    </>
  );
};

export default VideoInputControl;
