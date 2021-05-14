import React from 'react';

export const useMouseIsIdle = (opts?: {
  minDuration?: number;
  containerRef?: React.RefObject<HTMLElement>;
}) => {
  const { minDuration = 2000, containerRef } = opts || {};

  const lastMouseMoveTimerRef = React.useRef<number | null>(null);
  const [mouseIsIdle, setMouseIsIdle] = React.useState(true);

  React.useEffect(() => {
    const container = containerRef ? containerRef.current : document;

    const onMouseMove = () => {
      setMouseIsIdle(false);
      if (lastMouseMoveTimerRef.current != null) {
        window.clearTimeout(lastMouseMoveTimerRef.current);
      }
      lastMouseMoveTimerRef.current = window.setTimeout(() => {
        setMouseIsIdle(true);
      }, minDuration);
    };

    const onMouseLeave = () => {
      setMouseIsIdle(true);
    };

    const onKeyDown = () => {
      // This made sense for editable documents, but I find
      // it to be annoying here when you want to move while
      // using the mouse.
      // setMouseIsIdle(true);
    };

    container?.addEventListener('mousemove', onMouseMove);
    container?.addEventListener('mouseleave', onMouseLeave);
    container?.addEventListener('keydown', onKeyDown);

    return () => {
      container?.removeEventListener('mousemove', onMouseMove);
      container?.removeEventListener('mouseleave', onMouseLeave);
      container?.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return mouseIsIdle;
};
