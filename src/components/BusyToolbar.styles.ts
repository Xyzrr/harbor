import styled from 'styled-components';

export const Wrapper = styled.div`
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

export const WrapperLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  padding-left: 8px;
`;

export const WrapperRight = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const TimeLeft = styled.div`
  color: #999;
  font-size: 12px;
`;
