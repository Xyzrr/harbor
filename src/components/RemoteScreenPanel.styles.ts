import styled, { css } from 'styled-components';
import Icon from '../elements/Icon';
import CursorsOverlay from './media-controls/CursorsOverlay';
import { DARK_BACKGROUND } from '../constants';

const baseBoxShadow =
  '0px 0px 1px rgba(255, 255, 255, 0.4), 0px 2px 6px rgba(0, 0, 0, 0.4)';

export const Wrapper = styled.div`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  transition: width 0.15s, height 0.15s;
  box-shadow: ${baseBoxShadow};
  width: 100%;
  height: 100%;
  background: ${DARK_BACKGROUND.string()};
  ${process.platform !== 'win32' && '-webkit-app-region: drag;'}
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
