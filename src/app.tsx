import { useState } from '@hookstate/core';
import { useEffect, useRef } from 'preact/hooks';
import { MediaRecorderLogic } from './media-recorder';
import {
  appState,
  deleteAudioTrack,
  setActiveAudioTrack,
  setActiveDevice,
  startRecording,
  stopRecording,
} from './state';
import { getBlob } from './storage';

const AudioTrack = ({ activeTrack }: { activeTrack: string | null }) => {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!activeTrack || !ref.current) {
      return;
    }

    let url: string | null = null;

    const execute = async () => {
      const blob = await getBlob(activeTrack);
      url = URL.createObjectURL(blob);

      if (ref.current) {
        ref.current.src = url;
        ref.current.play();
      }
    };

    execute();

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [activeTrack]);

  return (
    <div class="text-center">
      <audio controls ref={ref}></audio>
    </div>
  );
};

const DeviceList = ({
  devices,
  selectedDevice,
  permission,
}: {
  devices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo | null;
  permission: boolean;
}) => {
  const renderItem = (device: MediaDeviceInfo) => {
    const isSelected = device.deviceId === selectedDevice?.deviceId;

    return (
      <li>
        <span>{device.label}</span>
        <button disabled={isSelected} onClick={() => setActiveDevice(device.deviceId)}>
          {isSelected ? 'Selected' : 'Activate'}
        </button>
      </li>
    );
  };

  return (
    <div>
      <h3>Your Devices</h3>

      {permission ? (
        <div>
          <p>You'll need to grant audio device permissions to make recordings</p>
        </div>
      ) : null}

      <ul>{devices.map((device) => renderItem(device))}</ul>
    </div>
  );
};

const RecordingsList = ({ records }: { records: Record<string, string> }) => {
  const renderItem = (record: string) => (
    <li>
      <span class="flex-1">{record}</span>
      <div class="flex-none">
        <button
          data-record-url={record}
          data-action="play"
          onClick={() => setActiveAudioTrack(record)}
        >
          Play
        </button>

        <button
          data-record-url={record}
          data-action="delete"
          onClick={() => deleteAudioTrack(record)}
        >
          Delete
        </button>
      </div>
    </li>
  );

  return (
    <div>
      <h3>Your Recordings</h3>

      <ul>{Object.keys(records).map((name) => renderItem(name))}</ul>
    </div>
  );
};

const ActionsBar = ({ isRecording }: { isRecording: boolean }) => {
  return (
    <div class="actions">
      <button disabled={isRecording} onClick={startRecording}>
        Record
      </button>

      <button disabled={!isRecording} onClick={stopRecording}>
        Stop
      </button>
    </div>
  );
};

export const App = () => {
  const { value } = useState(appState);

  return (
    <div id="app">
      <AudioTrack activeTrack={value.activeTrack} />

      <DeviceList
        devices={value.devices}
        selectedDevice={value.selectedDevice}
        permission={value.permission}
      />

      <hr />

      <RecordingsList records={value.records} />

      <hr />

      <ActionsBar isRecording={value.isRecording} />
      <MediaRecorderLogic isRecording={value.isRecording} selectedDevice={value.selectedDevice} />
    </div>
  );
};
