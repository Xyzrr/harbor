import * as S from './FakeCursor.styles';
import React from 'react';

export interface FakeCursorProps {
  className?: string;
  x: number | string;
  y: number | string;
  color: string;
}

const FakeCursor: React.FC<FakeCursorProps> = ({ className, x, y, color }) => {
  return (
    <S.Wrapper className={className} style={{ left: x, top: y }} color={color}>
      <S.Outer>
        <S.Left />
        <S.Right />
      </S.Outer>
      <S.Inner>
        <S.Left />
        <S.Right />
      </S.Inner>
    </S.Wrapper>
  );
};

export default FakeCursor;
