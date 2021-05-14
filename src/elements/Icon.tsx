import * as S from './Icon.styles';
import React from 'react';
import classNames from 'classnames';

export type IconProps = Omit<React.ComponentProps<'i'>, 'ref'> & {
  name: string;
};

const Icon: React.FC<IconProps> = React.forwardRef<HTMLDivElement, IconProps>(
  function Icon({ name, className, ...standardProps }, ref) {
    return (
      <S.Wrapper
        {...standardProps}
        ref={ref}
        className={classNames(`material-icons-outlined`, className)}
      >
        {name}
      </S.Wrapper>
    );
  }
);
export default Icon;
