import React from 'react';
import { ipcRenderer } from 'electron';
import { PlayerStateContext } from './PlayerStateContext';

interface LocalMediaContextValue {
  localVideoInputOn: boolean;
  setLocalVideoInputOn(on: boolean): void;
  localVideoInputDeviceId?: string;
  setLocalVideoInputDeviceId(id: string): void;
  localVideoTrack?: MediaStreamTrack;
  localAudioInputOn: boolean;
  setLocalAudioInputOn(on: boolean): void;
  localAudioInputDeviceId: string;
  setLocalAudioInputDeviceId(id: string): void;
  localAudioTrack?: MediaStreamTrack;
  localAudioOutputOn: boolean;
  setLocalAudioOutputOn(on: boolean): void;
  localAudioOutputDeviceId: string;
  setLocalAudioOutputDeviceId(id: string): void;
  localScreenShareOn: boolean;
  setLocalScreenShareOn(on: boolean): void;
  localScreenShareSourceId?: string;
  setLocalScreenShareSourceId(id: string): void;
}

export const LocalMediaContext = React.createContext<LocalMediaContextValue>(
  null!
);

export const LocalMediaContextProvider: React.FC = ({ children }) => {
  const [localVideoInputOn, setLocalVideoInputOn] = React.useState(false);
  const [localVideoInputDeviceId, setLocalVideoInputDeviceId] =
    React.useState<string | undefined>();
  const [localVideoTrack, setLocalVideoTrack] =
    React.useState<MediaStreamTrack | undefined>();

  const { busyType } = React.useContext(PlayerStateContext);

  const [localAudioInputOn, setLocalAudioInputOn] = React.useState(
    !process.env.NO_AUDIO
  );
  const [localAudioInputDeviceId, setLocalAudioInputDeviceId] =
    React.useState('default');
  const [localAudioTrack, setLocalAudioTrack] =
    React.useState<MediaStreamTrack | undefined>();

  const [
    localAudioInputDeviceIdToGroupId,
    setLocalAudioInputDeviceIdToGroupId,
  ] = React.useState<Map<string, string> | undefined>();
  React.useEffect(() => {
    const updateGroupIdMapping = async () => {
      const audioInputDevices = (
        await navigator.mediaDevices.enumerateDevices()
      ).filter((d) => d.kind === 'audioinput');
      setLocalAudioInputDeviceIdToGroupId(
        new Map(audioInputDevices.map((d) => [d.deviceId, d.groupId]))
      );
    };

    navigator.mediaDevices.addEventListener(
      'devicechange',
      updateGroupIdMapping
    );
    updateGroupIdMapping();

    return () => {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        updateGroupIdMapping
      );
    };
  }, []);

  const localAudioInputGroupId = localAudioInputDeviceIdToGroupId?.get(
    localAudioInputDeviceId
  );

  const [localAudioOutputOn, setLocalAudioOutputOn] = React.useState(
    !process.env.NO_AUDIO
  );
  const [localAudioOutputDeviceId, setLocalAudioOutputDeviceId] =
    React.useState('default');

  const [localScreenShareOn, setLocalScreenShareOn] = React.useState(false);
  const [localScreenShareSourceId, setLocalScreenShareSourceId] =
    React.useState<string | undefined>();

  React.useEffect(() => {
    (async () => {
      if (!localVideoInputOn || busyType) {
        setLocalVideoTrack(undefined);
        return;
      }

      const mediaStream = await window.navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: 1920,
          height: 1080,
          deviceId: localVideoInputDeviceId,
        },
      });

      const videoTrack = mediaStream.getVideoTracks()[0];
      setLocalVideoTrack(videoTrack);
    })();
  }, [localVideoInputOn, localVideoInputDeviceId, busyType]);

  React.useEffect(() => {
    (async () => {
      if (!localAudioInputOn || busyType) {
        setLocalAudioTrack(undefined);
        return;
      }

      if (localAudioInputGroupId == null) {
        return;
      }

      const mediaStream = await window.navigator.mediaDevices.getUserMedia({
        audio: { groupId: localAudioInputGroupId },
        video: false,
      });

      const audioTrack = mediaStream.getAudioTracks()[0];
      setLocalAudioTrack(audioTrack);
    })();
  }, [localAudioInputOn, localAudioInputGroupId, busyType]);

  React.useEffect(() => {
    ipcRenderer.send('media-settings', {
      localAudioInputOn,
      localVideoInputOn,
    });
  }, [localAudioInputOn, localVideoInputOn]);

  /**
   * Cleanup after unmount
   */

  React.useEffect(() => {
    return () => {
      localVideoTrack?.stop();
    };
  }, [localVideoTrack]);

  React.useEffect(() => {
    return () => {
      localAudioTrack?.stop();
    };
  }, [localAudioTrack]);

  return (
    <LocalMediaContext.Provider
      value={{
        localVideoInputOn,
        setLocalVideoInputOn,
        localVideoInputDeviceId,
        setLocalVideoInputDeviceId,
        localVideoTrack,
        localAudioInputOn,
        setLocalAudioInputOn,
        localAudioTrack,
        localAudioOutputDeviceId,
        setLocalAudioOutputDeviceId,
        localAudioOutputOn,
        setLocalAudioOutputOn,
        localAudioInputDeviceId,
        setLocalAudioInputDeviceId,
        localScreenShareOn,
        setLocalScreenShareOn,
        localScreenShareSourceId,
        setLocalScreenShareSourceId,
      }}
    >
      {children}
    </LocalMediaContext.Provider>
  );
};
