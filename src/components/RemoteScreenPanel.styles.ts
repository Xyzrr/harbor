import styled, { css } from 'styled-components';
import Icon from '../elements/Icon';
import CursorsOverlay from './media-controls/CursorsOverlay';
import { DARK_BACKGROUND } from '../constants';

export const Wrapper = styled.div`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  transition: box-shadow 0.15s;
  box-shadow: 0 0 0 2px rgba(0, 255, 0, 0);
  width: 100%;
  height: 100%;
  background: ${DARK_BACKGROUND.toString()};
  video {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

export const StatusIcons = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 4px;
  display: flex;
`;

export const StatusIcon = styled(Icon)`
  padding: 4px;
  color: red;
`;

export const ShiftedCursorsOverlay = styled(CursorsOverlay)<{
  x: number;
  y: number;
  width: number;
  height: number;
}>`
  & {
    left: ${(props) => props.x}px;
    top: ${(props) => props.y}px;
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
  }
`;
