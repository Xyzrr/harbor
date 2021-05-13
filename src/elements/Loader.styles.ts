import styled from 'styled-components';

export const Wrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: fit-content;
  height: fit-content;
  transform: translate(-50%, -50%);
  .MuiCircularProgress-colorPrimary {
    color: rgba(128, 128, 128, 0.7);
  }
`;
