import * as S from './VideoInputControl.styles';
import React from 'react';
import circleButtonWithOptions from '../masks/circleButtonWithOptions.svg';
import HiddenSelect from '../../elements/HiddenSelect';
import { LocalMediaContext } from '../../contexts/LocalMediaContext';
import Icon from '../../elements/Icon';
import NewWindow from '../../elements/NewWindow';
import LocalVideoPreview from '../LocalVideoPreview';
import { ipcRenderer } from 'electron';

export interface VideoInputControlProps {
  className?: string;
  minimized?: boolean;
  showPreviewOnHover?: boolean;
}

const VideoInputControl: React.FC<VideoInputControlProps> = ({
  className,
  minimized,
  showPreviewOnHover,
}) => {
  const [mediaDevices, setMediaDevices] = React.useState<MediaDeviceInfo[]>([]);

  const {
    localVideoInputOn,
    setLocalVideoInputOn,
    localVideoTrack,
    localVideoInputDeviceId,
    setLocalVideoInputDeviceId,
  } = React.useContext(LocalMediaContext);

  React.useEffect(() => {
    const updateDevices = () => {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setMediaDevices(devices.filter((d) => d.kind === 'videoinput'));
      });
    };

    navigator.mediaDevices.addEventListener('devicechange', updateDevices);
    updateDevices();

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', updateDevices);
    };
  }, []);

  const [hovering, setHovering] = React.useState(false);

  React.useEffect(() => {
    const onToggle = () => {
      setLocalVideoInputOn((o) => !o);
    };

    ipcRenderer.on('toggleLocalVideoInput', onToggle);

    return () => {
      ipcRenderer.off('toggleLocalVideoInput', onToggle);
    };
  }, [setLocalVideoInputOn]);

  return (
    <>
      <S.Wrapper
        className={className}
        color={localVideoInputOn ? undefined : 'danger'}
      >
        <S.PrimaryButtonWrapper
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={() => {
            setLocalVideoInputOn(!localVideoInputOn);
          }}
        >
          <Icon name={localVideoInputOn ? 'videocam' : 'videocam_off'} />
        </S.PrimaryButtonWrapper>
        {!minimized && (
          <S.CaretButtonWrapper>
            <S.CaretButton />
            <HiddenSelect
              onChange={(e) => {
                const { value } = e.target;
                setLocalVideoInputDeviceId(value);
              }}
              value={
                localVideoInputDeviceId ||
                localVideoTrack?.getSettings().deviceId
              }
            >
              {mediaDevices.map((device) => {
                return (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                );
              })}
            </HiddenSelect>
          </S.CaretButtonWrapper>
        )}
      </S.Wrapper>
      {showPreviewOnHover && hovering && localVideoInputOn && (
        <NewWindow name="local-video-preview">
          <LocalVideoPreview />
        </NewWindow>
      )}
    </>
  );
};

export default VideoInputControl;
