import React from 'react';
import { COLOR_OPTIONS } from '../constants';
import * as _ from 'lodash';

interface UserSettingsContextValue {
  localIdentity: string;
  localName: string;
  setLocalName(name: string): void;
  localColor: number;
  setLocalColor(color: number): void;
  appSharingOn?: boolean;
  setAppSharingOn(on: boolean): void;
}

export const UserSettingsContext =
  React.createContext<UserSettingsContextValue>(null!);

interface UserSettingsContextProviderProps {
  user: firebase.default.User;
}

export const UserSettingsContextProvider: React.FC<UserSettingsContextProviderProps> =
  ({ children, user }) => {
    const localIdentity = user.uid;

    const [localName, setLocalName] = React.useState(user.displayName || '');
    const [localColor, setLocalColor] = React.useState<number>(
      () => _.sample(COLOR_OPTIONS) as number
    );
    const [appSharingOn, setAppSharingOn] = React.useState(true);

    return (
      <UserSettingsContext.Provider
        value={{
          localIdentity,
          localName,
          setLocalName,
          localColor,
          setLocalColor,
          appSharingOn,
          setAppSharingOn,
        }}
      >
        {children}
      </UserSettingsContext.Provider>
    );
  };
