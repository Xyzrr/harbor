import React from 'react';
import * as S from './Space.styles';
import NewWindow from '../elements/NewWindow';
import Panels from './Panels';
import SpaceMap from './SpaceMap';
import {
  LocalInfoContextProvider,
  LocalInfoContext,
} from '../contexts/LocalInfoContext';
import { LocalMediaContextProvider } from '../contexts/LocalMediaContext';
import { ColyseusContextProvider } from '../contexts/ColyseusContext';
import { DailyVideoCallContextProvider } from '../contexts/VideoCallContext/DailyVideoCallContext';
import Icon from '../elements/Icon';
import AudioInputControl from './media-controls/AudioInputControl';
import VideoInputControl from './media-controls/VideoInputControl';
import AudioOutputControl from './media-controls/AudioOutputControl';
import ScreenShareControl from './media-controls/ScreenShareControl';
import { FirebaseContext } from '../contexts/FirebaseContext';
import GetReady from './GetReady';

export interface SpaceProps {
  spaceId: string;
  metadata: any;
  onExit(): void;
}

const Space: React.FC<SpaceProps> = ({ spaceId, metadata, onExit }) => {
  const { user } = React.useContext(FirebaseContext);
  const { localName } = React.useContext(LocalInfoContext);

  const [ready, setReady] = React.useState(!(user?.isAnonymous && !localName));

  return (
    <>
      <LocalMediaContextProvider>
        <S.TrayPopoutWrapper>
          {ready ? (
            <ColyseusContextProvider spaceId={spaceId}>
              <DailyVideoCallContextProvider spaceId={spaceId}>
                <SpaceMap />
                <S.TopButtons>
                  <S.ExitButton>
                    <Icon name="logout" onClick={onExit} />
                  </S.ExitButton>
                </S.TopButtons>
                <S.BottomButtons>
                  <AudioInputControl />
                  <VideoInputControl />
                  <AudioOutputControl />
                  <ScreenShareControl />
                </S.BottomButtons>
                <NewWindow name="panels">
                  <Panels />
                </NewWindow>
              </DailyVideoCallContextProvider>
            </ColyseusContextProvider>
          ) : (
            <GetReady
              spaceMetadata={metadata}
              onExit={onExit}
              onReady={() => {
                setReady(true);
              }}
            />
          )}
        </S.TrayPopoutWrapper>
        <S.Overlay />
        <S.CaretOverlay />
      </LocalMediaContextProvider>
    </>
  );
};

export default Space;
