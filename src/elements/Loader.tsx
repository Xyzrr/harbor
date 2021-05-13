import * as S from './Loader.styles';
import React from 'react';
import { CircularProgress } from '@material-ui/core';

export interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => {
  return (
    <S.Wrapper className={className}>
      <CircularProgress />
    </S.Wrapper>
  );
};

export default Loader;
