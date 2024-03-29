import React from 'react';
import DailyIframe, {
  DailyEvent,
  DailyEventObjectParticipant,
  DailyCallOptions,
  DailyMeetingState,
  DailyEventObjectTrack,
} from '@daily-co/daily-js';
import { LocalMediaContext } from '../LocalMediaContext';
import { UserSettingsContext } from '../UserSettingsContext';
import { useImmer } from 'use-immer';
import { ColyseusContext, ColyseusEvent } from '../ColyseusContext';
import { MAX_INTERACTION_DISTANCE } from '../../constants';
import {
  VideoCallDebugContextValue,
  VideoCallParticipant,
  VideoCallContext,
  VideoCallDebugContext,
} from './VideoCallContext';
import { NewWindowContext } from '../../elements/NewWindow';
import { PlayerStateContext } from '../PlayerStateContext';

interface DailyVideoCallDebugContextProviderProps {
  callObject: any;
}

export const DailyVideoCallDebugContextProvider: React.FC<DailyVideoCallDebugContextProviderProps> =
  ({ children, callObject }) => {
    const [networkStats, setNetworkStats] =
      React.useState<VideoCallDebugContextValue>();

    const newWindow = React.useContext(NewWindowContext);

    React.useEffect(() => {
      if (callObject == null) {
        return;
      }

      const updateNetworkStats = async () => {
        const s = await callObject.getNetworkStats();
        setNetworkStats({
          Threshold: s.threshold,
          Quality: s.quality,
          'Receive bitrate': Math.round(s.stats.latest.videoRecvBitsPerSecond),
          'Send bitrate': Math.round(s.stats.latest.videoSendBitsPerSecond),
          'Worst recv pkt loss':
            Math.round(s.stats.worstVideoRecvPacketLoss * 1000) / 1000,
          'Worst send pkt loss':
            Math.round(s.stats.worstVideoSendPacketLoss * 1000) / 1000,
        });
      };

      callObject.on('network-quality-change', updateNetworkStats);
      const interval = newWindow.setInterval(updateNetworkStats, 2000);

      return () => {
        callObject.off('network-quality-change', updateNetworkStats);
        newWindow.clearInterval(interval);
      };
    }, [callObject, newWindow]);

    const {
      localVideoInputOn,
      localVideoInputDeviceId,
      localVideoTrack,
      localAudioInputOn,
      localAudioTrack,
      localAudioOutputDeviceId,
      localAudioOutputOn,
      localAudioInputDeviceId,
      localScreenShareOn,
      localScreenShareSourceId,
    } = React.useContext(LocalMediaContext);
    const localMediaContextValues = React.useMemo(
      () => ({
        localVideoInputOn,
        localVideoInputDeviceId,
        localVideoTrack,
        localAudioInputOn,
        localAudioTrack,
        localAudioOutputDeviceId,
        localAudioOutputOn,
        localAudioInputDeviceId,
        localScreenShareOn,
        localScreenShareSourceId,
      }),
      [
        localVideoInputOn,
        localVideoInputDeviceId,
        localVideoTrack,
        localAudioInputOn,
        localAudioTrack,
        localAudioOutputDeviceId,
        localAudioOutputOn,
        localAudioInputDeviceId,
        localScreenShareOn,
        localScreenShareSourceId,
      ]
    );

    const debugStats = React.useMemo(
      () => ({
        ...networkStats,
        ...localMediaContextValues,
      }),
      [networkStats, localMediaContextValues]
    );

    return (
      <VideoCallDebugContext.Provider value={debugStats}>
        {children}
      </VideoCallDebugContext.Provider>
    );
  };

interface DailyVideoCallContextProviderProps {
  spaceId: string;
}

export const DailyVideoCallContextProvider: React.FC<DailyVideoCallContextProviderProps> =
  ({ children, spaceId }) => {
    const callObject = React.useMemo(
      () =>
        DailyIframe.createCallObject({
          subscribeToTracksAutomatically: false,
          dailyConfig: {
            experimentalChromeVideoMuteLightOff: true,
          },
        }),
      []
    );

    (window as any).callObject = callObject;

    const [meetingState, setMeetingState] =
      React.useState<DailyMeetingState>('new');

    const newWindow = React.useContext(NewWindowContext);

    const {
      localVideoInputOn,
      localVideoInputDeviceId,
      localAudioInputOn,
      localAudioTrack,
      localScreenShareOn,
      localScreenShareSourceId,
    } = React.useContext(LocalMediaContext);

    const { localIdentity, localName } = React.useContext(UserSettingsContext);

    const { busyType } = React.useContext(PlayerStateContext);

    const [participants, setParticipants] = useImmer<{
      [identity: string]: VideoCallParticipant;
    }>({});

    (window as any).participants = participants;

    const join = React.useCallback(
      async (roomName: string) => {
        const options: DailyCallOptions = {
          url: `http://harb.daily.co/${roomName}`,
          audioSource: !!localAudioInputOn as any,
          videoSource: !!localVideoInputOn as any,
        };

        // missing userName property in type definition
        (options as any).userName = `${localName}:${localIdentity}`;

        const participantObject = await callObject.join(options);

        console.debug('Joined Daily room', participantObject);

        if (process.env.LOW_POWER) {
          callObject.setBandwidth({
            trackConstraints: { width: 32, height: 18 },
          });
        } else {
          // callObject.setBandwidth({
          //   trackConstraints: { width: 240, height: 135 },
          // });
        }
      },
      [
        callObject,
        localName,
        localIdentity,
        localAudioInputOn,
        localVideoInputOn,
      ]
    );

    const leave = React.useCallback(() => {
      callObject.leave();
    }, [callObject]);

    /**
     * Join call on mount and when not busy, leave when busy
     */
    React.useEffect(() => {
      // TODO: enable multiple call rooms per space
      if (
        busyType == null &&
        ['new', 'left-meeting', 'error'].includes(meetingState)
      ) {
        join(spaceId);
      }

      if (busyType) {
        leave();
      }
    }, [join, leave, spaceId, meetingState, busyType]);

    /**
     * Track changes in meeting state
     */
    React.useEffect(() => {
      const events: DailyEvent[] = [
        'loading',
        'loaded',
        'joining-meeting',
        'joined-meeting',
        'left-meeting',
        'error',
      ];

      function handleNewMeetingState(event?: DailyEvent) {
        const newMeetingState = callObject.meetingState();
        console.debug('Meeting state:', newMeetingState);
        setMeetingState(newMeetingState);
        if (newMeetingState === 'joined-meeting') {
          // In case mute was toggled while joining the meeting:
          callObject.setLocalAudio(localAudioInputOn);
          callObject.setLocalVideo(localVideoInputOn);
        }
      }

      handleNewMeetingState();

      for (const event of events) {
        callObject.on(event, handleNewMeetingState);
      }

      return function cleanup() {
        for (const event of events) {
          callObject.off(event, handleNewMeetingState);
        }
      };
    }, [callObject, localAudioInputOn, localVideoInputOn]);

    React.useEffect(() => {
      callObject.setLocalVideo(localVideoInputOn);
    }, [callObject, localVideoInputOn]);

    React.useEffect(() => {
      callObject.setInputDevicesAsync({
        videoDeviceId: localVideoInputDeviceId,
      });
    }, [callObject, localVideoInputDeviceId]);

    React.useEffect(() => {
      callObject.setLocalAudio(localAudioInputOn);
    }, [callObject, localAudioInputOn]);

    React.useEffect(() => {
      if (localAudioTrack == null) {
        return;
      }
      callObject.setInputDevicesAsync({
        audioSource: localAudioTrack,
      });
    }, [callObject, localAudioTrack]);

    // Daily likes to spawn its own tracks even though we want it to always use ours.
    // Put them in their place by setting the track back to ours every time it desyncs.
    const localAudioTrackRef = React.useRef(localAudioTrack);
    localAudioTrackRef.current = localAudioTrack;
    React.useEffect(() => {
      function handleTrackStarted(event?: DailyEventObjectTrack) {
        if (event?.track.kind !== 'audio') {
          return;
        }
        const currentLocalAudioTrack = localAudioTrackRef.current;
        if (
          currentLocalAudioTrack != null &&
          event.track.id !== currentLocalAudioTrack.id
        ) {
          callObject.setInputDevicesAsync({
            audioSource: currentLocalAudioTrack,
          });
        }
      }
      callObject.on('track-started', handleTrackStarted);
      return () => {
        callObject.off('track-started', handleTrackStarted);
      };
    }, [callObject]);

    React.useEffect(() => {
      if (localScreenShareOn) {
        callObject.startScreenShare({
          chromeMediaSourceId: localScreenShareSourceId,
        });
      } else {
        callObject.stopScreenShare();
      }
    }, [callObject, localScreenShareOn, localScreenShareSourceId]);

    /**
     * Start listening for participant changes, when the callObject is set.
     */
    React.useEffect(() => {
      const events: DailyEvent[] = [
        'participant-joined',
        'participant-updated',
        'participant-left',
      ];

      function handleNewParticipantsState(event: DailyEvent) {
        if (callObject.meetingState() === 'joining-meeting') {
          // Daily sends weird stale cached data while joining a room.
          // Ignore this data.
          return;
        }

        setParticipants((draft) => {
          const newParts = callObject.participants();

          for (const [serverId, participant] of Object.entries(newParts)) {
            const [name, identity] = participant.user_name.split(':');
            draft[identity] = {
              serverId,
              // for some reason daily sometimes returns `false` as tracks, hence the `|| undefined`
              audioTrack: participant.audioTrack || undefined,
              videoTrack: participant.videoTrack || undefined,
              screenAudioTrack: participant.screenAudioTrack || undefined,
              screenVideoTrack: participant.screenVideoTrack || undefined,
            };
          }

          Object.entries(draft).forEach(([identity, p]) => {
            if (!newParts[p.serverId]) {
              delete draft[identity];
            }
          });
        });
      }

      // Listen for changes in state
      for (const event of events) {
        callObject.on(event, handleNewParticipantsState);
      }

      // Stop listening for changes in state
      return function cleanup() {
        for (const event of events) {
          callObject.off(event, handleNewParticipantsState);
        }
      };
    }, [callObject]);

    const {
      room: colyseusRoom,
      addListener: addColyseusListener,
      removeListener: removeColyseusListener,
    } = React.useContext(ColyseusContext);

    console.debug('Daily participants:', participants);

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
        const localPlayer = colyseusRoom.state.players.get(localIdentity);

        const distToPlayer = (player: any) => {
          return Math.sqrt(
            (player.x - localPlayer.x) ** 2 + (player.y - localPlayer.y) ** 2
          );
        };

        for (const [identity, player] of colyseusRoom.state.players.entries()) {
          if (identity === localIdentity) {
            continue;
          }

          const participant = participants[identity];

          if (!participant) {
            return;
          }

          const dist = distToPlayer(player);

          if (dist > MAX_INTERACTION_DISTANCE) {
            callObject?.updateParticipant(participant.serverId, {
              setSubscribedTracks: false,
            });
          } else {
            callObject?.updateParticipant(participant.serverId, {
              setSubscribedTracks: true,
            });
          }
        }
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
      callObject,
      participants,
    ]);

    React.useEffect(() => {
      newWindow.addEventListener('beforeunload', leave);

      return () => {
        newWindow.removeEventListener('beforeunload', leave);
        leave();
      };
    }, [leave, newWindow]);

    React.useEffect(() => {
      if (colyseusRoom == null) {
        return;
      }

      const removeOnCommand = colyseusRoom.onMessage('command', (options) => {
        if (options.type === 'bandwidth') {
          callObject.setBandwidth({
            trackConstraints: {
              width: parseInt(options.args[0], 10),
              height: parseInt(options.args[1], 10),
            },
          });
        }
      });

      return () => {
        removeOnCommand();
      };
    }, [colyseusRoom]);

    return (
      <VideoCallContext.Provider value={{ participants }}>
        <DailyVideoCallDebugContextProvider callObject={callObject}>
          {children}
        </DailyVideoCallDebugContextProvider>
      </VideoCallContext.Provider>
    );
  };
