import { useEffect } from 'preact/hooks';
import { finishRecording, stopRecording } from '../lib/state';

interface MediaRecorderProps {
  isRecording: boolean;
  selectedDevice: MediaDeviceInfo | null;
}

const createRecorder = (deviceId: string) => {
  let recorder: MediaRecorder | null = null;

  const start = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: deviceId,
      },
    });

    const chunks: Blob[] = [];

    recorder = new MediaRecorder(mediaStream, { mimeType: 'audio/webm' });

    recorder.addEventListener('dataavailable', (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    });

    recorder.addEventListener('stop', () => {
      finishRecording(new Blob(chunks));
    });

    recorder.start();
  };

  const stop = () => {
    if (!recorder) {
      return;
    }

    recorder.stream.getAudioTracks().forEach((t) => t.stop());
    recorder.stop();
    recorder = null;
  };

  return {
    start,
    stop,
  };
};

export const MAX_TIME = 1000 * 60 * 10;

export const MediaRecorderLogic = (props: MediaRecorderProps) => {
  useEffect(() => {
    if (!props.isRecording || !props.selectedDevice) {
      return;
    }

    const recorder = createRecorder(props.selectedDevice.deviceId);

    recorder.start();

    const maxLengthTimeout = setTimeout(() => {
      stopRecording();
    }, MAX_TIME);

    return () => {
      recorder.stop();
      clearTimeout(maxLengthTimeout);
    };
  }, [props.isRecording]);

  return null;
};
