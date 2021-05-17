import * as S from './RemoteScreenPanel.styles';
import * as HoverMenuStyles from './HoverMenu.styles';

import React from 'react';
import HoverMenu from './HoverMenu';
import { MAX_INTERACTION_DISTANCE } from '../constants';
import { useMouseIsIdle } from '../hooks/useMouseIsIdle';
import Loader from '../elements/Loader';
import { NearbyPlayer } from './RemoteUserPanel';
import { ColyseusContext } from '../contexts/ColyseusContext';
import NewWindow, { NewWindowContext } from '../elements/NewWindow';
import { useWindowsDrag } from '../hooks/useWindowsDrag';
import useResizeObserver from 'use-resize-observer';

export interface RemoteScreenPanelInnerProps {
  className?: string;

  player: NearbyPlayer;

  screenOwnerIdentity: string;
  videoTrack?: MediaStreamTrack;

  expanded?: boolean;
  setExpanded(expanded: boolean): void;
}

const RemoteScreenPanelInner: React.FC<RemoteScreenPanelInnerProps> =
  React.memo(
    ({
      className,
      player,
      screenOwnerIdentity,
      videoTrack,
      expanded,
      setExpanded,
    }) => {
      const wrapperRef = React.useRef<HTMLDivElement>(null);
      const videoRef = React.useRef<HTMLVideoElement>(null);
      const [videoSize, setVideoSize] = React.useState<{
        width: number;
        height: number;
      }>({ width: 100, height: 100 });
      const [videoStreaming, setVideoStreaming] = React.useState(false);

      const { room: colyseusRoom } = React.useContext(ColyseusContext);

      const scale = Math.min(
        1,
        MAX_INTERACTION_DISTANCE / 2 / (player.distance + 0.1)
      );

      const width = expanded ? '100%' : Math.floor(240 * scale);
      const height = expanded ? '100%' : Math.floor(135 * scale);

      React.useEffect(() => {
        if (videoRef.current && videoTrack) {
          videoRef.current.srcObject = new MediaStream([videoTrack]);
        }
      }, [videoTrack]);

      React.useEffect(() => {
        if (!videoTrack) {
          setVideoStreaming(false);
        }
      }, [videoTrack]);

      React.useEffect(() => {
        if (!videoTrack) {
          return;
        }

        const videoEl = videoRef.current;
        if (videoEl == null) {
          return;
        }

        const onResize = () => {
          setVideoSize({
            width: videoEl.videoWidth,
            height: videoEl.videoHeight,
          });
        };

        videoEl.addEventListener('resize', onResize);

        return () => {
          videoEl?.removeEventListener('resize', onResize);
        };
      }, [videoTrack]);

      const mouseIsIdle = useMouseIsIdle({ containerRef: wrapperRef });

      const win = React.useContext(NewWindowContext);
      const [observedSize, setObservedSize] = React.useState({
        width: 10,
        height: 10,
      });
      React.useEffect(() => {
        if (!win) {
          return;
        }

        const onResize = () => {
          setObservedSize({ width: win.innerWidth, height: win.innerHeight });
        };

        win.addEventListener('resize', onResize);

        return () => {
          win.removeEventListener('resize', onResize);
        };
      }, [win]);

      const {
        videoProjectedWidth,
        videoProjectedHeight,
        videoXOffset,
        videoYOffset,
      } = React.useMemo(() => {
        let vpw: number;
        let vph: number;
        let xoff: number;
        let yoff: number;

        const videoAspectRatio = videoSize.width / videoSize.height;
        const panelAspectRatio = observedSize.width / observedSize.height;

        if (videoAspectRatio < panelAspectRatio) {
          vpw = observedSize.height * videoAspectRatio;
          vph = observedSize.height;
          xoff = (observedSize.width - vpw) / 2;
          yoff = 0;
        } else {
          vpw = observedSize.width;
          vph = observedSize.width / videoAspectRatio;
          xoff = 0;
          yoff = (observedSize.height - vph) / 2;
        }

        return {
          videoProjectedWidth: vpw,
          videoProjectedHeight: vph,
          videoXOffset: xoff,
          videoYOffset: yoff,
        };
      }, [videoSize, observedSize]);

      const windowsDragProps = useWindowsDrag();

      return (
        <S.Wrapper
          className={className}
          ref={wrapperRef}
          style={{ width, height }}
          {...windowsDragProps}
        >
          {videoTrack && (
            <video
              ref={videoRef}
              autoPlay
              onCanPlay={() => {
                setVideoStreaming(true);
              }}
              onEmptied={() => {
                setVideoStreaming(false);
              }}
              onMouseMove={(e) => {
                if (!expanded) {
                  return;
                }

                const mouseX = e.clientX;
                const mouseY = e.clientY;

                colyseusRoom?.send('updatePlayerCursor', {
                  x: (mouseX - videoXOffset) / videoProjectedWidth,
                  y: (mouseY - videoYOffset) / videoProjectedHeight,
                  surfaceType: 'screen',
                  surfaceId: screenOwnerIdentity,
                });
              }}
              onMouseDown={(e) => {
                if (!expanded) {
                  return;
                }

                const mouseX = e.clientX;
                const mouseY = e.clientY;

                colyseusRoom?.send('cursorMouseDown', {
                  x: (mouseX - videoXOffset) / videoProjectedWidth,
                  y: (mouseY - videoYOffset) / videoProjectedHeight,
                  surfaceType: 'screen',
                  surfaceId: screenOwnerIdentity,
                });
              }}
              onMouseLeave={() => {
                colyseusRoom?.send('updatePlayerCursor', { cursor: undefined });
              }}
            />
          )}
          {!videoStreaming && <Loader />}
          {!expanded && (
            <HoverMenu hidden={mouseIsIdle}>
              <HoverMenuStyles.MenuItem
                name="fullscreen"
                onClick={() => {
                  setExpanded(true);
                }}
              />
            </HoverMenu>
          )}
          {expanded && (
            <S.ShiftedCursorsOverlay
              screenOwnerIdentity={screenOwnerIdentity}
              x={videoXOffset}
              y={videoYOffset}
              width={videoProjectedWidth}
              height={videoProjectedHeight}
            />
          )}
        </S.Wrapper>
      );
    }
  );

export interface RemoteScreenPanelProps {
  className?: string;

  player: NearbyPlayer;

  screenOwnerIdentity: string;
  videoTrack?: MediaStreamTrack;
}

const RemoteScreenPanel: React.FC<RemoteScreenPanelProps> = React.memo(
  function RemoteScreenPanel(props) {
    const [expanded, setExpanded] = React.useState(false);

    if (expanded) {
      return (
        <NewWindow name="remote-user-panel" onClose={() => setExpanded(false)}>
          <RemoteScreenPanelInner
            {...props}
            expanded={expanded}
            setExpanded={setExpanded}
          />
        </NewWindow>
      );
    }

    return (
      <RemoteScreenPanelInner
        {...props}
        expanded={expanded}
        setExpanded={setExpanded}
      />
    );
  }
);

export default RemoteScreenPanel;
