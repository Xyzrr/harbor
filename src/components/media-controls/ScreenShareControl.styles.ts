import styled, { css } from 'styled-components';
import { HIGHLIGHT } from '../../constants';

export const PrimaryButtonWrapper = styled.div`
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  .material-icons-outlined {
    font-size: 18px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const Wrapper = styled.div<{ color?: string }>`
  user-select: none;
  color: white;
  background: rgba(100, 100, 100, 0.5);
  border-radius: 8px;
  font-size: 12px;
  display: flex;
  overflow: hidden;
  margin-right: 8px;
  ${(props) =>
    props.color === 'highlight' &&
    css`
      background: ${HIGHLIGHT.toString()};
      ${PrimaryButtonWrapper} {
        .material-icons-outlined {
          opacity: 1;
        }
      }
    `}
`;
