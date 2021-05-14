import styled from 'styled-components';

export const Wrapper = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(${(props) => props.x}px, ${(props) => props.y}px);
`;
