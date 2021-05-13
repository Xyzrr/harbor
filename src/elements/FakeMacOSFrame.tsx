import * as S from './FakeMacOSFrame.styles';
import React from 'react';
import os from 'os';

export interface FakeMacOSFrameProps {
  className?: string;
}

const FakeMacOSFrame: React.FC<FakeMacOSFrameProps> = ({ className }) => {
  if (process.platform !== 'darwin') {
    return null;
  }

  return (
    <S.Wrapper
      className={className}
      bigSur={os.version().startsWith('Darwin Kernel Version 20.')}
    />
  );
};

export default FakeMacOSFrame;
