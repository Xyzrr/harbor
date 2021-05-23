import React from 'react';
import { ipcRenderer } from 'electron';

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

  const videoTrackPromiseRef = React.useRef<Promise<MediaStream> | null>(null);
  React.useEffect(() => {
    if (!localVideoInputOn) {
      videoTrackPromiseRef.current = null;
      if (localVideoTrack) {
        localVideoTrack.stop();
        setLocalVideoTrack(undefined);
      }
      return;
    }

    if (localVideoTrack) {
      localVideoTrack.stop();
    }

    (async () => {
      const videoTrackPromise = window.navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: 1920,
          height: 1080,
          deviceId: localVideoInputDeviceId,
        },
      });
      videoTrackPromiseRef.current = videoTrackPromise;
      const mediaStream = await videoTrackPromise;

      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrackPromise === videoTrackPromiseRef.current) {
        setLocalVideoTrack(videoTrack);
      } else {
        videoTrack.stop();
      }
    })();
  }, [localVideoInputOn, localVideoInputDeviceId]);

  const audioTrackPromiseRef = React.useRef<Promise<MediaStream> | null>(null);
  React.useEffect(() => {
    if (!localAudioInputOn) {
      audioTrackPromiseRef.current = null;
      if (localAudioTrack) {
        localAudioTrack.stop();
        setLocalAudioTrack(undefined);
      }
      return;
    }

    if (localAudioTrack) {
      localAudioTrack.stop();
    }

    (async () => {
      if (localAudioInputGroupId == null) {
        return;
      }

      const audioTrackPromise = window.navigator.mediaDevices.getUserMedia({
        audio: { groupId: localAudioInputGroupId },
        video: false,
      });
      audioTrackPromiseRef.current = audioTrackPromise;
      const mediaStream = await audioTrackPromise;

      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrackPromise === audioTrackPromiseRef.current) {
        setLocalAudioTrack(audioTrack);
      } else {
        audioTrack.stop();
      }
    })();
  }, [localAudioInputOn, localAudioInputGroupId]);

  React.useEffect(() => {
    ipcRenderer.send('media-settings', {
      localAudioInputOn,
      localVideoInputOn,
    });
  }, [localAudioInputOn, localVideoInputOn]);

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
