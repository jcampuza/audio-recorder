import { deleteBlob, storageEvents, getAllBlobKeys, setBlob } from './storage';
import { createState, useState } from '@hookstate/core';
import { subscribeToAuthState } from './auth';
import { StorageReference } from '@firebase/storage';
import { User } from '@firebase/auth';

export enum LoginStatus {
  pending,
  loggedIn,
  loggedOut,
}

interface State {
  permission: boolean;
  isLoggedIn: LoginStatus;
  user: User | null;
  devices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo | null;
  isRecording: boolean;
  records: Record<string, StorageReference>;
  activeTrack: string | null;
}

export const appState = createState<State>({
  permission: false,
  isLoggedIn: LoginStatus.pending,
  user: null,
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

  appState.merge({ activeTrack: record.fullPath });
};

export const deleteAudioTrack = async (key: string) => {
  const confirmed = confirm(`Are you sure you want to delete ${key}?`);
  if (!confirmed) {
    return;
  }

  await deleteBlob(key);
};

export const getMediaDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();

  const deviceInputs = devices.filter((device) => device.kind === 'audioinput' && device.deviceId);

  const selectedDevice =
    deviceInputs.find((device) => device.deviceId === 'default') ?? deviceInputs[0] ?? null;

  appState.merge({
    devices: deviceInputs,
    selectedDevice,
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

export const finishRecording = async (blob: Blob) => {
  await setBlob(blob);
};

export const init = async () => {
  await getMediaPermissions();
  await getMediaDevices();

  subscribeToAuthState((user) => {
    appState.merge({ isLoggedIn: user ? LoginStatus.loggedIn : LoginStatus.loggedOut, user });

    if (user) {
      refreshLocalData();
    }
  });

  // Whenever a blob gets added/deleted refresh local state
  storageEvents.subscribe(() => {
    refreshLocalData();
  });
};

export const useGlobalState = () => {
  const { value } = useState(appState);

  return value;
};
