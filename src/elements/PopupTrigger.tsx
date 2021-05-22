import * as S from './PopupTrigger.styles';

import React from 'react';
import { Origin } from './Popup';
import AnchoredPopup from './AnchoredPopup';
import NewWindow from './NewWindow';

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
  transformOrigin?: Origin;
  anchorOrigin?: Origin;
  children: TriggerGenerator;
  popupContent(props: { onClose: () => void }): React.ReactNode;
}

const PopupTrigger: React.FC<PopupTriggerProps> = ({
  on = 'click',
  transformOrigin,
  anchorOrigin,
  children,
  popupContent,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const popupHoveredRef = React.useRef(false);

  const onMouseDown = React.useCallback((e: React.MouseEvent) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const onClose = React.useCallback(() => {
    // The timeout fixes an insane race condition caused when you click the trigger twice.
    window.setTimeout(() => {
      setAnchorEl(null);
    });
  }, []);

  const onMouseEnter = React.useCallback((e: React.MouseEvent) => {
    setAnchorEl(e.currentTarget);
    console.log('mouse enter');
  }, []);

  const onMouseLeave = React.useCallback((e: React.MouseEvent) => {
    window.setTimeout(() => {
      if (!popupHoveredRef.current) {
        setAnchorEl(e.currentTarget);
      }
    });
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
