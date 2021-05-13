import 'normalize.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as S from './Routes.styles';
import Space from './components/Space';
import Auth from './pages/Auth';
import { FirebaseContextProvider } from './contexts/FirebaseContext';

const Routes: React.FC = () => {
  return (
    <>
      <S.GlobalStyles />
      <FirebaseContextProvider>
        <Router>
          <Switch>
            <Route path="/" component={Auth} />
          </Switch>
        </Router>
      </FirebaseContextProvider>
    </>
  );
};

export default Routes;
