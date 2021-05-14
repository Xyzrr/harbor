import * as S from './AudioInputControl.styles';
import React from 'react';
import { LocalMediaContext } from '../../contexts/LocalMediaContext';
import circleButtonWithOptions from '../masks/circleButtonWithOptions.svg';
import VolumeIndicator from './VolumeIndicator';
import HiddenSelect from '../../elements/HiddenSelect';
import { useVolume } from '../../hooks/useVolume';
import Icon from '../../elements/Icon';

export interface AudioInputControlProps {
  className?: string;
  minimized?: boolean;
}

const AudioInputControl: React.FC<AudioInputControlProps> = ({
  className,
  minimized,
}) => {
  const [mediaDevices, setMediaDevices] = React.useState<MediaDeviceInfo[]>([]);

  const recentlyLoudTimerRef = React.useRef<number | null>(null);

  const {
    localAudioInputOn,
    setLocalAudioInputOn,
    localAudioTrack,
    localAudioInputDeviceId,
    setLocalAudioInputDeviceId,
  } = React.useContext(LocalMediaContext);

  React.useEffect(() => {
    const updateDevices = () => {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setMediaDevices(devices.filter((d) => d.kind === 'audioinput'));
      });
    };

    navigator.mediaDevices.addEventListener('ondevicechange', updateDevices);
    updateDevices();

    return () => {
      navigator.mediaDevices.removeEventListener(
        'ondevicechange',
        updateDevices
      );
    };
  }, []);

  const [recentlyLoud, setRecentlyLoud] = React.useState(false);
  const [volume, setVolume] = React.useState(0);

  useVolume(localAudioTrack, (v) => {
    setVolume(v);
    if (v > 0.15) {
      if (recentlyLoudTimerRef.current != null) {
        window.clearTimeout(recentlyLoudTimerRef.current);
        recentlyLoudTimerRef.current = null;
      }

      setRecentlyLoud(true);

      recentlyLoudTimerRef.current = window.setTimeout(() => {
        setRecentlyLoud(false);
        recentlyLoudTimerRef.current = null;
      }, 500);
    }
  });

  return (
    <S.Wrapper
      className={className}
      color={localAudioInputOn ? undefined : 'danger'}
    >
      <S.PrimaryButtonWrapper
        onClick={() => {
          setLocalAudioInputOn(!localAudioInputOn);
        }}
      >
        {localAudioInputOn ? (
          <VolumeIndicator volume={volume} />
        ) : (
          <Icon name="mic_off" />
        )}
      </S.PrimaryButtonWrapper>
      {!minimized && (
        <S.CaretButtonWrapper>
          <S.CaretButton />
          <HiddenSelect
            onChange={(e) => {
              const { value } = e.target;
              setLocalAudioInputDeviceId(value);
            }}
            value={
              localAudioInputDeviceId || localAudioTrack?.getSettings().deviceId
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
  );
};

export default AudioInputControl;
