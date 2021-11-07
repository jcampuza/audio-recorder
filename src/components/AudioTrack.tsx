import { useEffect, useRef } from 'preact/hooks';
import { getBlobUrl } from '../lib/storage';

export const AudioTrack = ({ activeTrack }: { activeTrack: string | null }) => {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!activeTrack || !ref.current) {
      return;
    }

    const execute = async () => {
      const blobUrl = await getBlobUrl(activeTrack);

      if (ref.current) {
        ref.current.src = blobUrl;
        ref.current.play();
      }
    };

    execute();
  }, [activeTrack]);

  return (
    <div>
      <audio className="mx-auto" controls ref={ref}></audio>
    </div>
  );
};
