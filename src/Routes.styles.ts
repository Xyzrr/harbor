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

const W = 200;
const H = 200;
const R = 6;
const O = 12;

export const Wrapper = styled.div`
  background: ${LIGHT_BACKGROUND.toString()};
  width: 100vw;
  height: 100vh;
  position: relative;
  clip-path: path(
    'M ${W / 2} 0
    L ${W / 2 + O} ${O}
    L ${W - R} ${O}
    A ${R} ${R} 0 0 1 ${W} ${O + R}
    L ${W} ${H - R}
    A ${R} ${R} 0 0 1 ${W - R} ${H}
    L ${R} ${H}
    A ${R} ${R} 0 0 1 0 ${H - R}
    L 0 ${O + R}
    A ${R} ${R} 0 0 1 ${R} ${O}
    L ${W / 2 - O} ${O}
    z'
  );
  // box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
  //   inset 0 0 0 1px rgba(255, 255, 255, 0.2);
`;
