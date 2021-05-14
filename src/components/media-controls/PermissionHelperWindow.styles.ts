import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  padding: 32px;
  padding-top: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TopBar = styled.div`
  -webkit-app-region: drag;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 4px;
  color: white;
  font-size: 14px;
  font-weight: 600;
`;

export const Title = styled.h2`
  color: white;
  font-size: 18px;
  text-align: center;
`;

export const SubTitle = styled.h3`
  color: #999;
  margin-top: -4px;
  margin-bottom: 28px;
  font-size: 14px;
  text-align: center;
  font-weight: 400;
`;
