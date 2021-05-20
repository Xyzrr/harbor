import styled from 'styled-components';

export const Wrapper = styled.div`
  -webkit-app-region: drag;
  width: 100%;
  height: 100%;
  background: white;
  position: absolute;
  left: 0;
  top: 0;
  padding: 12px;
  z-index: 4;
`;

export const Stat = styled.div`
  display: flex;
  padding: 4px;
`;

export const StatLabel = styled.div`
  color: #999;
  width: 160px;
`;

export const StatValue = styled.div``;
