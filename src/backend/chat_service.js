import firestore from '@react-native-firebase/firestore';

export const buildChatRoomModel = ({chatStartedAt,lastChatUpdatedAt,lastMessage,users}) => {
    return {
        chatStartedAt : chatStartedAt,
        lastChatUpdatedAt:lastChatUpdatedAt,
        lastMessage:lastMessage,
        users:users
    };
}

export const createChatRoom = async ({chatRoomModel}) => {
  return await firestore().collection('chat_rooms').add(chatRoomModel);
};
