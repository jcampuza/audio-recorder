import { deleteAudioTrack, setActiveAudioTrack } from '../lib/state';
import { StorageReference } from '@firebase/storage';

const RecordListItem = ({ record }: { record: StorageReference }) => {
  const formattedName = new Date(Number(record.name.split('.webm')[0])).toLocaleString();

  return (
    <li className="mb-4 last:mb-0">
      <span className="flex-1">{formattedName}</span>

      <div className="flex-none">
        <button onClick={() => setActiveAudioTrack(record.fullPath)}>Play</button>
        <button className="ml-2" onClick={() => deleteAudioTrack(record.fullPath)}>
          Delete
        </button>
      </div>
    </li>
  );
};

export const RecordingsList = ({ records }: { records: Record<string, StorageReference> }) => {
  return (
    <div>
      <h3 className="mb-4">Your Recordings</h3>

      <ul>
        {Object.values(records).map((record) => (
          <RecordListItem record={record} key={record.fullPath} />
        ))}
      </ul>
    </div>
  );
};
