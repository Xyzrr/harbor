import React from 'react';
import * as Colyseus from 'colyseus.js';
import { useImmer } from 'use-immer';
import { COLYSEUS_CLIENT } from '../constants';
import { FirebaseContext } from '../contexts/FirebaseContext';

const useSpaces = () => {
  const [spaces, setSpaces] = useImmer<Colyseus.RoomAvailable[] | null>(null);
  const [error, setError] = React.useState<Error>();
  const { user } = React.useContext(FirebaseContext);

  const allowed = React.useCallback(
    (room: Colyseus.RoomAvailable) => {
      if (room.metadata?.spaceId === 'wandb-growth') {
        if (
          user?.email?.endsWith('wandb.com') ||
          user?.email === 'johnlongqian@gmail.com'
        ) {
          return true;
        }
        return false;
      }

      return true;
    },
    [user]
  );

  React.useEffect(() => {
    let l: Colyseus.Room;
    COLYSEUS_CLIENT.joinOrCreate('lobby')
      .then((lobby) => {
        l = lobby;
        lobby.onMessage('rooms', (rooms) => {
          console.log('ROOMS:', rooms);
          setSpaces(rooms.filter(allowed));
        });

        lobby.onMessage('+', ([roomId, room]) => {
          if (!allowed(room)) {
            return;
          }

          setSpaces((draft) => {
            if (draft == null) {
              return;
            }
            const spaceIndex = draft.findIndex(
              (space) => space.roomId === roomId
            );
            if (spaceIndex === -1) {
              draft.push(room);
            } else {
              draft[spaceIndex] = room;
            }
          });
        });

        lobby.onMessage('-', (roomId) => {
          setSpaces((draft) => {
            if (draft == null) {
              return;
            }
            const spaceIndex = draft.findIndex(
              (space) => space.roomId === roomId
            );
            delete draft[spaceIndex];
          });
        });
      })
      .catch((e) => {
        console.log('Failed to fetch spaces:', e);
        setError(e);
      });

    return () => {
      l?.leave();
    };
  }, [setSpaces, allowed]);

  return { spaces, error };
};

export default useSpaces;
