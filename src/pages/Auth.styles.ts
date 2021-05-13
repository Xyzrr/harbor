import Button from '../elements/Button';
import styled from 'styled-components';
import { DARK_BACKGROUND, LIGHT_BACKGROUND } from '../constants';

export const Wrapper = styled.div`
  background: ${LIGHT_BACKGROUND.toString()};
  height: 100vh;
  padding: 32px;
  padding-bottom: 96px;
  color: white;
  -webkit-app-region: drag;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Logo = styled.h1`
  text-align: center;
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
})``;

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
