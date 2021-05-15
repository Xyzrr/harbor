import styled, { css } from 'styled-components';
import { DARK_BACKGROUND, HIGHLIGHT, LIGHT_BACKGROUND } from '../constants';
import UserAvatar from '../elements/UserAvatar';

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${LIGHT_BACKGROUND.toString()};
`;

export const TopBar = styled.div`
  height: 40px;
  width: 100%;
  -webkit-app-region: drag;
  position: sticky;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  user-select: none;
`;

export const Heading = styled.h1`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  color: #ddd;
  font-size: 14px;
  text-align: center;
  font-weight: 500;
`;

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

export const Spaces = styled.div`
  display: flex;
  padding: 8px 20px 20px;
`;

export const UserInfoPopup = styled.div`
  background: #333;
  padding: 8px;
  width: 140px;
  color: white;
`;

export const Space = styled.div<{ active?: boolean }>`
  cursor: default;
  text-select: none;
  width: 180px;
  height: 180px;
  background: ${LIGHT_BACKGROUND.lighten(0.2).string()};
  border-radius: 8px;
  padding: 20px;
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
    inset 1px 0 0 0 rgba(255, 255, 255, 0.04),
    inset -1px 0 0 0 rgba(255, 255, 255, 0.04);
  &:hover {
    background: ${LIGHT_BACKGROUND.lighten(0.4).toString()};
  }
  margin-right: 12px;
  margin-bottom: 12px;
  ${(props) =>
    props.active &&
    css`
      && {
        background: ${LIGHT_BACKGROUND.darken(0.2).toString()};
        box-shadow: inset 0 -1px 0 0 rgba(255, 255, 255, 0.1),
          inset 1px 0 0 0 rgba(255, 255, 255, 0.04),
          inset -1px 0 0 0 rgba(255, 255, 255, 0.04);
      }
    `}
`;

export const SpaceName = styled.h2`
  color: white;
  font-weight: 500;
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 4px;
`;

export const GreenDot = styled.div`
  background: ${HIGHLIGHT.toString()};
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 8px;
  margin-left: 1px;
`;

export const SpaceActivity = styled.div`
  color: #aaa;
  font-size: 13px;
  display: flex;
  align-items: center;
`;

export const CreateSpace = styled.div`
  text-select: none;
  width: 180px;
  height: 180px;
  margin-right: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  padding: 18px;
  border: 2px dotted #555;
  cursor: default;
`;

export const CreateSpaceTitle = styled.h2`
  color: #888;
  font-weight: 500;
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 8px;
`;

export const CreateSpaceSubTitle = styled.h3`
  color: #555;
  font-weight: 500;
  font-size: 12px;
  margin-top: 0;
`;

export const GuestSignInButton = styled.div`
  text-decoration: none;
  font-size: 13px;
  margin-right: 12px;
  color: #777;
  &:hover {
    color: #ddd;
  }
`;
