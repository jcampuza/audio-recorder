import { storage } from './firebase';
import { ref, listAll, uploadBytes, deleteObject, getDownloadURL } from '@firebase/storage';
import { getUserAuth } from './auth';

const storageRef = ref(storage);

const getUserBlobStorageRef = () => {
  const auth = getUserAuth();

  if (!auth) {
    throw new Error('User auth not found');
  }

  return ref(storageRef, `user/${auth.uid}/recordings`);
};

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
  const _key = `${Date.now()}.webm`;

  const uploadRef = ref(getUserBlobStorageRef(), _key);

  return uploadBytes(uploadRef, value, {
    contentType: 'audio/webm',
  }).then(storageEvents.notify);
};

export const deleteBlob = (key: string) => {
  const deleteRef = ref(storageRef, key);
  return deleteObject(deleteRef).then(storageEvents.notify);
};

export const getBlobUrl = (key: string) => {
  const getRef = ref(storageRef, key);
  return getDownloadURL(getRef);
};

export const getAllBlobKeys = async () => {
  const list = await listAll(getUserBlobStorageRef());

  return Object.fromEntries(list.items.map((item) => [item.fullPath, item]));
};
