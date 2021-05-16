import * as S from './GetReady.styles';
import React from 'react';
import { UserSettingsContext } from '../contexts/UserSettingsContext';
import AudioInputControl from './media-controls/AudioInputControl';
import VideoInputControl from './media-controls/VideoInputControl';
import { LocalMediaContext } from '../contexts/LocalMediaContext';
import Button from '../elements/Button';
import Icon from '../elements/Icon';

export interface GetReadyProps {
  className?: string;
  spaceMetadata: any;
  onExit(): void;
  onReady(): void;
}

const GetReady: React.FC<GetReadyProps> = ({
  className,
  spaceMetadata,
  onExit,
  onReady,
}) => {
  const { localName, setLocalName } = React.useContext(UserSettingsContext);
  const { localVideoTrack } = React.useContext(LocalMediaContext);
  const [nameValue, setNameValue] = React.useState(localName);

  const videoRef = React.useRef<HTMLVideoElement>(null);

  const submitDisabled = !nameValue;

  React.useEffect(() => {
    if (videoRef.current && localVideoTrack) {
      videoRef.current.srcObject = new MediaStream([localVideoTrack]);
    }
  }, [localVideoTrack]);

  return (
    <S.Wrapper className={className}>
      <S.TopBar>
        <S.ExitButton onClick={onExit}>
          <Icon name="arrow_back" />
        </S.ExitButton>
        {spaceMetadata.spaceName}
      </S.TopBar>
      <S.VideoWrapper>
        {localVideoTrack && <video ref={videoRef} autoPlay />}
        <S.MediaButtons>
          <AudioInputControl />
          <VideoInputControl />
        </S.MediaButtons>
      </S.VideoWrapper>
      <S.NameInputWrapper>
        <S.Input
          autoFocus
          value={nameValue}
          onChange={(e) => {
            setNameValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !submitDisabled) {
              setLocalName(nameValue);
              onReady();
              e.currentTarget.blur();
            }
          }}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            setLocalName(nameValue);
            onReady();
          }}
          disabled={submitDisabled}
        >
          Join
        </Button>
      </S.NameInputWrapper>
    </S.Wrapper>
  );
};

export default GetReady;