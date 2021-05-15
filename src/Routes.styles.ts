import styled, { createGlobalStyle } from 'styled-components';
import { LIGHT_BACKGROUND } from './constants';

export const GlobalStyles = createGlobalStyle`
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
    * {
        box-sizing: border-box;
    }
    strong {
      font-weight: 600;
    }
`;
