import styled from 'styled-components';
import Icon from '../../elements/Icon';

export const CurrentVolumeWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
`;
export const CurrentVolume = styled(Icon).attrs({
  name: 'mic',
})`
  position: absolute;
  color: lime;
  overflow: hidden;
  bottom: 0;
`;
export const MaxVolume = styled(Icon).attrs({
  name: 'mic',
})`
  opacity: 0.8;
  display: block;
`;

export const Wrapper = styled.div<{ volume: number }>`
  color: white;
  width: fit-content;
  height: fit-content;
  position: relative;
  pointer-events: none;
  z-index: 1;
`;
