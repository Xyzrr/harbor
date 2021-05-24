import styled from 'styled-components';
import { DARK_BACKGROUND, DANGER } from '../constants';

export const Wrapper = styled.div`
  height: 100%;
  background: ${DARK_BACKGROUND.string()};
  overflow: hidden;
`;

export const ColyseusError = styled.div`
  background: ${DANGER.string()};
  width: 100%;
  color: white;
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  padding: 8px 40px;
  padding-top: 20px;
  font-size: 13px;
`;
