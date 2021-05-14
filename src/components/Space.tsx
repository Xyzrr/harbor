import React from 'react';
import * as S from './Space.styles';
import NewWindow from '../elements/NewWindow';
import Panels from './Panels';
import SpaceMap from './SpaceMap';
import { LocalInfoContextProvider } from '../contexts/LocalInfoContext';
import { LocalMediaContextProvider } from '../contexts/LocalMediaContext';
import { ColyseusContextProvider } from '../contexts/ColyseusContext';
import { DailyVideoCallContextProvider } from '../contexts/VideoCallContext/DailyVideoCallContext';

export interface SpaceProps {
  className?: string;
}

const Space: React.FC<SpaceProps> = ({ className }) => {
  return (
    <>
      <LocalInfoContextProvider>
        <LocalMediaContextProvider>
          <ColyseusContextProvider>
            <DailyVideoCallContextProvider>
              <S.TrayPopoutWrapper>
                <SpaceMap />
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
