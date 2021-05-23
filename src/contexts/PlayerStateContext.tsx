import React from 'react';
import { AppInfo, useAppTracker } from '../hooks/useAppTracker';
import * as _ from 'lodash';

export type BusyType = 'meeting' | 'food' | 'focus' | 'exercise';

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
      }}
    >
      {children}
    </PlayerStateContext.Provider>
  );
};
