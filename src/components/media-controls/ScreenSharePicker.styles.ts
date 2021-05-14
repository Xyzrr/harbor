import styled, { css } from 'styled-components';
import Button from '../../elements/Button';

export const Wrapper = styled.div`
  flex-wrap: wrap;
  background: #222;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  scrollbar-color: #222;
  &::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-track {
    background-color: #222;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #333;
    border-radius: 6px;
    border: 4px solid #222;
    &:hover {
      background-color: #444;
    }
  }
`;

export const TopBar = styled.div`
  -webkit-app-region: drag;
  width: 100%;
  height: 38px;
  background: #222;
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
`;

export const BottomBar = styled.div`
  width: 100%;
  background: #222;
  position: sticky;
  bottom: 0;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding: 12px;
`;

export const ShareButton = styled(Button)`
  margin-left: 12px;
`;

export const CancelButton = styled(Button)``;

export const ScreensSectionWrapper = styled.div`
  padding: 18px;
`;

export const WindowsSectionWrapper = styled.div`
  padding: 18px;
`;

export const Divider = styled.hr`
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0 18px;
`;

export const ScreenShareOptionsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const Title = styled.h2`
  color: white;
  margin-top: 12px;
  font-size: 20px;
`;

export const ScreenOptionThumbnailWrapper = styled.div`
  height: 162px;
  width: 288px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
`;

export const ScreenOptionThumbnail = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

export const WindowOptionThumbnailWrapper = styled.div`
  height: 120px;
  width: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
`;

export const WindowOptionThumbnail = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

export const WindowOptionLabel = styled.div`
  display: flex;
  max-width: 180px;
  align-items: center;
  margin-bottom: 4px;
`;

export const WindowOptionName = styled.div`
  color: white;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 13px;
`;

export const WindowOptionAppIcon = styled.img`
  margin-right: 6px;
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
`;

export const ScreenShareOption = styled.div<{ selected?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 4px;
  margin-left: -4px;
  margin-top: -4px;
  margin-right: 14px;
  margin-bottom: 14px;
  overflow: hidden;
  border-radius: 4px;
  &:hover {
    ${ScreenOptionThumbnailWrapper}, ${WindowOptionThumbnailWrapper} {
      border: 1px solid rgba(27, 149, 244, 0.6);
    }
  }
  ${(props) =>
    props.selected &&
    css`
      background: rgba(27, 149, 224, 0.4);
      ${ScreenOptionThumbnailWrapper}, ${WindowOptionThumbnailWrapper} {
        border: 1px solid transparent !important;
      }
      ${ScreenOptionThumbnail}, ${WindowOptionThumbnail} {
        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.3);
      }
    `}
`;
