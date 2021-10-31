import localforage from 'localforage';

const dbName = 'audioRecorder';

const blobStore = localforage.createInstance({
  name: dbName,
  storeName: 'blobs',
  description: 'Blob store',
  driver: localforage.INDEXEDDB,
});

const createEvents = () => {
  const subs = new Set<() => void>();

  const notify = () => {
    subs.forEach((sub) => sub());
  };

  const subscribe = (callback: () => void) => {
    subs.add(callback);
    return () => subs.delete(callback);
  };

  return {
    notify,
    subscribe,
  };
};

export const storageEvents = createEvents();

export const tap =
  <T>(callback: (r: T) => void) =>
  (r: T) => {
    callback(r);
    return r;
  };

export const setBlob = (value: Blob) => {
  const _key = `${new Date().toISOString()}`;

  return blobStore.setItem(_key, value).then(tap(storageEvents.notify));
};

export const deleteBlob = (key: string) => {
  return blobStore.removeItem(key).then(tap(storageEvents.notify));
};

export const getBlob = (key: string) => {
  return blobStore.getItem<Blob>(key);
};

export const getAllBlobKeys = async () => {
  const items: Record<string, string> = {};

  await blobStore.iterate<Blob, void>((item, key) => {
    items[key] = key;
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
