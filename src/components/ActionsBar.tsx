import { startRecording, stopRecording } from '../lib/state';

export const ActionsBar = ({ isRecording }: { isRecording: boolean }) => {
  return (
    <div class="actions">
      {isRecording ? (
        <button disabled={!isRecording} onClick={stopRecording}>
          Stop
        </button>
      ) : (
        <button disabled={isRecording} onClick={startRecording}>
          Record
        </button>
      )}
    </div>
  );
};
