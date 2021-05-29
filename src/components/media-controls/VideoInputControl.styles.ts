import styled, { css } from 'styled-components';
import Icon from '../../elements/Icon';
import { DANGER } from '../../constants';

export const PrimaryButtonWrapper = styled.div`
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  .material-icons-outlined {
    opacity: 0.8;
    font-size: 18px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

export const CaretButtonWrapper = styled.div`
  position: relative;
  padding: 4px 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const CaretButton = styled(Icon).attrs({ name: 'expand_more' })`
  color: white;
  font-size: 14px;
  display: block;
  opacity: 0.5;
`;

export const Wrapper = styled.div<{ color?: string }>`
  pointer-events: auto;
  user-select: none;
  color: white;
  background: rgba(100, 100, 100, 0.4);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  font-size: 12px;
  display: flex;
  overflow: hidden;
  ${(props) =>
    props.color === 'danger' &&
    css`
      background: ${DANGER.string()};

      ${PrimaryButtonWrapper} {
        .material-icons-outlined {
          opacity: 1;
        }
      }
    `}
`;
