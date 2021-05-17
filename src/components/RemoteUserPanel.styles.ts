import styled, { css } from 'styled-components';
import Icon from '../elements/Icon';
import { DARK_BACKGROUND } from '../constants';

export const Wrapper = styled.div<{
  recentlyLoud: boolean;
  noVideo?: boolean;
  whisperTarget?: boolean;
  backgrounded?: boolean;
}>`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  transition: box-shadow 0.15s, width 0.15s, height 0.15s;
  box-shadow: 0 0 0 2px rgba(0, 255, 0, 0);
  width: 100%;
  height: 100%;
  background: ${DARK_BACKGROUND.string()};
  ${process.platform !== 'win32' && '-webkit-app-region: drag;'}

  video {
    display: block;
    width: 100%;
    height: 100%;
  }
  ${(props) =>
    props.recentlyLoud &&
    css`
      box-shadow: 0 0 0 2px rgba(0, 255, 0, 1);
    `}
  ${(props) =>
    props.noVideo &&
    css`
      background: ${DARK_BACKGROUND.lighten(0.5).string()};
    `}
    ${(props) =>
    props.whisperTarget &&
    css`
      box-shadow: 0 0 0 2px rgba(255, 255, 0, 1);
    `}
    ${(props) =>
    props.backgrounded &&
    css`
      video {
        opacity: 0.4;
      }
    `}
`;

export const StatusIcons = styled.div`
  display: flex;
  padding-left: 4px;
`;

export const StatusIcon = styled(Icon)`
  padding: 4px;
  padding-left: 0;
  color: red;
  margin-left: -3px;
`;

export const Name = styled.span`
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.7);
  font-size: 13px;
  opacity: 0.7;
  white-space: nowrap;
`;

export const InfoBarLeft = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  mask-image: linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 12px);
  width: 100%;
  height: 100%;
`;

export const InfoBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  padding: 4px 8px;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  height: 40px;
`;
