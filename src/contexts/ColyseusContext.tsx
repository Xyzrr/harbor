import React from 'react';

import * as Colyseus from 'colyseus.js';
import { LocalMediaContext } from './LocalMediaContext';
import { UserSettingsContext } from './UserSettingsContext';
import { COLYSEUS_CLIENT } from '../constants';
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

    const {
      localWhisperingTo,
      localApp,
      busySince,
      busyUntil,
      busyType,
      spaceFocused,
      idleTime,
    } = React.useContext(PlayerStateContext);

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
        console.debug('Colyseus player added:', identity);

        const addListeners = listeners.current?.['player-added'];

        if (addListeners) {
          addListeners.forEach((l) => l({ identity, player }));
        }

        player.onChange = (changes: any[]) => {
          console.debug('Colyseus player updated:', identity, changes);

          const updateListeners = listeners.current?.['player-updated'];

          if (updateListeners) {
            updateListeners.forEach((l) => l({ identity, player, changes }));
          }
        };
      };

      r.state.players.onRemove = (player: any, identity: string) => {
        console.debug('Colyseus player removed:', identity);

        const removeListeners = listeners.current?.['player-removed'];

        if (removeListeners) {
          removeListeners.forEach((l) => l({ identity, player }));
        }
      };
    }, []);

    const join = React.useCallback(async () => {
      const r: Colyseus.Room<any> = await COLYSEUS_CLIENT.joinOrCreate('main', {
        identity: localIdentity,
        name: localName,
        color: localColor,
        audioInputOn: localAudioInputOn,
        audioOutputOn: localAudioOutputOn,
        videoInputOn: localVideoInputOn,
        photoUrl: localPhotoUrl,
        spaceId,
      });
      setError(null);
      setSessionId(r.sessionId);

      console.debug('Joined or created Colyseus room:', r);

      setRoom(r);

      console.debug('INTIIAL ROOM STATE:', JSON.parse(JSON.stringify(r.state)));

      bindListenersToRoom(r);
    }, [
      bindListenersToRoom,
      localAudioInputOn,
      localAudioOutputOn,
      localVideoInputOn,
      localColor,
      localIdentity,
      localName,
      localPhotoUrl,
      spaceId,
    ]);

    const abortJoinRef = React.useRef(false);
    React.useEffect(() => {
      return () => {
        abortJoinRef.current = true;
      };
    }, []);
    const joinWithInfiniteRetries = React.useCallback(async () => {
      while (true) {
        if (abortJoinRef.current) {
          return;
        }
        try {
          // eslint-disable-next-line
          await join();
          return;
        } catch (e) {
          console.error(`join error: ${e}`);
          setError('Failed to rejoin. Trying again...');
          // eslint-disable-next-line
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
    }, [join]);

    const roomRef = React.useRef<Colyseus.Room>();
    roomRef.current = room;
    const leave = React.useCallback(() => {
      if (!roomRef.current) {
        return;
      }

      console.debug('Leaving Colyseus room');

      roomRef.current.leave();
    }, []);

    React.useEffect(() => {
      return () => {
        leave();
      };
    }, [leave]);

    React.useEffect(() => {
      if (!room) {
        joinWithInfiniteRetries();
      }
    }, [joinWithInfiniteRetries, room]);

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
        console.debug('LEFT WITH CODE:', code, room.id, room.sessionId, room);
        setError(`Disconnected with code ${code}. Reconnecting...`);
        try {
          const newRoom = await COLYSEUS_CLIENT.reconnect(room.id, sessionId);
          if (newRoom) {
            console.debug(
              'STATE RIGHT AFTER RECONNECTING:',
              JSON.parse(JSON.stringify(newRoom.state))
            );
            bindListenersToRoom(newRoom);
            setRoom(newRoom);
            setError(null);
          }
          console.debug('SUCCESSFULLY RECONNECTED:', newRoom);
        } catch (e) {
          console.log('FAILED TO RECONNECT:', e);
          setError('Failed to reconnect. Re-joining...');
          await joinWithInfiniteRetries();
        }
      };

      room.onLeave(onLeave);

      return () => {
        room.onLeave.remove(onLeave);
      };
    }, [bindListenersToRoom, room, sessionId, joinWithInfiniteRetries]);

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
    }, [localApp, room, appSharingOn]);

    React.useEffect(() => {
      room?.send('updatePlayer', { busySince });
    }, [room, busySince]);

    React.useEffect(() => {
      room?.send('updatePlayer', { busyUntil });
    }, [room, busyUntil]);

    React.useEffect(() => {
      room?.send('updatePlayer', { busyType });
    }, [room, busyType]);

    React.useEffect(() => {
      room?.send('updatePlayer', { spaceFocused });
    }, [room, spaceFocused]);

    React.useEffect(() => {
      room?.send('updatePlayer', { idleTime });
    }, [room, idleTime]);

    return (
      <ColyseusContext.Provider
        value={{ room, addListener, removeListener, join, leave, error }}
      >
        {children}
      </ColyseusContext.Provider>
    );
  };
