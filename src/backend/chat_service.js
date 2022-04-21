import firestore from '@react-native-firebase/firestore';

export const buildChatRoomModel = ({
  chatStartedAt,
  lastChatUpdatedAt,
  lastMessage,
  users,
}) => {
  return {
    chatStartedAt: chatStartedAt,
    lastChatUpdatedAt: lastChatUpdatedAt,
    lastMessage: lastMessage,
    users: users,
  };
};

export const createChatRoom = async ({chatRoomModel}) => {
  return await firestore().collection('chat_rooms').add(chatRoomModel);
};

export const updateChatRoom = async ({chatRoomId, chatRoomModel}) => {
  return await firestore()
    .collection('chat_rooms')
    .doc(chatRoomId)
    .update(chatRoomModel);
};

export const sendMessageInChatRoom = async ({chatRoomId, message}) => {
  return await firestore()
    .collection('chat_rooms')
    .doc(chatRoomId)
    .collection('messages')
    .add(message);
};

export const getUserInChatRoom = async ({userId}) => {
  return await firestore()
    .collection('chat_rooms')
    .where('users', 'array-contains-any', [userId])
    .get();
};

export const streamChatRoom = ({chatRoomId}) => {
  return firestore().collection('chat_rooms').doc(chatRoomId);
};

export const streamChatMessageRoom = ({chatRoomId}) => {
  return firestore()
    .collection('chat_rooms')
    .doc(chatRoomId)
    .collection('messages')
    .orderBy('createdAt', 'desc');
};

export const streamChatList = ({userId}) => {
  console.info("STREAM REQ FOR USER=>",userId);
  return firestore()
    .collection('chat_rooms')
    .where('users', 'array-contains-any', [userId])
    .orderBy('lastChatUpdatedAt', 'desc');
};
