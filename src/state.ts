import { deleteBlob, getAllBlobKeys } from './storage';
import { createState } from '@hookstate/core';

interface State {
  permission: boolean;
  devices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo | null;
  isRecording: boolean;
  records: Record<string, string>;
  activeTrack: string | null;
}

export const appState = createState<State>({
  permission: false,
  devices: [],
  selectedDevice: null,
  isRecording: false,
  records: {},
  activeTrack: null,
});

export const stopRecording = () => {
  return appState.merge({ isRecording: false });
};

export const startRecording = async () => {
  const s = appState.get();

  if (!s.selectedDevice) {
    return;
  }

  appState.merge({ isRecording: true });
};

export const setActiveDevice = async (id: string) => {
  const device = appState.get().devices.find((device) => device.deviceId === id);
  if (!device) {
    return;
  }

  appState.merge({ selectedDevice: device });
};

export const setActiveAudioTrack = (key: string) => {
  const records = appState.get().records;
  const record = records[key];
  if (!record) {
    return;
  }

  appState.merge({ activeTrack: record });
};

export const deleteAudioTrack = async (key: string) => {
  const confirmed = confirm(`Are you sure you want to delete ${key}?`);
  if (!confirmed) {
    return;
  }

  await deleteBlob(key);
  await refreshLocalData();
};

export const getMediaDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const deviceInputs = devices.filter((device) => device.kind === 'audioinput');

  appState.merge({
    devices: deviceInputs,
    selectedDevice: devices[0] ?? null,
  });
};

export const getMediaPermissions = async () => {
  let granted = false;

  try {
    // Get the tracks and immediately stop them
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getAudioTracks().forEach((track) => track.stop());
    granted = true;
  } catch {}

  appState.merge({ permission: granted });
};

export const refreshLocalData = async () => {
  const blobs = await getAllBlobKeys();

  appState.merge({ records: blobs });
};

export const init = async () => {
  await refreshLocalData();
  await getMediaPermissions();
  await getMediaDevices();
};
