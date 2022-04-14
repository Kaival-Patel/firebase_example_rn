import auth from '@react-native-firebase/auth';
import { Toast } from 'native-base';

export const signInWithEmailPassword = async (email, password) => {
  return await auth().signInWithEmailAndPassword(email, password);
};

export const signUpWithEmailPassword = (email, password) => {
  return auth()
    .createUserWithEmailAndPassword(email, password);
};
export const getCurrentUser = () => {
  return auth().currentUser;
}

export const logout = () =>{
  return auth().signOut();
}
