import 'normalize.css';
import 'fonts.global.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as S from './Routes.styles';
import Auth from './pages/Auth';
import { FirebaseContextProvider } from './contexts/FirebaseContext';
import Home from './pages/Home';
import Icon from './elements/Icon';

const Routes: React.FC = () => {
  return (
    <>
      <S.GlobalStyles />
      <FirebaseContextProvider>
        <Router>
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/" component={Auth} />
          </Switch>
        </Router>
      </FirebaseContextProvider>
    </>
  );
};

export default Routes;
