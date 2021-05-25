import styled, { css } from 'styled-components';

export const Wrapper = styled.img<{ active?: boolean }>`
  margin: 4px;
  width: 20px;
  ${(props) =>
    !props.active &&
    css`
      opacity: 0.5;
    `}
`;
