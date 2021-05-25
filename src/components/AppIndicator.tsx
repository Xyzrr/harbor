import * as S from './AppIndicator.styles';
import React from 'react';
import { AppInfo, APPS } from '../hooks/useAppTracker';

export interface AppIndicatorProps {
  className?: string;
  appInfo: AppInfo;
}

const AppIndicator: React.FC<AppIndicatorProps> = ({ className, appInfo }) => {
  const src = APPS.find((app) => app.name === appInfo.name)?.icon;

  return <S.Wrapper className={className} src={src} active={appInfo.active} />;
};

export default AppIndicator;
