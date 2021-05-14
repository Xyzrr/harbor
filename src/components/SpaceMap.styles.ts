import styled from 'styled-components';
import { DARK_BACKGROUND } from '../constants';

export const Wrapper = styled.div`
  height: 100%;
  background: ${DARK_BACKGROUND.toString()};
  overflow: hidden;
`;

export const Dot = styled.div`
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 50%;
  position: absolute;
  left: 1.5px;
  top: -1.5px;
`;
