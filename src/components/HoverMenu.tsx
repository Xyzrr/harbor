import * as S from './HoverMenu.styles';
import React from 'react';

export interface HoverMenuProps {
  className?: string;
  hidden?: boolean;
}

const HoverMenu: React.FC<HoverMenuProps> = ({
  className,
  children,
  hidden,
}) => {
  return (
    <S.Wrapper className={className} hidden={hidden}>
      {children}
    </S.Wrapper>
  );
};

export default HoverMenu;
