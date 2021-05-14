import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100vh;
  background: rgba(0, 255, 0, 0.2);
  color: red;
  padding: 12px;
`;

export const PanelsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: red;
  min-height: 80px;
  -webkit-app-region: drag;
  &:hover {
    background: blue;
  }
`;
