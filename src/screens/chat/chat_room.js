import {firebase} from '@react-native-firebase/firestore';
import {Center, FlatList, Spinner, View} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useState} from 'react/cjs/react.production.min';
import {
  buildChatRoomModel,
  createChatRoom,
  getUserInChatRoom,
  streamChatRoom,
} from '../../backend/chat_service';
import {getAllUser, getUserDetails} from '../../backend/user_service';
import {CustomTextInput} from '../../components/text_input';
import {UserContext} from '../../hooks/context/user_context';
export default ChatRoom = ({navigation, route}) => {
  const [message, setMessage] = React.useState('');
  const [chatRoomId, setChatRoomId] = React.useState('');
  const [chatRoomDetails, setChatRoomDetails] = React.useState({});
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
    if (route.params.chatRoomId == null) {
      const chatModel = {
        chatStartedAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastChatUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastMessage: message,
        users: [route.params.userId, userProvider.user.uid],
      };
      setMessage('');
      createChatRoom({chatRoomModel: chatModel})
        .then(ref => {
          setChatRoomId(ref.id);
          startStreamingChatRoom();
        })
        .catch(err => console.error(err));
    }
  }

  function startStreamingChatRoom() {
    streamChatRoom({chatRoomId: chatRoomId}).onSnapshot(doc => {
      setChatRoomId(doc.id);
      setChatRoomDetails(doc.data());
    });
  }

  function sendMessage() {}

  styles = StyleSheet.create({
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
      <FlatList />
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
