import * as S from './LocalVideoPreview.styles';
import React from 'react';
import { LocalMediaContext } from '../contexts/LocalMediaContext';
import Loader from '../elements/Loader';

export interface LocalVideoPreviewProps {
  className?: string;
}

const LocalVideoPreview: React.FC<LocalVideoPreviewProps> = ({ className }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoStreaming, setVideoStreaming] = React.useState(false);

  const { localVideoTrack } = React.useContext(LocalMediaContext);

  React.useEffect(() => {
    if (videoRef.current && localVideoTrack) {
      videoRef.current.srcObject = new MediaStream([localVideoTrack]);
    }
  }, [localVideoTrack]);

  React.useEffect(() => {
    if (!localVideoTrack) {
      setVideoStreaming(false);
    }
  }, [localVideoTrack]);

  return (
    <>
      <S.Wrapper
        ref={videoRef}
        autoPlay
        onCanPlay={() => {
          setVideoStreaming(true);
        }}
        onEmptied={() => {
          setVideoStreaming(false);
        }}
      />
      {!videoStreaming && <Loader />}
    </>
  );
};

export default LocalVideoPreview;
