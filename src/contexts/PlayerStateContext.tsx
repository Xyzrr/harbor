import React from 'react';
import { AppInfo, useAppTracker } from '../hooks/useAppTracker';
import * as _ from 'lodash';

interface PlayerStateContextValue {
  localWhisperingTo?: string;
  setLocalWhisperingTo(identity: string | undefined): void;
  localApp?: AppInfo;
}

export const PlayerStateContext = React.createContext<PlayerStateContextValue>(
  null!
);

export const PlayerStateContextProvider: React.FC = ({ children }) => {
  const [localWhisperingTo, setLocalWhisperingTo] = React.useState<string>();
  const localApp = useAppTracker();

  return (
    <PlayerStateContext.Provider
      value={{
        localWhisperingTo,
        setLocalWhisperingTo,
        localApp,
      }}
    >
      {children}
    </PlayerStateContext.Provider>
  );
};
