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
import { PlayerStateContext, BusyType } from '../contexts/PlayerStateContext';
import NewWindow from '../elements/NewWindow';
import { useWindowsDrag } from '../hooks/useWindowsDrag';

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
  busyType?: BusyType;
  busyUntil?: number;
  idleTime: number;
}

export interface RemoteUserPanelInnerProps {
  className?: string;
  identity: string;
  videoTrack?: MediaStreamTrack;
  audioTrack?: MediaStreamTrack;
  whisperTarget?: boolean;

  player: NearbyPlayer;

  expanded?: boolean;
  setExpanded(expanded: boolean): void;
}

const RemoteUserPanelInner: React.FC<RemoteUserPanelInnerProps> = React.memo(
  function RemoteUserPanelInner({
    className,
    identity,
    player,
    videoTrack,
    audioTrack,
    whisperTarget,
    expanded,
    setExpanded,
  }) {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const [videoEl, setVideoEl] = React.useState<HTMLVideoElement | null>();
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const [recentlyLoud, setRecentlyLoud] = React.useState(false);
    const recentlyLoudTimerRef = React.useRef<number | null>(null);
    const [videoStreaming, setVideoStreaming] = React.useState(false);

    const { localAudioOutputDeviceId, localAudioOutputOn } =
      useContext(LocalMediaContext);

    const { localIdentity } = React.useContext(UserSettingsContext);
    const whisperingToSomeoneElse =
      player.whisperingTo && player.whisperingTo !== localIdentity;

    const scale = Math.min(
      1,
      MAX_INTERACTION_DISTANCE / 2 / (player.distance + 0.1)
    );
    const volumeMultiplier = scale ** 2;

    const width = expanded ? '100%' : Math.floor(240 * scale);
    const height = expanded
      ? '100%'
      : player.videoInputOn && !player.busyType && !whisperingToSomeoneElse
      ? Math.floor(135 * scale)
      : 40;

    React.useEffect(() => {
      if (videoEl && videoTrack) {
        videoEl.srcObject = new MediaStream([videoTrack]);
      }
    }, [videoEl, videoTrack]);

    React.useEffect(() => {
      const audioEl = audioRef.current;
      if (audioEl == null || audioTrack == null) {
        return;
      }

      audioEl.srcObject = new MediaStream([audioTrack]);
      (audioEl as any)
        .setSinkId(localAudioOutputDeviceId)
        .then(() => {
          console.log('Set sink ID to', localAudioOutputDeviceId);
        })
        .catch((e: any) => {
          console.log('Failed to set sink ID:', e);
        });
    }, [audioTrack, localAudioOutputDeviceId]);

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

    const { localWhisperingTo, setLocalWhisperingTo } =
      React.useContext(PlayerStateContext);

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

    const windowsDragProps = useWindowsDrag();

    const shouldHaveVideo =
      player.videoInputOn && !player.busyType && !whisperingToSomeoneElse;

    return (
      <S.Wrapper
        className={className}
        ref={wrapperRef}
        recentlyLoud={recentlyLoud && !whisperingToSomeoneElse}
        noVideo={!shouldHaveVideo}
        whisperTarget={localWhisperingTo === identity}
        whisperSource={player.whisperingTo === localIdentity}
        backgrounded={
          localWhisperingTo != null && localWhisperingTo !== identity
        }
        style={{ width, height }}
        {...windowsDragProps}
      >
        {shouldHaveVideo && videoTrack && (
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
        {player.videoInputOn && !player.busyType && !videoStreaming && (
          <Loader />
        )}
        <audio ref={audioRef} autoPlay />
        <S.InfoBar>
          <S.InfoBarLeft>
            {!player.busyType && (
              <>
                {whisperingToSomeoneElse && <S.StatusIcon name="hearing" />}
                {!player.audioInputOn && <S.StatusIcon name="mic_off" />}
                {!player.audioOutputOn && <S.StatusIcon name="volume_off" />}
              </>
            )}
            <S.Name>{player.name}</S.Name>
          </S.InfoBarLeft>
          <S.InfoBarRight>
            {player.busyUntil && <S.BusyTimeLeft until={player.busyUntil} />}
            {player.busyType && (
              <S.BusyIcon
                name="event_busy"
                style={{ opacity: 5 / (5 + player.idleTime) }}
              />
            )}
            {!player.busyType && <S.IdleTimeIndicator />}
            {!player.busyType && player.sharedApp != null && (
              <AppIndicator appInfo={player.sharedApp} />
            )}
          </S.InfoBarRight>
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
            style={whisperTarget ? { color: 'yellow' } : undefined}
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

export interface RemoteUserPanelProps {
  className?: string;
  identity: string;
  videoTrack?: MediaStreamTrack;
  audioTrack?: MediaStreamTrack;
  whisperTarget?: boolean;
  player: NearbyPlayer;
}

const RemoteUserPanel: React.FC<RemoteUserPanelProps> = React.memo(
  function RemoteUserPanel(props) {
    const [expanded, setExpanded] = React.useState(false);

    if (expanded) {
      return (
        <NewWindow name="remote-user-panel" onClose={() => setExpanded(false)}>
          <RemoteUserPanelInner
            {...props}
            expanded={expanded}
            setExpanded={setExpanded}
          />
        </NewWindow>
      );
    }

    return (
      <RemoteUserPanelInner
        {...props}
        expanded={expanded}
        setExpanded={setExpanded}
      />
    );
  }
);

export default RemoteUserPanel;
