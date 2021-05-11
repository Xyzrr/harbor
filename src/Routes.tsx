import 'normalize.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as S from './Routes.styles';
import Space from './components/Space';

const Routes: React.FC = () => {
  return (
    <>
      <S.GlobalStyles />
      <S.Caret />
      <S.CaretRim />
      <S.Wrapper>
        <Router>
          <Switch>
            <Route path="/" component={Space} />
          </Switch>
        </Router>
      </S.Wrapper>
    </>
  );
};

export default Routes;
