import React from 'react';
import { ipcRenderer } from 'electron';
import * as S from './Panels.styles';
import NewWindow, { NewWindowContext } from '../elements/NewWindow';
import { useImmer } from 'use-immer';
import { ColyseusContext, ColyseusEvent } from '../contexts/ColyseusContext';
import { UserSettingsContext } from '../contexts/UserSettingsContext';
import { MAX_INTERACTION_DISTANCE } from '../constants';
import RemoteUserPanel, { NearbyPlayer } from './RemoteUserPanel';
import { VideoCallContext } from '../contexts/VideoCallContext/VideoCallContext';
import RemoteScreenPanel from './RemoteScreenPanel';
import { PlayerStateContext } from '../contexts/PlayerStateContext';

export interface PanelsProps {
  className?: string;
}

const Panels: React.FC<PanelsProps> = ({ className }) => {
  const panelsWrapperRef = React.useRef<HTMLDivElement>(null);
  const newWindow = React.useContext(NewWindowContext);

  const {
    room: colyseusRoom,
    error: colyseusError,
    addListener: addColyseusListener,
    removeListener: removeColyseusListener,
  } = React.useContext(ColyseusContext);

  const { localIdentity } = React.useContext(UserSettingsContext);
  const { localWhisperingTo } = React.useContext(PlayerStateContext);

  React.useEffect(() => {
    const onMousePosition = (
      e: Electron.IpcRendererEvent,
      d: [number, number]
    ) => {
      const doc = newWindow.document;

      if (!doc) {
        return;
      }

      const el = doc.elementFromPoint(d[0], d[1]);
      if (panelsWrapperRef.current?.contains(el)) {
        ipcRenderer.send('setIgnoreMouseEvents', false);
      } else {
        ipcRenderer.send('setIgnoreMouseEvents', true);
      }
    };

    ipcRenderer.on('mousePosition', onMousePosition);

    return () => {
      ipcRenderer.off('mousePosition', onMousePosition);
    };
  }, []);

  const [nearbyPlayers, setNearbyPlayers] = useImmer<{
    [identity: string]: NearbyPlayer;
  }>({});

  React.useEffect(() => {
    if (!colyseusRoom) {
      return;
    }

    const events: ColyseusEvent[] = [
      'player-added',
      'player-updated',
      'player-removed',
    ];

    const onPlayersUpdated = () => {
      setNearbyPlayers((draft) => {
        const localPlayer = colyseusRoom.state.players.get(localIdentity);

        const distToPlayer = (player: any) => {
          return Math.sqrt(
            (player.x - localPlayer.x) ** 2 + (player.y - localPlayer.y) ** 2
          );
        };

        for (const [identity, player] of colyseusRoom.state.players.entries()) {
          if (identity !== localIdentity) {
            const dist = distToPlayer(player);

            if (dist > MAX_INTERACTION_DISTANCE) {
              continue;
            }

            if (draft[identity] == null) {
              draft[identity] = {
                name: player.name,
                distance: dist,
              };
            }

            draft[identity].name = player.name;
            draft[identity].distance = dist;
            draft[identity].audioInputOn = player.audioInputOn;
            draft[identity].audioOutputOn = player.audioOutputOn;
            draft[identity].videoInputOn = player.videoInputOn;
            draft[identity].screenShareOn = player.screenShareOn;
            draft[identity].sharedApp = player.sharedApp;
            draft[identity].whisperingTo = player.whisperingTo;
            draft[identity].busyType = player.busyType;
            draft[identity].busyUntil = player.busyUntil;
          }
        }

        for (const [id, np] of Object.entries(draft)) {
          const p = colyseusRoom.state.players.get(id);
          if (p == null || distToPlayer(p) > MAX_INTERACTION_DISTANCE) {
            delete draft[id];
          }
        }
      });
    };

    onPlayersUpdated();

    for (const event of events) {
      addColyseusListener(event, onPlayersUpdated);
    }

    return () => {
      for (const event of events) {
        removeColyseusListener(event, onPlayersUpdated);
      }
    };
  }, [
    colyseusRoom,
    addColyseusListener,
    removeColyseusListener,
    localIdentity,
    setNearbyPlayers,
  ]);

  const { participants } = React.useContext(VideoCallContext);

  console.debug('Nearby players', nearbyPlayers);
  console.debug('Participants', participants);

  return (
    <S.Wrapper className={className}>
      <S.PanelsWrapper
        ref={panelsWrapperRef}
        onMouseMove={() => {
          console.debug('mouse move');
        }}
      >
        {Object.entries(nearbyPlayers).map(([identity, player]) => {
          const participant = participants[identity];

          return (
            <React.Fragment key={identity}>
              <RemoteUserPanel
                identity={identity}
                player={player}
                videoTrack={participant?.videoTrack}
                audioTrack={participant?.audioTrack}
                whisperTarget={localWhisperingTo === identity}
              />
              {player.screenShareOn && (
                <RemoteScreenPanel
                  screenOwnerIdentity={identity}
                  player={player}
                  videoTrack={participant?.screenVideoTrack}
                />
              )}
            </React.Fragment>
          );
        })}
      </S.PanelsWrapper>
    </S.Wrapper>
  );
};

export default Panels;
