import styled, { createGlobalStyle } from 'styled-components';
import { LIGHT_BACKGROUND } from './constants';

export const GlobalStyles = createGlobalStyle`
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
    * {
        box-sizing: border-box;
    }
`;

export const Caret = styled.div`
  border: 8px solid transparent;
  border-bottom: 8px solid ${LIGHT_BACKGROUND.toString()};
  width: 18px;
  height: 18px;
  left: 50%;
  top: 0;
  position: absolute;
  transform: translate(-50%, -7px);
  z-index: 1;
`;

export const CaretRim = styled.div`
  border: 9px solid transparent;
  border-bottom: 9px solid rgb(99, 99, 99);
  width: 18px;
  height: 18px;
  left: 50%;
  top: 0;
  position: absolute;
  transform: translate(-50%, -9px);
`;

export const Wrapper = styled.div`
  margin-top: 8px;
  background: ${LIGHT_BACKGROUND.toString()};
  width: 100vw;
  height: 100vh;
  border-radius: 8px;
  position: relative;
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
`;
