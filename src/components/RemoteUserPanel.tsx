import * as S from './RemoteUserPanel.styles';
import * as HoverMenuStyles from './HoverMenu.styles';

import React, { useContext } from 'react';
import { useVolume } from '../hooks/useVolume';
import { LocalMediaContext } from '../contexts/LocalMediaContext';
import HoverMenu from './HoverMenu';
import { useMouseIsIdle } from '../hooks/useMouseIsIdle';
import { MAX_INTERACTION_DISTANCE } from '../constants';
import { AppInfo } from '../hooks/useAppTracker';
import AppIndicator from './AppIndicator';
import Loader from '../elements/Loader';
import { LocalInfoContext } from '../contexts/LocalInfoContext';

export interface NearbyPlayer {
  sid?: string;
  name: string;
  distance: number;
  audioInputOn?: boolean;
  videoInputOn?: boolean;
  screenShareOn?: boolean;
  sharedApp?: AppInfo;
  whisperingTo?: string;
}

export interface RemoteUserPanelProps {
  className?: string;
  identity: string;
  videoTrack?: MediaStreamTrack;
  audioTrack?: MediaStreamTrack;
  whisperTarget?: boolean;

  player: NearbyPlayer;

  expanded?: boolean;
  onSetExpanded(value: boolean): void;
}

const RemoteUserPanel: React.FC<RemoteUserPanelProps> = React.memo(
  ({
    className,
    identity,
    player,
    videoTrack,
    audioTrack,
    whisperTarget,
    expanded,
    onSetExpanded,
  }) => {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const [recentlyLoud, setRecentlyLoud] = React.useState(false);
    const recentlyLoudTimerRef = React.useRef<number | null>(null);
    const [videoStreaming, setVideoStreaming] = React.useState(false);

    const { localAudioOutputDeviceId, localAudioOutputOn } =
      useContext(LocalMediaContext);

    const scale = Math.min(
      1,
      MAX_INTERACTION_DISTANCE / 2 / (player.distance + 0.1)
    );
    const volumeMultiplier = scale ** 2;

    const width = Math.floor(240 * scale);
    const height = Math.floor(135 * scale);

    React.useEffect(() => {
      if (videoRef.current && videoTrack) {
        videoRef.current.srcObject = new MediaStream([videoTrack]);
      }
    }, [videoTrack]);

    React.useEffect(() => {
      if (audioRef.current && audioTrack) {
        audioRef.current.srcObject = new MediaStream([audioTrack]);
      }
    }, [audioTrack]);

    React.useEffect(() => {
      if (!videoTrack) {
        setVideoStreaming(false);
      }
    }, [videoTrack]);

    useVolume(audioTrack, (v) => {
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

    React.useEffect(() => {
      const audioEl = audioRef.current;
      if (audioEl == null) {
        return;
      }

      (audioEl as any)
        .setSinkId(localAudioOutputDeviceId)
        .then(() => {
          console.log('Set sink ID to', localAudioOutputDeviceId);
        })
        .catch((e: any) => {
          console.log('Failed to set sink ID:', e);
        });
    }, [localAudioOutputDeviceId]);

    const { localIdentity, localWhisperingTo, setLocalWhisperingTo } =
      React.useContext(LocalInfoContext);

    React.useEffect(() => {
      const audioEl = audioRef.current;
      if (audioEl == null) {
        return;
      }

      let vol = localAudioOutputOn ? volumeMultiplier : 0;
      if (player.whisperingTo && player.whisperingTo !== localIdentity) {
        vol = 0;
      }
      audioEl.volume = vol;
    }, [
      volumeMultiplier,
      localAudioOutputOn,
      player,
      audioTrack,
      localIdentity,
    ]);

    const mouseIsIdle = useMouseIsIdle({ containerRef: wrapperRef });

    return (
      <S.Wrapper
        className={className}
        ref={wrapperRef}
        recentlyLoud={recentlyLoud}
        noVideo={!player.videoInputOn}
        whisperTarget={localWhisperingTo === identity}
        backgrounded={
          localWhisperingTo != null && localWhisperingTo !== identity
        }
        style={{ width, height }}
      >
        {player.videoInputOn && videoTrack && (
          <video
            ref={videoRef}
            onCanPlay={() => {
              setVideoStreaming(true);
            }}
            onEmptied={() => {
              setVideoStreaming(false);
            }}
            autoPlay
          />
        )}
        {player.videoInputOn && !videoStreaming && <Loader />}
        {player.audioInputOn && audioTrack && <audio ref={audioRef} autoPlay />}
        <S.InfoBar>
          <S.InfoBarLeft>
            <S.StatusIcons>
              {!player.audioInputOn && <S.StatusIcon name="mic_off" />}
            </S.StatusIcons>
            <S.Name>{player.name}</S.Name>
          </S.InfoBarLeft>
          {player.sharedApp != null && (
            <AppIndicator appInfo={player.sharedApp} />
          )}
        </S.InfoBar>
        <HoverMenu hidden={mouseIsIdle}>
          <HoverMenuStyles.MenuItem
            name={expanded ? 'fullscreen_exit' : 'fullscreen'}
            onClick={() => {
              onSetExpanded(!expanded);
            }}
          />
          <HoverMenuStyles.MenuItem
            name={whisperTarget ? 'hearing_disabled' : 'hearing'}
            onClick={() => {
              if (whisperTarget) {
                setLocalWhisperingTo(undefined);
              } else {
                setLocalWhisperingTo(identity);
              }
            }}
          />
        </HoverMenu>
      </S.Wrapper>
    );
  }
);

export default RemoteUserPanel;
