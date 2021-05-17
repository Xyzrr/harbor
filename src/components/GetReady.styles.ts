import styled from 'styled-components';
import { LIGHT_BACKGROUND, DARK_BACKGROUND, HIGHLIGHT } from '../constants';

export const Wrapper = styled.div`
  height: 100%;
  background: ${LIGHT_BACKGROUND.string()};
  padding: 52px 12px 12px 12px;
`;

export const ExitButton = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 12px;
  padding: 4px;
  border-radius: 4px;
  .material-icons-outlined {
    font-size: 18px;
    opacity: 0.8;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    .material-icons-outlined {
      opacity: 1;
    }
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ddd;
  font-size: 14px;
  left: 0;
  position: absolute;
  top: 12px;
  width: 100%;
  padding: 8px;
  height: 40px;
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
  width: 100%;
  display: flex;
  gap: 8px;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 12px;
  height: 56px;
`;

export const VideoWrapper = styled.div`
  video {
    width: 100%;
    transform: scale(-1, 1);
  }
  margin-bottom: 12px;
  min-height: 121px;
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

export const CameraOffMessage = styled.div`
  width: 100%;
  height: 121px;
  color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
`;
