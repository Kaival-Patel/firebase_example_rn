import {firebase} from '@react-native-firebase/firestore';
import {Center, FlatList, Spinner, Text, View} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useState} from 'react/cjs/react.production.min';
import {
  buildChatRoomModel,
  createChatRoom,
  getUserInChatRoom,
  sendMessageInChatRoom,
  streamChatMessageRoom,
  streamChatRoom,
  updateChatRoom,
} from '../../backend/chat_service';
import {getAllUser, getUserDetails} from '../../backend/user_service';
import {CustomTextInput} from '../../components/text_input';
import {UserContext} from '../../hooks/context/user_context';
export default ChatRoom = ({navigation, route}) => {
  const [message, setMessage] = React.useState('');
  const [chatRoomId, setChatRoomId] = React.useState('');
  const [chatRoomDetails, setChatRoomDetails] = React.useState({});
  const [chatMessages, setChatMessages] = React.useState([]);
  const [userDetails, setUserDetails] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const userProvider = React.useContext(UserContext);
  React.useEffect(() => {
    if (route.params.chatRoomId) {
      console.log(route.params.chatRoomId);
      setChatRoomId(route.params.chatRoomId);
    } else {
      console.log(route.params.userId);
      checkPreExistInDb(route.params.userId);
    }
  }, []);

  function checkPreExistInDb(userId) {
    getUserInChatRoom({userId: userId})
      .then(snap => {
        snap.docs.forEach(doc => {
          const chatSnap = doc.data();
          if (
            chatSnap.users.includes(userId) &&
            chatSnap.users.includes(userProvider.user.uid)
          ) {
            setChatRoomId(doc.id);
            startStreamingChatRoom();
            startStreamingChatRoomMessage();
            console.log('USER CHAT ALREADY FOUND AT ' + doc.id);
          }
        });
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.error(err);
      });
  }
  // React.useEffect(() => {
  //   getUserDetails(route.params.userId).then(value => {
  //     setUserDetails(value.data());
  //     navigation.setOptions({title:"Hello"});
  //   });
  // }, []);

  function sendChatMessage() {
    if (chatRoomId === '') {
      const chatModel = {
        chatStartedAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastChatUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastMessage: message,
        users: [route.params.userId, userProvider.user.uid],
      };

      createChatRoom({chatRoomModel: chatModel})
        .then(ref => {
          setChatRoomId(ref.id);
          startStreamingChatRoom();
          startStreamingChatRoomMessage();
          sendMessage();
        })
        .catch(err => console.error(err));
    } else {
      updateChatRoom({
        chatRoomId: chatRoomId,
        chatRoomModel: {
          lastChatUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastMessage: message,
        },
      });
      sendMessage();
    }
  }

  function startStreamingChatRoom() {
    streamChatRoom({chatRoomId: chatRoomId}).onSnapshot(doc => {
      setChatRoomDetails(doc.data());
    });
  }

  function startStreamingChatRoomMessage() {
    streamChatMessageRoom({chatRoomId: chatRoomId}).onSnapshot(snap => {
      setChatMessages([]);
      snap.docs.forEach(doc => {
        chatMessages.push(doc);
      });
      setChatMessages(chatMessages);
    });
  }

  function sendMessage() {
    const messageModel = {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      message: message,
      sendBy: userProvider.user.uid,
      readByReceiverAt: null,
      status: 1,
      type: 1,
    };
    setMessage('');
    console.log('MESSAGING IN CHAT ROOM ID =>' + chatRoomId);
    sendMessageInChatRoom({chatRoomId: chatRoomId, message: messageModel})
      .then(ref => console.log('SENT'))
      .catch(err => console.error(err));
  }

  const styles = StyleSheet.create({
    scaffold: {
      flex: 1,
      alignContent: 'space-between',
      flexDirection: 'column',
    },
  });

  return isLoading ? (
    <View flex={1} justifyContent="center">
      <Spinner color="primary.100" />
    </View>
  ) : (
    <View style={styles.scaffold}>
      <FlatList
        data={chatMessages}
        renderItem={({item}) => {
          <Text>{item.data().message}</Text>;
        }}
      />
      <View marginY={5}>
        <CustomTextInput
          label={'Type Message Here'}
          onChangeText={value => {
            setMessage(value);
          }}
          value={message}
          onEditingSubmitted={v => {}}
          suffixIcon="paper-plane"
          onSuffixIconTap={() => {
            sendChatMessage();
          }}
        />
      </View>
    </View>
  );
};
