import styled, { css } from 'styled-components';
import Icon from '../elements/Icon';

export const Wrapper = styled.div<{ hidden?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  background: rgba(40, 40, 40, 0.9);
  border-radius: 19px;

  transition: opacity 0.2s;
  ${(props) =>
    props.hidden &&
    css`
      opacity: 0;
    `}
`;

export const MenuItem = styled(Icon)`
  -webkit-app-region: no-drag;
  color: rgb(150, 150, 150);
  font-size: 26px;
  user-select: none;
  padding: 6px;
  &:hover {
    background: rgba(80, 80, 80, 0.5);
    opacity: 1;
  }
  &:active {
    filter: brightness(1.2);
  }
  border-radius: 50%;
`;
