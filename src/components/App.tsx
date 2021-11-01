import { useState } from '@hookstate/core';
import { MediaRecorderLogic } from './MediaRecorder';
import { appState, LoginStatus } from '../lib/state';
import { ActionsBar } from './ActionsBar';
import { RecordingsList } from './RecordingsList';
import { DeviceList } from './DeviceList';
import { AudioTrack } from './AudioTrack';
import { login, logout } from '../lib/auth';

export const useGlobalState = () => {
  const { value, set } = useState(appState);

  return [value, set] as const;
};

export const App = () => {
  const [state] = useGlobalState();

  if (state.isLoggedIn === LoginStatus.pending) {
    return <div id="app">Loading...</div>;
  }

  if (state.isLoggedIn === LoginStatus.loggedOut) {
    return (
      <div id="app">
        <p>Please login to get started</p>
        <button onClick={() => login()}>Login</button>
      </div>
    );
  }

  return (
    <>
      <header class="header">
        <a href="javascript:void(0)" onClick={logout}>
          Sign Out
        </a>
      </header>

      <AudioTrack activeTrack={state.activeTrack} />

      <DeviceList
        devices={state.devices}
        selectedDevice={state.selectedDevice}
        permission={state.permission}
      />

      <hr />

      <RecordingsList records={state.records} />

      <hr />

      <ActionsBar isRecording={state.isRecording} />

      <MediaRecorderLogic isRecording={state.isRecording} selectedDevice={state.selectedDevice} />
    </>
  );
};
