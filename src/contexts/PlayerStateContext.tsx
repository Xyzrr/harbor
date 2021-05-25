import React from 'react';
import { AppInfo, useAppTracker } from '../hooks/useAppTracker';
import * as _ from 'lodash';
import { ipcRenderer } from 'electron';

export type BusyType = 'default' | 'meeting' | 'food' | 'focus' | 'exercise';

interface PlayerStateContextValue {
  localWhisperingTo?: string;
  setLocalWhisperingTo(identity: string | undefined): void;
  localApp?: AppInfo;
  busySince?: number;
  setBusySince(time: number | undefined): void;
  busyUntil?: number;
  setBusyUntil(time: number | undefined): void;
  busyType?: BusyType;
  setBusyType(type: BusyType | undefined): void;
  spaceFocused?: boolean;
  setSpaceFocused: React.Dispatch<React.SetStateAction<boolean>>;
  idleTime: number;
}

export const PlayerStateContext = React.createContext<PlayerStateContextValue>(
  null!
);

export const PlayerStateContextProvider: React.FC = ({ children }) => {
  const [localWhisperingTo, setLocalWhisperingTo] = React.useState<string>();
  const localApp = useAppTracker();

  const [busySince, setBusySince] = React.useState<number>();
  const [busyUntil, setBusyUntil] = React.useState<number>();
  const [busyType, setBusyType] = React.useState<BusyType>();
  const [spaceFocused, setSpaceFocused] = React.useState(false);

  const [idleTime, setIdleTime] = React.useState(0);

  React.useEffect(() => {
    const onSystemIdleTime = (e: Electron.IpcRendererEvent, time: number) => {
      setIdleTime(time);
    };

    ipcRenderer.on('systemIdleTime', onSystemIdleTime);

    return () => {
      ipcRenderer.off('systemIdleTime', onSystemIdleTime);
    };
  }, []);

  return (
    <PlayerStateContext.Provider
      value={{
        localWhisperingTo,
        setLocalWhisperingTo,
        localApp,
        busySince,
        setBusySince,
        busyUntil,
        setBusyUntil,
        busyType,
        setBusyType,
        spaceFocused,
        setSpaceFocused,
        idleTime,
      }}
    >
      {children}
    </PlayerStateContext.Provider>
  );
};
