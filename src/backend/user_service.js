import firestore from '@react-native-firebase/firestore';
export const getUserDetails = async (uid) => {
    return await firestore().collection('users').doc(uid).get();
}

export const createUser = async (user) => {
    return await firestore().collection('users').doc(user.uid).set(user);
}