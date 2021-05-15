import styled from 'styled-components';
import { LIGHT_BACKGROUND, DARK_BACKGROUND, HIGHLIGHT } from '../constants';

export const Wrapper = styled.div`
  height: 100%;
  background: ${LIGHT_BACKGROUND.string()};
  padding: 44px 8px 8px 8px;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 12px;
  left: 0;
  position: absolute;
  top: 12px;
  width: 100%;
  padding: 8px;
  height: 32px;
  user-select: none;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  background: ${DARK_BACKGROUND.string()};
  border: 1px solid #444;
  border-radius: 4px;
  outline: none;
  color: white;
  &:focus {
    border: 1px solid ${HIGHLIGHT.string()};
  }
  -webkit-app-region: no-drag;
`;

export const NameInputWrapper = styled.div`
  display: flex;
  gap: 8px;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 8px;
  height: 48px;
`;

export const VideoWrapper = styled.div`
  video {
    width: 100%;
    transform: scale(-1, 1);
  }
  margin-bottom: 12px;
  min-height: 64px;
  overflow: hidden;
  border-radius: 4px;
  position: relative;
  background: black;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  -webkit-app-region: no-drag;
`;

export const MediaButtons = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  padding: 8px;
  gap: 8px;
`;
