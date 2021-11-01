import { setActiveDevice } from '../lib/state';

const EMPTY_OPTION_VALUE = '__EMPTY_OPTION__';

export const DeviceList = ({
  devices,
  selectedDevice,
  permission,
}: {
  devices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo | null;
  permission: boolean;
}) => {
  return (
    <div>
      <h3>Selected Device</h3>

      {!permission ? (
        <div>
          <p>You'll need to grant audio device permissions to make recordings</p>
        </div>
      ) : null}

      <select
        value={selectedDevice?.deviceId ?? EMPTY_OPTION_VALUE}
        onChange={(e) => {
          const target = e.target as HTMLSelectElement;
          setActiveDevice(target.value);
        }}
      >
        <option disabled selected value={EMPTY_OPTION_VALUE}>
          None
        </option>

        {devices.map((device) => (
          <option value={device.deviceId}>{device.label}</option>
        ))}
      </select>
    </div>
  );
};
