import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100vh;
  padding: 12px;
`;

export const PanelsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-height: 80px;
  -webkit-app-region: drag;
  gap: 12px;
`;
