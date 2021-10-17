import { combineLatest, fromEvent, merge, tap } from 'rxjs';
import { StateSubject } from './state';
import { getAllBlobs, setBlob } from './storage';
import './style.css';

const audioEl = document.querySelector('#recorder') as HTMLAudioElement;
const permissionsWarning = document.querySelector('#permissions-warning') as HTMLDivElement;
const audiodevicesListEl = document.querySelector('#audiodeviceslist') as HTMLUListElement;
const startRecordingEl = document.querySelector('#record-button') as HTMLButtonElement;
const recordBtn = document.querySelector('#record-button') as HTMLButtonElement;
const stopBtn = document.querySelector('#stop-button') as HTMLButtonElement;
const recordsList = document.querySelector('#record-list') as HTMLUListElement;

interface State {
  permission: boolean;
  devices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo | null;
  mediaRecorder: MediaRecorder | null;
  isRecording: boolean;
  records: Record<string, Blob>;
}

const state = new StateSubject<State>({
  permission: false,
  devices: [],
  selectedDevice: null,
  mediaRecorder: null,
  isRecording: false,
  records: {},
});

const renderDevices = (devices: MediaDeviceInfo[], selectedDevice: MediaDeviceInfo | null) => {
  const renderItem = (device: MediaDeviceInfo) => {
    const isSelected = device.deviceId === selectedDevice?.deviceId;

    return `
    <li>
      <span>${device.label}</span>
      <button ${isSelected ? 'disabled' : ''} data-device-id="${device.deviceId}">${
      isSelected ? 'Selected' : 'Activate'
    }</button>
    </li>
  `;
  };

  audiodevicesListEl.innerHTML = devices.map(renderItem).join('');
};

const renderRecording = (isRecording: boolean) => {
  recordBtn.disabled = isRecording;
  stopBtn.disabled = !isRecording;
};

const renderPermissionsWarning = (permission: boolean) => {
  if (permission === false) {
    permissionsWarning.classList.remove('hide');
  } else {
    permissionsWarning.classList.add('hide');
  }
};

const renderRecords = (records: Record<string, Blob>) => {
  const renderItem = (record: string) => `
    <li>
      <span>${record}</span>
      <button data-record-url="${record}">Listen</button>
    </li>
  `;

  recordsList.innerHTML = Object.keys(records).map(renderItem).join('');
};

const stopRecording = () => {
  const s = state.getState();

  if (s.mediaRecorder) {
    s.mediaRecorder.stop();
  }

  state.setState({ mediaRecorder: null, isRecording: false });
};

const startRecording = async () => {
  const s = state.getState();

  if (!s.selectedDevice) {
    return;
  }

  const mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: s.selectedDevice.deviceId,
    },
  });

  const chunks: Blob[] = [];
  const mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'audio/webm' });

  mediaRecorder.addEventListener('dataavailable', (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  });

  mediaRecorder.addEventListener('error', (e) => {
    console.error(e);
  });

  mediaRecorder.addEventListener('stop', async () => {
    await setBlob(new Blob(chunks));
    const blobs = await getAllBlobs();
    state.setState({ records: blobs });
  });

  mediaRecorder.start();

  state.setState((e) => ({ ...e, isRecording: true, mediaRecorder }));
};

const setActiveDevice = async (id: string) => {
  const device = state.getState().devices.find((device) => device.deviceId === id);
  if (!device) {
    return;
  }

  state.setState({ selectedDevice: device });
};

const setActiveAudioTrack = (key: string) => {
  const records = state.getState().records;
  const record = records[key];
  if (!record) {
    return;
  }

  const objectUrl = URL.createObjectURL(record);
  audioEl.src = objectUrl;
  audioEl.play();
};

const getMediaDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const deviceInputs = devices.filter((device) => device.kind === 'audioinput');

  state.setState({
    devices: deviceInputs,
    selectedDevice: devices[0] ?? null,
  });
};

const getMediaPermissions = async () => {
  let granted = false;

  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    granted = true;
  } catch {}

  state.setState({ permission: granted });
};

const onStartRecordingClick = () => {
  startRecording();
};

const onStopButtonClick = () => {
  stopRecording();
};

const delegate = <T extends Event>(selector: string, handler: (e: T) => void) => {
  return (e: T) => {
    const target = e.target as HTMLElement;
    if (target.matches(selector)) {
      handler(e);
    }
  };
};

const onAudioListClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  setActiveDevice(target.dataset.deviceId!);
};

const onRecordListClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  setActiveAudioTrack(target.dataset.recordUrl!);
};

const getLocalData = async () => {
  const blobs = await getAllBlobs();
  state.setState({ records: blobs });
};

const onStartRecording$ = fromEvent<MouseEvent>(startRecordingEl, 'click').pipe(
  tap(onStartRecordingClick)
);

const onStopButtonClick$ = fromEvent<MouseEvent>(stopBtn, 'click').pipe(tap(onStopButtonClick));

const onAudioListClick$ = fromEvent<MouseEvent>(audiodevicesListEl, 'click').pipe(
  tap(delegate('[data-device-id]', onAudioListClick))
);

const onRecordListClick$ = fromEvent<MouseEvent>(recordsList, 'click').pipe(
  tap(delegate('[data-record-url]', onRecordListClick))
);

const updateDevices$ = combineLatest([
  state.select((s) => s.devices),
  state.select((s) => s.selectedDevice),
]).pipe(tap(([devices, selectedDevice]) => renderDevices(devices, selectedDevice)));

const updatePermissions$ = state
  .select((s) => s.permission)
  .pipe(tap((permission) => renderPermissionsWarning(permission)));

const updateRecording$ = state
  .select((s) => s.isRecording)
  .pipe(tap((recording) => renderRecording(recording)));

const updateRecords$ = state
  .select((s) => s.records)
  .pipe(tap((records) => renderRecords(records)));

const start = async () => {
  await getMediaPermissions();
  await getMediaDevices();
  await getLocalData();
};

merge(
  updateDevices$,
  updatePermissions$,
  updateRecording$,
  updateRecords$,
  onStartRecording$,
  onStopButtonClick$,
  onAudioListClick$,
  onRecordListClick$
).subscribe();

start();