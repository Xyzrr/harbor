import * as S from './TimeLeft.styles';
import React from 'react';
import { NewWindowContext } from './NewWindow';

export interface TimeLeftProps {
  className?: string;
  until: number;
}

const TimeLeft: React.FC<TimeLeftProps> = React.memo(function TimeLeft({
  className,
  until,
}) {
  const newWindow = React.useContext(NewWindowContext);

  const getTimeLeftString = React.useCallback(() => {
    const diff = until - Date.now();

    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.ceil((diff % (60 * 60 * 1000)) / (60 * 1000));

    if (hours === 0) {
      return `${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
  }, [until]);

  const [timeLeftString, setTimeLeftString] = React.useState(() =>
    getTimeLeftString()
  );

  React.useEffect(() => {
    const interval = newWindow.setInterval(() => {
      setTimeLeftString(getTimeLeftString());
    }, 1000);

    return () => {
      newWindow.clearInterval(interval);
    };
  }, [newWindow, getTimeLeftString]);

  return <S.Wrapper className={className}>{timeLeftString}</S.Wrapper>;
});

export default TimeLeft;
