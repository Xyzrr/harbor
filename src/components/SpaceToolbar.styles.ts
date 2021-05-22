import styled from 'styled-components';

export const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  padding: 12px;
  gap: 8px;
  justify-content: space-between;
`;

export const BottomButtonsLeft = styled.div`
  display: flex;
  gap: 8px;
`;

export const BottomButtonsRight = styled.div`
  display: flex;
  gap: 8px;
`;

export const BusyWrapper = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  width: calc(100% - 24px);
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BusyWrapperLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  padding-left: 8px;
`;

export const BusyWrapperRight = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
