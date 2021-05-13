import styled from 'styled-components';

export const Wrapper = styled.div`
  color: white;
  border-radius: 50%;
  background: #444;
  font-size: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  &:hover {
    filter: brightness(1.1);
  }
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
`;
