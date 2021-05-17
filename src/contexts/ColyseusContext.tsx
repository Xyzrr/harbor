import React from 'react';

import * as Colyseus from 'colyseus.js';
import { LocalMediaContext } from './LocalMediaContext';
import { UserSettingsContext } from './UserSettingsContext';
import { COLYSEUS_CLIENT, HOST } from '../constants';
import { PlayerStateContext } from './PlayerStateContext';

interface PlayerAddedEvent {
  identity: string;
  player: any;
}

interface PlayerUpdatedEvent {
  identity: string;
  player: any;
  changes: any[];
}

interface PlayerRemovedEvent {
  identity: string;
  player: any;
}

interface ColyseusEventMap {
  'player-added': PlayerAddedEvent;
  'player-updated': PlayerUpdatedEvent;
  'player-removed': PlayerRemovedEvent;
}

export type ColyseusEvent =
  | 'player-added'
  | 'player-updated'
  | 'player-removed';

type ColyseusListener<T extends ColyseusEvent> = (
  ev: ColyseusEventMap[T]
) => void;

interface ColyseusContextValue {
  room?: Colyseus.Room;
  error: string | null;
  addListener<T extends ColyseusEvent>(
    type: T,
    listener: ColyseusListener<T>
  ): void;
  removeListener<T extends ColyseusEvent>(
    type: T,
    listener: ColyseusListener<T>
  ): void;
  join(roomName: string, identity: string): Promise<void>;
  leave(): void;
}

export const ColyseusContext = React.createContext<ColyseusContextValue>(null!);

interface ColyseusContextProviderProps {
  spaceId: string;
}

export const ColyseusContextProvider: React.FC<ColyseusContextProviderProps> =
  ({ children, spaceId }) => {
    const [room, setRoom] = React.useState<Colyseus.Room | undefined>();
    const [sessionId, setSessionId] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const {
      localIdentity,
      localName,
      localPhotoUrl,
      localColor,
      appSharingOn,
    } = React.useContext(UserSettingsContext);

    const { localWhisperingTo, localApp } =
      React.useContext(PlayerStateContext);

    const {
      localAudioInputOn,
      localAudioOutputOn,
      localVideoInputOn,
      localScreenShareOn,
    } = React.useContext(LocalMediaContext);

    const listeners =
      React.useRef<
        {
          [key in ColyseusEvent]?: Set<ColyseusListener<key>>;
        }
      >();

    (window as any).room = room;

    const bindListenersToRoom = React.useCallback((r: Colyseus.Room) => {
      r.state.players.onAdd = (player: any, identity: string) => {
        console.log('Colyseus player added:', identity);

        const addListeners = listeners.current?.['player-added'];

        if (addListeners) {
          addListeners.forEach((l) => l({ identity, player }));
        }

        player.onChange = (changes: any[]) => {
          console.log('Colyseus player updated:', identity, changes);

          const updateListeners = listeners.current?.['player-updated'];

          if (updateListeners) {
            updateListeners.forEach((l) => l({ identity, player, changes }));
          }
        };
      };

      r.state.players.onRemove = (player: any, identity: string) => {
        console.log('Colyseus player removed:', identity);

        const removeListeners = listeners.current?.['player-removed'];

        if (removeListeners) {
          removeListeners.forEach((l) => l({ identity, player }));
        }
      };
    }, []);

    const join = React.useCallback(
      async (roomName: string) => {
        const r: Colyseus.Room<any> = await COLYSEUS_CLIENT.joinOrCreate(
          roomName,
          {
            identity: localIdentity,
            name: localName,
            color: localColor,
            audioInputOn: localAudioInputOn,
            audioOutputOn: localAudioOutputOn,
            videoInputOn: localVideoInputOn,
            photoUrl: localPhotoUrl,
            spaceId,
          }
        );
        setSessionId(r.sessionId);

        console.log('Joined or created Colyseus room:', r);

        setRoom(r);

        console.log('INTIIAL ROOM STATE:', JSON.parse(JSON.stringify(r.state)));

        bindListenersToRoom(r);
      },
      [
        bindListenersToRoom,
        localAudioInputOn,
        localAudioOutputOn,
        localVideoInputOn,
        localColor,
        localIdentity,
        localName,
        localPhotoUrl,
        spaceId,
      ]
    );

    const roomRef = React.useRef<Colyseus.Room>();
    roomRef.current = room;
    const leave = React.useCallback(() => {
      if (!roomRef.current) {
        return;
      }

      console.log('Leaving Colyseus room');

      roomRef.current.leave();
    }, []);

    React.useEffect(() => {
      return () => {
        leave();
      };
    }, [leave]);

    React.useEffect(() => {
      if (!room) {
        join('main');
      }
    }, [join, room]);

    React.useEffect(() => {
      window.addEventListener('beforeunload', leave);

      return () => {
        window.removeEventListener('beforeunload', leave);
        leave();
      };
    }, [leave]);

    React.useEffect(() => {
      if (!room || !sessionId) {
        return;
      }

      const onLeave = async (code: number) => {
        console.log('LEFT WITH CODE:', code, room.id, room.sessionId, room);
        setError(`Disconnected with code ${code}. Reconnecting...`);
        let newRoom: Colyseus.Room | undefined;
        try {
          newRoom = await COLYSEUS_CLIENT.reconnect(room.id, sessionId);
          if (newRoom) {
            console.log(
              'STATE RIGHT AFTER RECONNECTING:',
              JSON.parse(JSON.stringify(newRoom.state))
            );
          }
          console.log('SUCCESSFULLY RECONNECTED:', newRoom);
        } catch (e) {
          console.log('FAILED TO RECONNECT:', e);
          setError('Failed to reconnect. Please try again later.');
        }
        if (newRoom) {
          bindListenersToRoom(newRoom);
          setRoom(newRoom);
          setError(null);
        }
      };

      room.onLeave(onLeave);

      return () => {
        room.onLeave.remove(onLeave);
      };
    }, [bindListenersToRoom, room, sessionId]);

    const addListener = React.useCallback<ColyseusContextValue['addListener']>(
      (type, listener) => {
        if (!listeners.current) {
          listeners.current = {};
        }

        if (!listeners.current[type]) {
          (listeners.current as any)[type] = new Set();
        }

        const set = listeners.current[type]!;

        set.add(listener as any);
      },
      []
    );

    const removeListener = React.useCallback<
      ColyseusContextValue['removeListener']
    >((type, listener) => {
      const set = listeners.current?.[type];

      if (set) {
        set.delete(listener as any);
      }
    }, []);

    React.useEffect(() => {
      room?.send('updatePlayer', { audioInputOn: localAudioInputOn });
    }, [room, localAudioInputOn]);

    React.useEffect(() => {
      room?.send('updatePlayer', { audioOutputOn: localAudioOutputOn });
    }, [room, localAudioOutputOn]);

    React.useEffect(() => {
      room?.send('updatePlayer', { videoInputOn: localVideoInputOn });
    }, [room, localVideoInputOn]);

    React.useEffect(() => {
      room?.send('updatePlayer', { screenShareOn: localScreenShareOn });
    }, [room, localScreenShareOn]);

    React.useEffect(() => {
      room?.send('updatePlayer', { color: localColor });
    }, [room, localColor]);

    React.useEffect(() => {
      room?.send('updatePlayer', { name: localName });
    }, [room, localName]);

    React.useEffect(() => {
      room?.send('updatePlayer', { photoUrl: localPhotoUrl });
    }, [room, localPhotoUrl]);

    React.useEffect(() => {
      room?.send('updatePlayer', { whisperingTo: localWhisperingTo });
    }, [room, localWhisperingTo]);

    React.useEffect(() => {
      if (appSharingOn) {
        room?.send('appInfo', { ...localApp });
      }
    }, [localApp, appSharingOn]);

    return (
      <ColyseusContext.Provider
        value={{ room, addListener, removeListener, join, leave, error }}
      >
        {children}
      </ColyseusContext.Provider>
    );
  };
