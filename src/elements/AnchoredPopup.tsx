import React from 'react';
import Popup, { Origin } from './Popup';

export interface AnchoredPopupProps {
  className?: string;
  anchorEl: Element;
  transformOrigin?: Origin;
  anchorOrigin?: Origin;
  onClose?(): void;
}

const AnchoredPopup: React.FC<AnchoredPopupProps> = ({
  className,
  anchorEl,
  transformOrigin,
  anchorOrigin = 'bottom center',
  onClose,
  children,
}) => {
  const anchorRect = React.useMemo(
    () => anchorEl.getBoundingClientRect(),
    [anchorEl]
  );

  const [anchorOriginVert, anchorOriginHor] = anchorOrigin.split(' ');

  let y = 0;
  switch (anchorOriginVert) {
    case 'top':
      y = anchorRect.top;
      break;
    case 'center':
      y = anchorRect.top + anchorRect.height / 2;
      break;
    case 'bottom':
      y = anchorRect.bottom;
      break;
    default:
      throw new Error('Invalid anchor origin');
  }

  let x = 0;
  switch (anchorOriginHor) {
    case 'left':
      x = anchorRect.left;
      break;
    case 'center':
      x = anchorRect.left + anchorRect.width / 2;
      break;
    case 'right':
      x = anchorRect.right;
      break;
    default:
      throw new Error('Invalid anchor origin');
  }

  return (
    <Popup
      className={className}
      origin={transformOrigin}
      x={x}
      y={y}
      onClose={onClose}
    >
      {children}
    </Popup>
  );
};

export default AnchoredPopup;
