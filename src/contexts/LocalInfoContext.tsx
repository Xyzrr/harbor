import React from 'react';
import { COLOR_OPTIONS } from '../constants';
import { AppInfo, useAppTracker } from '../hooks/useAppTracker';
import { FirebaseContext } from './FirebaseContext';
import * as _ from 'lodash';

interface LocalInfoContextValue {
  localIdentity: string;
  localName: string;
  setLocalName(name: string): void;
  localGhost: boolean;
  setLocalGhost(ghost: boolean): void;
  localWhisperingTo?: string;
  setLocalWhisperingTo(identity: string | undefined): void;
  localColor: number;
  setLocalColor(color: number): void;
  appSharingOn?: boolean;
  setAppSharingOn(on: boolean): void;
  localApp?: AppInfo;
  gotReady: boolean;
  setGotReady(ready: boolean): void;
}

export const LocalInfoContext = React.createContext<LocalInfoContextValue>(
  null!
);

export const LocalInfoContextProvider: React.FC = ({ children }) => {
  const { app: firebaseApp } = React.useContext(FirebaseContext);

  const localIdentity = React.useMemo(() => {
    const result = firebaseApp.auth().currentUser?.uid || 'ERROR';
    console.log('USER', firebaseApp.auth().currentUser);
    console.log('LOCAL IDENTITY', result);
    return result;
  }, []);

  const [localName, setLocalName] = React.useState(
    firebaseApp.auth().currentUser?.displayName || ''
  );
  const [localGhost, setLocalGhost] = React.useState(true);
  const [localWhisperingTo, setLocalWhisperingTo] = React.useState<string>();
  const [localColor, setLocalColor] = React.useState<number>(
    () => _.sample(COLOR_OPTIONS) as number
  );
  console.log('COLOR', localColor);
  const [appSharingOn, setAppSharingOn] = React.useState(true);
  const [gotReady, setGotReady] = React.useState(false);
  const localApp = useAppTracker();

  return (
    <LocalInfoContext.Provider
      value={{
        localIdentity,
        localGhost,
        setLocalGhost,
        localName,
        setLocalName,
        localWhisperingTo,
        setLocalWhisperingTo,
        localColor,
        setLocalColor,
        appSharingOn,
        setAppSharingOn,
        localApp,
        gotReady,
        setGotReady,
      }}
    >
      {children}
    </LocalInfoContext.Provider>
  );
};
