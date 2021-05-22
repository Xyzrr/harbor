import styled from 'styled-components';
import Icon from '../elements/Icon';

export const Wrapper = styled.div`
  user-select: none;
  color: white;
  background: rgba(100, 100, 100, 0.4);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  overflow: hidden;

  .material-icons-outlined {
    opacity: 0.8;
    transform: rotate(180deg);
    font-size: 18px;
  }

  &:hover {
    filter: brightness(1.2);
    .material-icons-outlined {
      opacity: 1;
    }
  }
`;

export const Arrow = styled(Icon).attrs({ name: 'arrow_right' })`
  margin-left: 8px;
  font-size: 16px;
  width: 16px;
  overflow: hidden;
`;
