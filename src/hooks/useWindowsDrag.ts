import { ipcRenderer } from 'electron';
import React from 'react';
import { NewWindowContext } from '../elements/NewWindow';

export const useWindowsDrag = () => {
  const mousePos = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const win = React.useContext(NewWindowContext);

  const onMouseMove = () => {
    ipcRenderer.send('dragWindow', {
      mouseX: mousePos.current.x,
      mouseY: mousePos.current.y,
    });
  };

  const onMouseUp = (e: MouseEvent) => {
    win?.removeEventListener('mouseup', onMouseUp);
    win?.removeEventListener('mousemove', onMouseMove);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };

    win?.addEventListener('mouseup', onMouseUp);
    win?.addEventListener('mousemove', onMouseMove);
  };

  const onDoubleClick = (e: React.MouseEvent) => {
    ipcRenderer.send('toggleMaximized');
  };

  if (process.platform === 'win32') {
    return { onMouseDown, onDoubleClick };
  }

  return {};
};
