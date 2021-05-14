import styled from 'styled-components';
import UserAvatar from '../elements/UserAvatar';

export const LiquidUserAvatar = styled(UserAvatar)`
  width: 100%;
  height: 100%;
  font-size: 14px;
`;

export const Wrapper = styled.div<{ color: string }>`
  position: absolute;
  width: 30px;
  height: 30px;
  left: -15px;
  top: -15px;
  border: 2px solid ${(props) => props.color};
  background: ${(props) => props.color};
  border-radius: 50%;
  ${LiquidUserAvatar} {
    background: ${(props) => props.color};
  }
`;
