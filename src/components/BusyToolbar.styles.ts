import styled from 'styled-components';
import { Switch } from '@material-ui/core';
import Icon from '../elements/Icon';

export const Wrapper = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  width: calc(100% - 24px);
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
`;

export const WrapperLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  padding-left: 10px;
`;

export const TypeIcon = styled(Icon)`
  font-size: 20px;
`;

export const WrapperRight = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const TimeLeft = styled.div`
  color: #888;
  font-size: 12px;
`;

export const StyledSwitch = styled(Switch)`
  padding: 8px;
  .MuiButtonBase-root {
    color: white;
  }
  .MuiSwitch-track {
    border-radius: 11px;
    background-color: #333 !important;
    opacity: 1 !important;
  }
  .MuiSwitch-thumb {
    transform: scale(0.8);
  }
`;
