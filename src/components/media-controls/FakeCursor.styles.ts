import styled from 'styled-components';

export const Left = styled.div`
  width: 0;
  height: 0;
  border: 50px solid transparent;
  position: relative;
  top: -50px;
  transform: translate(10px, 40px) rotate(80deg);
`;

export const Right = styled.div`
  width: 0;
  height: 0;
  border: 50px solid transparent;
  position: relative;
  top: -50px;
  transform: translate(-36px, -31px) rotate(215deg);
`;

export const Outer = styled.div`
  position: absolute;
  ${Left},
  ${Right} {
    border-bottom-color: white;
  }
`;

export const Inner = styled.div`
  position: absolute;
  transform: translate(-6px, -17px) scale(0.7);
`;

export const Wrapper = styled.div<{ color: string }>`
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.4));
  position: absolute;
  width: 100px;
  height: 100px;
  z-index: 2;
  transition: top 0.1s, left 0.1s;
  transform-origin: top left;
  transform: scale(0.2);
  ${Inner} {
    ${Left}, ${Right} {
      border-bottom-color: ${(props) => props.color};
    }
  }
`;
