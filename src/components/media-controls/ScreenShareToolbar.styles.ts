import styled from 'styled-components';
import Button from '../../elements/Button';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  -webkit-app-region: drag;
`;

export const StopButton = styled(Button).attrs({
  color: 'danger',
  variant: 'contained',
})`
  -webkit-app-region: no-drag;
`;
