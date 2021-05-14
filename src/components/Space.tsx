import React from 'react';
import * as S from './Space.styles';
import NewWindow from '../elements/NewWindow';
import Panels from './Panels';
import SpaceMap from './SpaceMap';
import { LocalInfoContextProvider } from '../contexts/LocalInfoContext';
import { LocalMediaContextProvider } from '../contexts/LocalMediaContext';
import { ColyseusContextProvider } from '../contexts/ColyseusContext';
import { DailyVideoCallContextProvider } from '../contexts/VideoCallContext/DailyVideoCallContext';
import Icon from '../elements/Icon';
import AudioInputControl from './media-controls/AudioInputControl';
import VideoInputControl from './media-controls/VideoInputControl';
import AudioOutputControl from './media-controls/AudioOutputControl';
import ScreenShareControl from './media-controls/ScreenShareControl';

export interface SpaceProps {
  className?: string;
  spaceId: string;
}

const Space: React.FC<SpaceProps> = ({ className, spaceId }) => {
  return (
    <>
      <LocalInfoContextProvider>
        <LocalMediaContextProvider>
          <ColyseusContextProvider spaceId={spaceId}>
            <DailyVideoCallContextProvider spaceId={spaceId}>
              <S.TrayPopoutWrapper>
                <S.TopButtons>
                  <S.ExitButton>
                    <Icon name="logout" />
                  </S.ExitButton>
                </S.TopButtons>
                <SpaceMap />
                <S.BottomButtons>
                  <AudioInputControl />
                  <VideoInputControl />
                  <AudioOutputControl />
                  <ScreenShareControl />
                </S.BottomButtons>
              </S.TrayPopoutWrapper>
              <S.Overlay />
              <S.CaretOverlay />
              <NewWindow name="panels">
                <Panels />
              </NewWindow>
            </DailyVideoCallContextProvider>
          </ColyseusContextProvider>
        </LocalMediaContextProvider>
      </LocalInfoContextProvider>
    </>
  );
};

export default Space;
