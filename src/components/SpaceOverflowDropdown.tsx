import * as S from './SpaceOverflowDropdown.styles';
import React from 'react';
import Icon from '../elements/Icon';

export interface SpaceOverflowDropdownProps {
  className?: string;
}

const SpaceOverflowDropdown: React.FC<SpaceOverflowDropdownProps> = ({
  className,
}) => {
  return (
    <S.Wrapper className={className}>
      <Icon name="more_vert" />
    </S.Wrapper>
  );
};

export default SpaceOverflowDropdown;
