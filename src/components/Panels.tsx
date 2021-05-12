import React from 'react';
import { ipcRenderer } from 'electron';
import * as S from './Panels.styles';
import NewWindow from './NewWindow';

export interface PanelsProps {
  className?: string;
}

const Panels: React.FC<PanelsProps> = ({ className }) => {
  const panelsWrapperRef = React.useRef<HTMLDivElement>(null);
  const windowRef = React.useRef<Window>(null);

  React.useEffect(() => {
    const onMousePosition = (
      e: Electron.IpcRendererEvent,
      d: [number, number]
    ) => {
      const doc = windowRef.current?.document;

      if (!doc) {
        return;
      }

      const el = doc.elementFromPoint(d[0], d[1]);
      if (panelsWrapperRef.current?.contains(el)) {
        ipcRenderer.send('setIgnoreMouseEvents', false);
      } else {
        ipcRenderer.send('setIgnoreMouseEvents', true);
      }
    };

    ipcRenderer.on('mousePosition', onMousePosition);

    return () => {
      ipcRenderer.off('mousePosition', onMousePosition);
    };
  }, []);

  return (
    <NewWindow name="panels" windowRef={windowRef}>
      <S.Wrapper className={className}>
        <S.PanelsWrapper
          ref={panelsWrapperRef}
          onMouseMove={() => {
            console.log('mouse move');
          }}
        >
          har
        </S.PanelsWrapper>
      </S.Wrapper>
    </NewWindow>
  );
};

export default Panels;
