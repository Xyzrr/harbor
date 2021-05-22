import React from 'react';

export interface VideoCallParticipant {
  serverId: string;
  audioTrack?: MediaStreamTrack;
  videoTrack?: MediaStreamTrack;
  screenVideoTrack?: MediaStreamTrack;
  screenAudioTrack?: MediaStreamTrack;
}

export interface VideoCallContextValue {
  participants: {
    [identity: string]: VideoCallParticipant;
  };
}

export const VideoCallContext = React.createContext<VideoCallContextValue>(
  null!
);

export type VideoCallDebugContextValue = {
  [key: string]: string | number | boolean | MediaStreamTrack | undefined;
} | null;

export const VideoCallDebugContext =
  React.createContext<VideoCallDebugContextValue>(null);
