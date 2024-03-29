import * as S from './PopupTrigger.styles';

import React from 'react';
import { Origin } from './Popup';
import AnchoredPopup from './AnchoredPopup';
import NewWindow, { NewWindowContext } from './NewWindow';

export type TriggerGenerator = (props: {
  anchorAttributes: {
    onMouseDown?: (e: React.MouseEvent) => void;
    onMouseEnter?: (e: React.MouseEvent) => void;
    onMouseLeave?: (e: React.MouseEvent) => void;
  };
  open: boolean;
}) => React.ReactNode;

export interface PopupTriggerProps {
  on?: 'click' | 'hover';
  xOffset?: number;
  yOffset?: number;
  transformOrigin?: Origin;
  anchorOrigin?: Origin;
  children: TriggerGenerator;
  popupContent(props: { onClose: () => void }): React.ReactNode;
}

const PopupTrigger: React.FC<PopupTriggerProps> = ({
  on = 'click',
  xOffset,
  yOffset,
  transformOrigin,
  anchorOrigin,
  children,
  popupContent,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const popupHoveredRef = React.useRef(false);
  const newWindow = React.useContext(NewWindowContext);

  const onMouseDown = React.useCallback((e: React.MouseEvent) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const onClose = React.useCallback(() => {
    // The timeout fixes an insane race condition caused when you click the trigger twice.
    newWindow.setTimeout(() => {
      setAnchorEl(null);
    });
  }, []);

  const onMouseEnter = React.useCallback((e: React.MouseEvent) => {
    setAnchorEl(e.currentTarget);
    console.log('mouse enter');
  }, []);

  const onMouseLeave = React.useCallback((e: React.MouseEvent) => {
    newWindow.setTimeout(() => {
      if (!popupHoveredRef.current) {
        setAnchorEl(e.currentTarget);
      }
    }, 100);
  }, []);

  return (
    <>
      {children({
        anchorAttributes:
          on === 'click' ? { onMouseDown } : { onMouseEnter, onMouseLeave },
        open: anchorEl != null,
      })}
      {anchorEl && on === 'click' && (
        <NewWindow name="popup-shield">
          <S.PopupShield
            onClick={() => {
              setAnchorEl(null);
            }}
          />
        </NewWindow>
      )}
      {anchorEl && (
        <AnchoredPopup
          transformOrigin={transformOrigin}
          anchorOrigin={anchorOrigin}
          anchorEl={anchorEl}
          xOffset={xOffset}
          yOffset={yOffset}
          onClose={onClose}
          onMouseEnter={() => {
            popupHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            popupHoveredRef.current = false;
          }}
        >
          {popupContent({ onClose })}
        </AnchoredPopup>
      )}
    </>
  );
};

export default PopupTrigger;
