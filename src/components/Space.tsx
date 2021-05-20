import React from 'react';
import * as S from './Space.styles';
import NewWindow, { NewWindowContext } from '../elements/NewWindow';
import Panels from './Panels';
import SpaceMap from './SpaceMap';
import { UserSettingsContext } from '../contexts/UserSettingsContext';
import { LocalMediaContextProvider } from '../contexts/LocalMediaContext';
import {
  ColyseusContextProvider,
  ColyseusContext,
} from '../contexts/ColyseusContext';
import { DailyVideoCallContextProvider } from '../contexts/VideoCallContext/DailyVideoCallContext';
import Icon from '../elements/Icon';
import AudioInputControl from './media-controls/AudioInputControl';
import VideoInputControl from './media-controls/VideoInputControl';
import AudioOutputControl from './media-controls/AudioOutputControl';
import ScreenShareControl from './media-controls/ScreenShareControl';
import { FirebaseContext } from '../contexts/FirebaseContext';
import GetReady from './GetReady';
import { PlayerStateContextProvider } from '../contexts/PlayerStateContext';
import os from 'os';
import DebugPanel, { useDebugPanel } from './DebugPanel';

export interface SpaceProps {
  spaceId: string;
  metadata: any;
  onExit(): void;
}

const Space: React.FC<SpaceProps> = ({ spaceId, metadata, onExit }) => {
  const { user } = React.useContext(FirebaseContext);
  const { localName } = React.useContext(UserSettingsContext);

  const [ready, setReady] = React.useState(!(user?.isAnonymous && !localName));

  const win = React.useContext(NewWindowContext);
  const [observedSize, setObservedSize] = React.useState({
    width: 10,
    height: 10,
  });
  React.useEffect(() => {
    if (!win) {
      return;
    }

    const onResize = () => {
      setObservedSize({ width: win.innerWidth, height: win.innerHeight });
    };

    win.addEventListener('resize', onResize);

    return () => {
      win.removeEventListener('resize', onResize);
    };
  }, [win]);

  const W = observedSize.width;
  const O = 12;
  const H = observedSize.height - O;
  const R = os.version().startsWith('Darwin Kernel Version 20.') ? 10 : 6;

  const { showDebugPanel, setShowDebugPanel } = useDebugPanel();

  return (
    <>
      <LocalMediaContextProvider>
        <S.TrayPopoutWrapper W={W} H={H} O={O} R={R}>
          {ready ? (
            <PlayerStateContextProvider>
              <ColyseusContextProvider spaceId={spaceId}>
                <DailyVideoCallContextProvider spaceId={spaceId}>
                  <SpaceMap />
                  <S.TopButtons O={O}>
                    <S.ExitButton>
                      <Icon name="logout" onClick={onExit} />
                    </S.ExitButton>
                  </S.TopButtons>
                  <S.BottomButtons>
                    <AudioInputControl />
                    <VideoInputControl showPreviewOnHover />
                    <AudioOutputControl />
                    <ScreenShareControl />
                  </S.BottomButtons>
                  <NewWindow name="panels">
                    <Panels />
                  </NewWindow>
                  {showDebugPanel && (
                    <NewWindow
                      name="debug-panel"
                      onClose={() => setShowDebugPanel(false)}
                    >
                      <DebugPanel />
                    </NewWindow>
                  )}
                </DailyVideoCallContextProvider>
              </ColyseusContextProvider>
            </PlayerStateContextProvider>
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
        <S.Overlay W={W} H={H} O={O} R={R} />
        <S.CaretOverlay W={W} O={O} />
      </LocalMediaContextProvider>
    </>
  );
};

export default Space;
