import React from 'react';
import * as Colyseus from 'colyseus.js';
import { useImmer } from 'use-immer';
import { COLYSEUS_CLIENT } from '../constants';

const useSpaces = () => {
  const [spaces, setSpaces] = useImmer<Colyseus.RoomAvailable[] | null>(null);
  const [error, setError] = React.useState<Error>();

  React.useEffect(() => {
    let l: Colyseus.Room;
    COLYSEUS_CLIENT.joinOrCreate('lobby')
      .then((lobby) => {
        l = lobby;
        lobby.onMessage('rooms', (rooms) => {
          console.log('rooms');
          setSpaces(rooms);
        });

        lobby.onMessage('+', ([roomId, room]) => {
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
  }, []);

  return { spaces, error };
};

export default useSpaces;
