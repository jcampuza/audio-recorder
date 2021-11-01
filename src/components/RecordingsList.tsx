import { deleteAudioTrack, setActiveAudioTrack } from '../lib/state';
import { StorageReference } from '@firebase/storage';

const RecordListItem = ({ record }: { record: StorageReference }) => {
  const formattedName = new Date(Number(record.name.split('.webm')[0])).toLocaleString();

  return (
    <li>
      <span class="flex-1">{formattedName}</span>

      <div class="flex-none">
        <button onClick={() => setActiveAudioTrack(record.fullPath)}>Play</button>
        <button onClick={() => deleteAudioTrack(record.fullPath)}>Delete</button>
      </div>
    </li>
  );
};

export const RecordingsList = ({ records }: { records: Record<string, StorageReference> }) => {
  return (
    <div>
      <h3>Your Recordings</h3>

      <ul>
        {Object.values(records).map((record) => (
          <RecordListItem record={record} key={record.fullPath} />
        ))}
      </ul>
    </div>
  );
};
