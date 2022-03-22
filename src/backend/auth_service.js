import auth from '@react-native-firebase/auth';
import { Toast } from 'native-base';

export const signInWithEmailPassword = (email, password) => {
  return auth().signInWithEmailAndPassword(email, password);
};

export const signUpWithEmailPassword = (email, password) => {
  return auth()
    .createUserWithEmailAndPassword(email, password);
};
