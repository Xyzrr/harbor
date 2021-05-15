import React from 'react';
import { COLOR_OPTIONS } from '../constants';
import { AppInfo, useAppTracker } from '../hooks/useAppTracker';
import * as _ from 'lodash';

interface LocalInfoContextValue {
  localIdentity: string;
  localName: string;
  setLocalName(name: string): void;
  localWhisperingTo?: string;
  setLocalWhisperingTo(identity: string | undefined): void;
  localColor: number;
  setLocalColor(color: number): void;
  appSharingOn?: boolean;
  setAppSharingOn(on: boolean): void;
  localApp?: AppInfo;
}

export const LocalInfoContext = React.createContext<LocalInfoContextValue>(
  null!
);

interface LocalInfoContextProviderProps {
  user: firebase.default.User;
}

export const LocalInfoContextProvider: React.FC<LocalInfoContextProviderProps> =
  ({ children, user }) => {
    const localIdentity = user.uid;

    const [localName, setLocalName] = React.useState(user.displayName || '');
    const [localWhisperingTo, setLocalWhisperingTo] = React.useState<string>();
    const [localColor, setLocalColor] = React.useState<number>(
      () => _.sample(COLOR_OPTIONS) as number
    );
    const [appSharingOn, setAppSharingOn] = React.useState(true);
    const localApp = useAppTracker();

    return (
      <LocalInfoContext.Provider
        value={{
          localIdentity,
          localName,
          setLocalName,
          localWhisperingTo,
          setLocalWhisperingTo,
          localColor,
          setLocalColor,
          appSharingOn,
          setAppSharingOn,
          localApp,
        }}
      >
        {children}
      </LocalInfoContext.Provider>
    );
  };
