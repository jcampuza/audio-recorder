import localforage from 'localforage';

const dbName = 'audioRecorder';

const blobStore = localforage.createInstance({
  name: dbName,
  storeName: 'blobs',
  description: 'Blob store',
  driver: localforage.INDEXEDDB,
});

export const setBlob = (value: Blob) => {
  const _key = `recording_${new Date().toISOString()}`;

  return blobStore.setItem(_key, value);
};

export const getBlob = (key: string) => {
  return blobStore.getItem<Blob>(key);
};

export const deleteBlob = (key: string) => {
  return blobStore.removeItem(key);
};

export const getAllBlobs = async () => {
  const items: Record<string, Blob> = {};

  await blobStore.iterate<Blob, void>((item, key) => {
    items[key] = item;
  });

  return items;
};
