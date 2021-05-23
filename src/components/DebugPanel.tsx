import * as S from './DebugPanel.styles';
import React from 'react';
import isHotkey from 'is-hotkey';
import { VideoCallDebugContext } from '../contexts/VideoCallContext/VideoCallContext';
import { NewWindowContext } from '../elements/NewWindow';

export const useDebugPanel = () => {
  const [showDebugPanel, setShowDebugPanel] = React.useState(false);
  const newWindow = React.useContext(NewWindowContext);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isHotkey('meta+shift+d')(e)) {
        console.log('showing debug');
        setShowDebugPanel((s) => !s);
      }
    };

    newWindow.addEventListener('keydown', onKeyDown);

    return () => {
      newWindow.removeEventListener('keydown', onKeyDown);
    };
  }, [newWindow]);

  return { showDebugPanel, setShowDebugPanel };
};

export interface DebugPanelProps {
  className?: string;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ className }) => {
  const debugStats = React.useContext(VideoCallDebugContext);

  return (
    <S.Wrapper className={className}>
      {debugStats ? (
        <>
          {Object.entries(debugStats).map(([key, value]) => {
            const valueOrID = (value as any)?.id ?? value;
            const formattedValueOrID =
              typeof valueOrID === 'string'
                ? valueOrID
                : JSON.stringify(valueOrID);
            return (
              <S.Stat key={key}>
                <S.StatLabel>{key}:</S.StatLabel>
                <S.StatValue>{formattedValueOrID}</S.StatValue>
              </S.Stat>
            );
          })}
        </>
      ) : (
        <>Loading</>
      )}
    </S.Wrapper>
  );
};

export default DebugPanel;
