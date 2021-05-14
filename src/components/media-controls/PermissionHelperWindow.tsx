import * as S from './PermissionHelperWindow.styles';

import React from 'react';
import NewWindow from '../../elements/NewWindow';
import { ipcRenderer, desktopCapturer } from 'electron';
import Button from '../../elements/Button';

export interface PermissionHelperWindowProps {
  className?: string;
  onClose?(): void;
  onGranted?(): void;
}

const PermissionHelperWindow: React.FC<PermissionHelperWindowProps> = React.memo(
  function PermissionHelperWindow({ className, onClose, onGranted }) {
    React.useEffect(() => {
      desktopCapturer.getSources({
        types: ['screen', 'window'],
      });

      const interval = window.setInterval(async () => {
        const screenAccess = await ipcRenderer.invoke(
          'getMediaAccessStatus',
          'screen'
        );

        if (screenAccess === 'granted') {
          onGranted?.();
        }
      }, 1000);

      return () => {
        window.clearInterval(interval);
      };
    }, []);

    return (
      <NewWindow name="permission-helper-window" onClose={onClose}>
        <S.Wrapper>
          <S.TopBar>
            <Button size="small" onClick={onClose}>
              Cancel
            </Button>
          </S.TopBar>
          <S.Title>
            To screen share, Harbor needs screen recording permission.
          </S.Title>
          <S.SubTitle>
            MacOS Security &amp; Privacy Settings &gt; Privacy &gt; Screen
            Recording
          </S.SubTitle>
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={() => {
              ipcRenderer.send(
                'openSystemPreferences',
                'security',
                'Privacy_ScreenCapture'
              );
            }}
          >
            Open MacOS Privacy Settings
          </Button>
        </S.Wrapper>
      </NewWindow>
    );
  }
);

export default PermissionHelperWindow;
