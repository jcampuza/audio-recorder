import { useEffect } from 'preact/hooks';
import { login, logout } from '../lib/auth';
import { init, LoginStatus, useGlobalState } from '../lib/state';
import { ActionsBar } from './ActionsBar';
import { AudioTrack } from './AudioTrack';
import { Container } from './Container';
import { DeviceList } from './DeviceList';
import { MediaRecorderLogic } from './MediaRecorder';
import { RecordingsList } from './RecordingsList';

const Login = () => {
  return (
    <div className="relative w-full max-w-2xl min-h-screen pb-16 mx-auto flex justify-center items-start">
      <div className="mt-24">
        <p>Please login to get started</p>
        <button onClick={() => login()}>Login</button>
      </div>
    </div>
  );
};

const Loading = () => {
  return <div className="p-4">Loading...</div>;
};

const Main = () => {
  const state = useGlobalState();

  return (
    <div className="relative min-h-screen pb-16 mx-auto">
      <header className=" shadow-md text-white bg-gradient-to-br from-purple-600 to-purple-900">
        <Container className="flex justify-between p-4">
          <p>{state.user?.displayName}</p>
          <a className="text-white" href="javascript:void(0)" onClick={logout}>
            Sign Out
          </a>
        </Container>
      </header>

      <main className="p-4">
        <Container>
          <div className="mb-4">
            <AudioTrack activeTrack={state.activeTrack} />
          </div>

          <DeviceList
            devices={state.devices}
            selectedDevice={state.selectedDevice}
            permission={state.permission}
          />

          <hr className="my-4" />

          <RecordingsList records={state.records} />

          <hr className="my-4" />

          <ActionsBar isRecording={state.isRecording} />

          <MediaRecorderLogic
            isRecording={state.isRecording}
            selectedDevice={state.selectedDevice}
          />
        </Container>
      </main>
    </div>
  );
};

export const App = () => {
  const state = useGlobalState();

  useEffect(() => {
    init();
  }, []);

  if (state.isLoggedIn === LoginStatus.pending) {
    return <Loading />;
  }

  if (state.isLoggedIn === LoginStatus.loggedOut) {
    return <Login />;
  }

  return <Main />;
};
