import * as S from './HiddenSelect.styles';
import React from 'react';

export type HiddenSelectProps = Omit<React.ComponentProps<'select'>, 'ref'>;

const HiddenSelect: React.FC<HiddenSelectProps> = React.forwardRef<
  HTMLSelectElement,
  HiddenSelectProps
>(function HiddenSelect({ onFocus, ...standardProps }, ref) {
  return (
    <S.Wrapper
      {...standardProps}
      ref={ref}
      onFocus={(e) => {
        e.currentTarget.blur();
        onFocus?.(e);
      }}
    />
  );
});
export default HiddenSelect;
