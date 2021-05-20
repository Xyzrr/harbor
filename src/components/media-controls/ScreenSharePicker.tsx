import * as S from './ScreenSharePicker.styles';

import React from 'react';
import { desktopCapturer } from 'electron';
import { DesktopCapturerSource } from 'electron/main';
import NewWindow from '../../elements/NewWindow';

export interface ScreenSharePickerProps {
  className?: string;
  onClose?(): void;
  onStart?(id: string): void;
}

const ScreenSharePicker: React.FC<ScreenSharePickerProps> = React.memo(
  function ScreenSharePicker({ className, onClose, onStart }) {
    const [screenSources, setScreenSources] = React.useState<
      DesktopCapturerSource[]
    >([]);
    const [windowSources, setWindowSources] = React.useState<
      DesktopCapturerSource[]
    >([]);
    const [selectedSourceId, setSelectedSourceId] = React.useState<
      string | null
    >(null);

    React.useEffect(() => {
      desktopCapturer
        .getSources({
          types: ['screen'],
          thumbnailSize: { width: 288, height: 162 },
        })
        .then((s) => {
          setScreenSources(s);
        });

      desktopCapturer
        .getSources({
          types: ['window'],
          thumbnailSize: { width: 180, height: 120 },
          fetchWindowIcons: true,
        })
        .then((s) => {
          setWindowSources(s);
        });
    }, []);

    console.debug('sources', windowSources);

    return (
      <NewWindow name="screen-share-picker" onClose={onClose}>
        <S.Wrapper className={className}>
          <S.TopBar>Screen Share</S.TopBar>

          <S.ScreensSectionWrapper>
            <S.Title>Screens</S.Title>
            <S.ScreenShareOptionsWrapper>
              {screenSources.map((source) => {
                return (
                  <S.ScreenShareOption
                    key={source.id}
                    selected={source.id === selectedSourceId}
                    onClick={() => {
                      console.log('Selected screen', source.id);
                      setSelectedSourceId(source.id);
                    }}
                    onDoubleClick={() => {
                      onStart?.(source.id);
                    }}
                  >
                    {source.thumbnail != null && (
                      <S.ScreenOptionThumbnailWrapper>
                        <S.ScreenOptionThumbnail
                          src={source.thumbnail.toDataURL()}
                        />
                      </S.ScreenOptionThumbnailWrapper>
                    )}
                  </S.ScreenShareOption>
                );
              })}
            </S.ScreenShareOptionsWrapper>
          </S.ScreensSectionWrapper>
          <S.Divider />
          <S.WindowsSectionWrapper>
            <S.Title>Apps</S.Title>
            <S.ScreenShareOptionsWrapper>
              {windowSources
                .filter(
                  (source) =>
                    ![
                      'screen-share-picker',
                      'permission-helper-window',
                    ].includes(source.name)
                )
                .map((source) => {
                  return (
                    <S.ScreenShareOption
                      key={source.id}
                      selected={source.id === selectedSourceId}
                      onClick={() => {
                        console.log('Selected window', source.id);
                        setSelectedSourceId(source.id);
                      }}
                      onDoubleClick={() => {
                        onStart?.(source.id);
                      }}
                    >
                      <S.WindowOptionLabel>
                        {source.appIcon != null && (
                          <S.WindowOptionAppIcon
                            src={source.appIcon.toDataURL()}
                          />
                        )}
                        <S.WindowOptionName>{source.name}</S.WindowOptionName>
                      </S.WindowOptionLabel>
                      {source.thumbnail != null && (
                        <S.WindowOptionThumbnailWrapper>
                          <S.WindowOptionThumbnail
                            src={source.thumbnail.toDataURL()}
                          />
                        </S.WindowOptionThumbnailWrapper>
                      )}
                    </S.ScreenShareOption>
                  );
                })}
            </S.ScreenShareOptionsWrapper>
          </S.WindowsSectionWrapper>
          <S.BottomBar>
            <S.ShareButton
              color="primary"
              variant="contained"
              disabled={selectedSourceId == null}
              onClick={() => {
                if (selectedSourceId != null) {
                  onStart?.(selectedSourceId);
                }
              }}
            >
              Share
            </S.ShareButton>
            <S.CancelButton onClick={onClose}>Cancel</S.CancelButton>
          </S.BottomBar>
        </S.Wrapper>
      </NewWindow>
    );
  }
);

export default ScreenSharePicker;
