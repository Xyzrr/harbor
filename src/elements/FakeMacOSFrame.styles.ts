import styled from 'styled-components';

export const Wrapper = styled.div<{ bigSur?: boolean }>`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  border-radius: ${(props) => (props.bigSur ? 10 : 6)}px;
  z-index: 100;
  pointer-events: none;
`;
