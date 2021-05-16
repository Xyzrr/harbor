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
import { UserSettingsContext } from '../contexts/UserSettingsContext';
import { PlayerStateContext } from '../contexts/PlayerStateContext';
import NewWindow from '../elements/NewWindow';

export interface NearbyPlayer {
  sid?: string;
  name: string;
  distance: number;
  audioInputOn?: boolean;
  audioOutputOn?: boolean;
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
}

const RemoteUserPanel: React.FC<RemoteUserPanelProps> = React.memo(
  ({ className, identity, player, videoTrack, audioTrack, whisperTarget }) => {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const [videoEl, setVideoEl] = React.useState<HTMLVideoElement | null>();
    const [audioEl, setaAudioEl] = React.useState<HTMLAudioElement | null>();
    const [recentlyLoud, setRecentlyLoud] = React.useState(false);
    const recentlyLoudTimerRef = React.useRef<number | null>(null);
    const [videoStreaming, setVideoStreaming] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [containerEl, setContainerEl] =
      React.useState<HTMLDivElement | null>(null);
    const [fakeContainerEl, setFakeContainerEl] =
      React.useState<HTMLDivElement | null>(null);

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
      if (videoEl && videoTrack) {
        videoEl.srcObject = new MediaStream([videoTrack]);
      }
    }, [videoEl]);

    React.useEffect(() => {
      if (videoEl && audioTrack) {
        videoEl.srcObject = new MediaStream([audioTrack]);
      }
    }, [audioEl]);

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
      if (!audioEl) {
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
    }, [localAudioOutputDeviceId, audioEl]);

    const { localIdentity } = React.useContext(UserSettingsContext);

    const { localWhisperingTo, setLocalWhisperingTo } =
      React.useContext(PlayerStateContext);

    React.useEffect(() => {
      if (!audioEl) {
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
      audioEl,
    ]);

    const mouseIsIdle = useMouseIsIdle({ containerRef: wrapperRef });

    const content = (
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
            ref={(node) => setVideoEl(node)}
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
        {player.audioInputOn && audioTrack && (
          <audio ref={(node) => setaAudioEl(node)} autoPlay />
        )}
        <S.InfoBar>
          <S.InfoBarLeft>
            <S.StatusIcons>
              {!player.audioInputOn && <S.StatusIcon name="mic_off" />}
              {!player.audioOutputOn && <S.StatusIcon name="volume_off" />}
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
              setExpanded(!expanded);
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

    if (expanded) {
      return <NewWindow name="remote-user-panel">{content}</NewWindow>;
    }

    return content;
  }
);

export default RemoteUserPanel;
