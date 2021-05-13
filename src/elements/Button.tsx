import * as S from './Button.styles';
import React from 'react';

export type ButtonProps = Omit<React.ComponentProps<'a'>, 'ref'> & {
  variant?: 'contained' | 'outlined';
  color?: 'primary' | 'danger' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = React.forwardRef<
  HTMLAnchorElement,
  ButtonProps
>(function Button(
  { variant, color = 'secondary', disabled, size, ...standardProps },
  ref
) {
  return (
    <S.Wrapper
      {...standardProps}
      ref={ref}
      variant={variant}
      color={color}
      disabled={disabled}
      size={size}
    />
  );
});

export default Button;
