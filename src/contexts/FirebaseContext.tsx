import React from 'react';
import firebase from 'firebase';

export const firebaseConfig = {
  apiKey: 'AIzaSyA89oz2--yQCG8AieZNa_7j-gPcJsBFyEA',
  authDomain: 'harbor-chat.firebaseapp.com',
  projectId: 'harbor-chat',
  storageBucket: 'harbor-chat.appspot.com',
  messagingSenderId: '222349427903',
  appId: '1:222349427903:web:6433be4de99f7c5df5720a',
  measurementId: 'G-5C5J3GGJ06',
};

interface FirebaseContextValue {
  app: firebase.app.App;
  user: firebase.User | null;
  loadingUser: boolean;
}

export const FirebaseContext = React.createContext<FirebaseContextValue>(null!);

const app = firebase.initializeApp(firebaseConfig);

export const FirebaseContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState<firebase.User | null>(null);
  const [loadingUser, setLoadingUser] = React.useState(true);

  React.useEffect(() => {
    app.auth().onAuthStateChanged((u) => {
      console.log('AUTH STATE CHANGED');
      setLoadingUser(false);
      setUser(u);
    });

    app.auth().onIdTokenChanged((u) => {
      console.log('ID TOKEN CHANGED');
      setUser(u);
    });
  }, []);

  return (
    <FirebaseContext.Provider value={{ app, user, loadingUser }}>
      {children}
    </FirebaseContext.Provider>
  );
};
