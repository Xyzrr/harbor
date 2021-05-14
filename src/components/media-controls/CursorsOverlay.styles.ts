import styled, { keyframes } from 'styled-components';

const flash = keyframes`
  0%   {
      opacity: 0;
      transform: scale(0.2);
  }
  50%  {
      opacity: 1;
  }
  100% {
      opacity: 0;
      transform: scale(1.6);
      border-width: 0;
  }
`;

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  .flasher {
    pointer-events: none;
    animation: 0.4s ease-out 0s ${flash};
    opacity: 0;
    margin-left: -20px;
    margin-top: -20px;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    transform-origin: 50% 50%;
    border: 8px solid white;
    position: absolute;
  }
`;
