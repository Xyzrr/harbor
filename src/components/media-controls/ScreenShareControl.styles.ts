import styled, { css } from 'styled-components';
import { HIGHLIGHT } from '../../constants';

export const PrimaryButtonWrapper = styled.div`
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  .material-icons-outlined {
    font-size: 18px;
    opacity: 0.8;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

export const Wrapper = styled.div<{ color?: string }>`
  user-select: none;
  color: white;
  background: rgba(100, 100, 100, 0.4);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  font-size: 12px;
  display: flex;
  overflow: hidden;
  ${(props) =>
    props.color === 'highlight' &&
    css`
      background: ${HIGHLIGHT.string()};
      ${PrimaryButtonWrapper} {
        .material-icons-outlined {
          opacity: 1;
        }
      }
    `}
`;
