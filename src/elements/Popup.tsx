import * as S from './Popup.styles';
import React from 'react';
import ReactDOM from 'react-dom';
import useResizeObserver from 'use-resize-observer';
import NewWindow from './NewWindow';
import { ipcRenderer } from 'electron';

export type Origin =
  | 'top left'
  | 'top center'
  | 'top right'
  | 'center left'
  | 'center right'
  | 'bottom left'
  | 'bottom center'
  | 'bottom right';

export interface PopupProps {
  className?: string;
  x: number;
  y: number;
  origin?: Origin;
  onClose?(): void;
}

const Popup: React.FC<PopupProps> = ({
  className,
  x,
  y,
  origin = 'top center',
  children,
  onClose,
}) => {
  const { ref, width, height } = useResizeObserver<HTMLDivElement>();

  React.useEffect(() => {
    console.log('MOUNTED POPUP');
    return () => {
      console.log('UNMOUNTED POPUP');
    };
  }, []);

  React.useEffect(() => {
    if (width == null || height == null) {
      return;
    }

    const [transformOriginVert, transformOriginHor] = origin.split(' ');

    let adjustedY = 0;
    switch (transformOriginVert) {
      case 'top':
        adjustedY = y;
        break;
      case 'center':
        adjustedY = y - height / 2;
        break;
      case 'bottom':
        adjustedY = y - height;
        break;
      default:
        throw new Error('Invalid transform origin');
    }

    let adjustedX = 0;
    switch (transformOriginHor) {
      case 'left':
        adjustedX = x;
        break;
      case 'center':
        adjustedX = x - width / 2;
        break;
      case 'right':
        adjustedX = x - width;
        break;
      default:
        throw new Error('Invalid transform origin');
    }

    ipcRenderer.send('showPopup', {
      x: Math.round(adjustedX),
      y: Math.round(adjustedY),
      width: Math.round(width),
      height: Math.round(height),
    });
  }, [width, height, origin]);

  React.useEffect(() => {
    const onFocus = () => {
      onClose?.();
    };

    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
    };
  });

  return (
    <>
      {ReactDOM.createPortal(<S.Shield onMouseDown={onClose} />, document.body)}
      <NewWindow name="popup">
        <S.Wrapper ref={ref}>{children}</S.Wrapper>
      </NewWindow>
    </>
  );
};

export default Popup;
