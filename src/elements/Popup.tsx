import * as S from './Popup.styles';
import React from 'react';
import ReactDOM from 'react-dom';
import useResizeObserver from 'use-resize-observer';
import NewWindow, { NewWindowContext } from './NewWindow';
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

interface Dimensions {
  width: number;
  height: number;
}

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
  // TODO: figure out why the ResizeObserver approach doesn't work
  // const { ref, width, height } = useResizeObserver<HTMLDivElement>();

  const ref = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState<Dimensions | null>(null);
  const newWindow = React.useContext(NewWindowContext);
  const width = dimensions?.width;
  const height = dimensions?.height;
  React.useEffect(() => {
    let timeoutID: number;
    const getDimensionsIfAvailable = () => {
      if (ref.current == null) {
        timeoutID = setTimeout(getDimensionsIfAvailable);
        return;
      }
      setDimensions({
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
      });
    };
    timeoutID = setTimeout(getDimensionsIfAvailable);
    return () => clearTimeout(timeoutID);
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
      x: Math.round(adjustedX + newWindow.screenX),
      y: Math.round(adjustedY + newWindow.screenY),
      width: Math.round(width),
      height: Math.round(height),
    });
  }, [width, height, origin, newWindow, x, y]);

  React.useEffect(() => {
    const onParentFocus = () => {
      onClose?.();
    };

    const onParentHide = () => {
      onClose?.();
    };

    newWindow.addEventListener('focus', onParentFocus);
    newWindow.document.addEventListener('visibilitychange', onParentHide);
    return () => {
      newWindow.removeEventListener('focus', onParentFocus);
      newWindow.document.removeEventListener('visibilitychange', onParentHide);
    };
  }, [newWindow, onClose]);

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
