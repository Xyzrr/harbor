import * as S from './SpaceMap.styles';
import React from 'react';
import { ColyseusContext } from '../contexts/ColyseusContext';
import { useImmer } from 'use-immer';
import MapPlayer, { PlayerSummary } from './MapPlayer';
import { LocalInfoContext } from '../contexts/LocalInfoContext';
import { useKeyboardMovement } from '../hooks/useKeyboardMovement';

export interface SpaceMapProps {
  className?: string;
}

const SpaceMap: React.FC<SpaceMapProps> = ({ className }) => {
  const [playerSummaries, setPlayerSummaries] = useImmer<{
    [identity: string]: PlayerSummary;
  }>({});

  const { localIdentity, localName } = React.useContext(LocalInfoContext);

  const [localPlayer, setLocalPlayer] = useImmer<PlayerSummary>({
    name: localName,
    x: 0,
    y: 0,
    dir: 0,
    speed: 0,
  });

  const {
    room: colyseusRoom,
    addListener: addColyseusListener,
    removeListener: removeColyseusListener,
  } = React.useContext(ColyseusContext);

  React.useEffect(() => {
    const onPlayerAdded = ({ identity, player }: any) => {
      if (identity === localIdentity) {
        return;
      }

      setPlayerSummaries((draft) => {
        draft[identity] = {
          name: player.name,
          x: player.x,
          y: player.y,
          dir: player.dir,
          speed: player.speed,
          audioInputOn: player.audioInputOn,
          audioOutputOn: player.audioOutputOn,
          videoInputOn: player.videoInputOn,
          screenShareOn: player.screenShareOn,
        };
      });
    };

    const onPlayerUpdated = ({ identity, player }: any) => {
      if (identity === localIdentity) {
        return;
      }

      setPlayerSummaries((draft) => {
        draft[identity].name = player.name;
        draft[identity].x = player.x;
        draft[identity].y = player.y;
        draft[identity].dir = player.dir;
        draft[identity].speed = player.speed;
        draft[identity].audioInputOn = player.audioInputOn;
        draft[identity].audioOutputOn = player.audioOutputOn;
        draft[identity].videoInputOn = player.videoInputOn;
        draft[identity].screenShareOn = player.screenShareOn;
      });
    };

    const onPlayerRemoved = ({ identity }: any) => {
      setPlayerSummaries((draft) => {
        delete draft[identity];
      });
    };

    addColyseusListener('player-added', onPlayerAdded);
    addColyseusListener('player-updated', onPlayerUpdated);
    addColyseusListener('player-removed', onPlayerRemoved);

    return () => {
      removeColyseusListener('player-added', onPlayerAdded);
      removeColyseusListener('player-updated', onPlayerUpdated);
      removeColyseusListener('player-removed', onPlayerRemoved);
    };
  }, [colyseusRoom]);

  useKeyboardMovement(setLocalPlayer);

  return (
    <S.Wrapper className={className}>
      {Object.entries(playerSummaries).map(([identity, player]) => {
        return <MapPlayer key={identity} playerSummary={player} />;
      })}
      <MapPlayer playerSummary={localPlayer} />
    </S.Wrapper>
  );
};

export default SpaceMap;
