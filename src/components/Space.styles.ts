import styled, { css } from 'styled-components';
import os from 'os';
import { DANGER } from '../constants';

export const TrayPopoutWrapper = styled.div<{
  W: number;
  H: number;
  O: number;
  R: number;
}>`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  ${({ W, H, O, R }) => css`
    clip-path: path(
      '
    M ${W / 2} 0
    L ${W / 2 + O} ${O}
    L ${W - R} ${O}
    A ${R} ${R} 0 0 1 ${W} ${O + R}
    L ${W} ${O + H - R}
    A ${R} ${R} 0 0 1 ${W - R} ${O + H}
    L ${R} ${O + H}
    A ${R} ${R} 0 0 1 0 ${O + H - R}
    L 0 ${O + R}
    A ${R} ${R} 0 0 1 ${R} ${O}
    L ${W / 2 - O} ${O}
    z
  '
    );
  `}
`;

export const Overlay = styled.div<{
  W: number;
  H: number;
  O: number;
  R: number;
}>`
  ${({ W, H, O, R }) => css`
    width: ${W}px;
    height: ${H}px;
    top: ${O}px;
    left: 0;
    border-radius: ${R}px;
    clip-path: path(
      '
    M ${W / 2 + O + 1} 2
    L ${W / 2 + O - 1} 0
    L ${W} 0
    L ${W} ${H}
    L 0 ${H}
    L 0 0
    L ${W / 2 - O + 1} 0
    L ${W / 2 - O - 1} 2
    z
  '
    );
  `}
  position: absolute;
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  pointer-events: none;
`;

export const CaretOverlay = styled.div<{
  W: number;
  O: number;
}>`
  ${({ W, O }) => css`
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
    width: ${O * Math.sqrt(2)}px;
    height: ${O * Math.sqrt(2)}px;
    transform: translate(-50%, ${1 + (O * (Math.sqrt(2) - 1)) / 2}px)
      rotate(45deg);
    clip-path: path(
      '
  M 0 0
  L ${O * Math.sqrt(2)} 0
  L 0 ${O * Math.sqrt(2)}
  z
'
    );
    position: absolute;
    top: 0;
    left: ${W / 2}px;
  `}
`;

export const TopButtons = styled.div<{ O: number }>`
  position: absolute;
  top: ${(props) => props.O};
  left: 0;
  width: 100%;
  display: flex;
  padding: 12px;
  gap: 8px;
  justify-content: space-between;
  pointer-events: none;
`;

export const ExitButton = styled.div`
  pointer-events: auto;
  user-select: none;
  color: white;
  background: rgba(100, 100, 100, 0.4);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  overflow: hidden;

  .material-icons-outlined {
    opacity: 0.8;
    transform: rotate(180deg);
    font-size: 18px;
  }

  &:hover {
    background: ${DANGER.string()};
    .material-icons-outlined {
      opacity: 1;
    }
  }
`;
