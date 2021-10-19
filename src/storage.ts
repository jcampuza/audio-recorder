import localforage from 'localforage';

const dbName = 'audioRecorder';

const blobStore = localforage.createInstance({
  name: dbName,
  storeName: 'blobs',
  description: 'Blob store',
  driver: localforage.INDEXEDDB,
});

export const setBlob = (value: Blob) => {
  const _key = `${new Date().toISOString()}`;

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

export const blobToBase64 = (blob: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };

    reader.onerror = (e) => {
      reject(e);
    };

    reader.readAsDataURL(blob);
  });
};

export const base64ToBlob = (base64: string) => {
  return fetch(base64).then((res) => res.blob());
};
