import React from 'react';

export const useVolume = (
  audioTrack: MediaStreamTrack | undefined,
  callback: (volume: number) => void
) => {
  React.useEffect(() => {
    if (!audioTrack) {
      return;
    }

    const mediaStream = new MediaStream([audioTrack]);

    const audioContext = new AudioContext();
    const mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);
    const processor = audioContext.createScriptProcessor(2048, 1, 1);

    mediaStreamSource.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);

      const total = inputData.reduce((a, b) => a + Math.abs(b));
      const rms = Math.sqrt(total / inputData.length);
      callback(rms);
    };

    return () => {
      processor.disconnect();
    };
  }, [audioTrack]);
};
