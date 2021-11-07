import { startRecording, stopRecording } from '../lib/state';

export const ActionsBar = ({ isRecording }: { isRecording: boolean }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full mx-auto p-4 flex justify-center bg-gray-100 dark:bg-gray-900 border-t dark:border-white">
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
