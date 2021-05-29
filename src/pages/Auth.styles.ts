import Button from '../elements/Button';
import styled, { css } from 'styled-components';
import { DARK_BACKGROUND, LIGHT_BACKGROUND } from '../constants';
import os from 'os';

export const Wrapper = styled.div`
  height: 100vh;
  padding: 32px;
  padding-bottom: 48px;
  color: white;
  -webkit-app-region: drag;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${process.platform === 'win32' &&
  css`
    background-color: ${LIGHT_BACKGROUND.string()};
  `}
`;

export const Logo = styled.img`
  margin-bottom: 32px;
  user-select: none;
  width: 148px;
`;

export const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
`;

export const LoginButton = styled(Button).attrs({
  variant: 'contained',
  color: 'primary',
  size: 'large',
})`
  margin-bottom: 12px;
`;

export const GuestButton = styled(Button).attrs({
  variant: 'contained',
})`
  font-size: 14px;
`;

export const LoaderWrapper = styled.div`
  height: 78px;
`;

export const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
`;

export const ErrorTitle = styled.h2`
  text-align: center;
  margin-top: 0;
  margin-bottom: 8px;
  color: #ccc;
`;

export const ErrorDetails = styled.p`
  text-align: center;
  margin-top: 0;
  color: #999;
  margin-bottom: 24px;
`;
