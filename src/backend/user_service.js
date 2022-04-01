import firestore from '@react-native-firebase/firestore';
import React from 'react';
import {useEffect} from 'react/cjs/react.production.min';
import {UserContext} from '../hooks/context/user_context';
export const getUserDetails = async uid => {
  return await firestore().collection('users').doc(uid).get();
};

export const createUser = async user => {
  return await firestore().collection('users').doc(user.uid).set(user);
};

export const getAllUser = async () => {
  return await firestore().collection('users').get();
};
// export function listenForAnyUserChanges(user) {
//   useEffect(() => {
//     const userProvider = React.useContext(UserContext);
//     const subscriber = firestore()
//       .collection('users')
//       .doc(user.uid)
//       .onSnapshot(doc => {
//         let userData = doc.data();
//         userProvider.updateUser(userData);
//       });

//     // Stop listening for updates when no longer required
//     return () => subscriber();
//   }, [user.uid]);
// }
