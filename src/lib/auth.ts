import {
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';

const provider = new GoogleAuthProvider();

export const login = async () => {
  const result = await signInWithPopup(auth, provider);
  const credentials = GoogleAuthProvider.credentialFromResult(result);

  return {
    user: result.user,
    token: credentials?.accessToken,
  };
};

export const getUserAuth = () => {
  return auth.currentUser;
};

export const logout = () => {
  return signOut(auth);
};

export const subscribeToAuthState = (onChange: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    console.log('onChange', user);
    onChange(user);
  });
};
