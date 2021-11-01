import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

// As long as rules are fine in firebase these are fine being exposed as mentioned in their docs
const firebaseConfig = {
  apiKey: 'AIzaSyA0mvHJQEsjfqoWeXBC3cFMrgMLEeDfcEY',
  authDomain: 'audio-recorder-1639f.firebaseapp.com',
  projectId: 'audio-recorder-1639f',
  storageBucket: 'audio-recorder-1639f.appspot.com',
  messagingSenderId: '964196653829',
  appId: '1:964196653829:web:f80300b0effb07407c356c',
  measurementId: 'G-RMYBLE6BY6',
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export const storage = getStorage();
