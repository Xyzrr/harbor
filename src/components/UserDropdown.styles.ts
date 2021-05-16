import styled, { css } from 'styled-components';
import UserAvatar from '../elements/UserAvatar';

export const UserName = styled.div`
  font-size: 13px;
  color: #777;
`;

export const UserInfo = styled.div<{ open?: boolean }>`
  margin-right: 8px;
  display: flex;
  align-items: center;
  padding: 4px;
  padding-left: 10px;
  border-radius: 16px;
  -webkit-app-region: no-drag;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    ${UserName} {
      color: #ddd;
    }
  }
  ${(props) =>
    props.open &&
    css`
      background: rgba(255, 255, 255, 0.1);
      ${UserName} {
        color: #ddd;
      }
    `}
`;

export const UserPhoto = styled.img`
  border-radius: 50%;
  width: 24px;
  margin-left: 8px;
`;

export const StyledUserAvatar = styled(UserAvatar)`
  margin-left: 8px;
`;
