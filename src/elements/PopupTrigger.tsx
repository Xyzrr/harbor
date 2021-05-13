import React from 'react';
import { Origin } from './Popup';
import AnchoredPopup from './AnchoredPopup';

export type TriggerGenerator = (props: {
  anchorAttributes: {
    onMouseDown: (e: React.MouseEvent) => void;
  };
  open: boolean;
}) => React.ReactNode;

export interface PopupTriggerProps {
  transformOrigin?: Origin;
  anchorOrigin?: Origin;
  children: TriggerGenerator;
  popupContent(props: { onClose: () => void }): React.ReactNode;
}

const PopupTrigger: React.FC<PopupTriggerProps> = ({
  transformOrigin,
  anchorOrigin,
  children,
  popupContent,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const onMouseDown = React.useCallback((e: React.MouseEvent) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const onClose = React.useCallback(() => {
    // The timeout fixes an insane race condition caused when you click the trigger twice.
    window.setTimeout(() => {
      setAnchorEl(null);
    });
  }, []);

  return (
    <>
      {children({ anchorAttributes: { onMouseDown }, open: anchorEl != null })}
      {anchorEl && (
        <AnchoredPopup
          transformOrigin={transformOrigin}
          anchorOrigin={anchorOrigin}
          anchorEl={anchorEl}
          onClose={onClose}
        >
          {popupContent({ onClose })}
        </AnchoredPopup>
      )}
    </>
  );
};

export default PopupTrigger;
