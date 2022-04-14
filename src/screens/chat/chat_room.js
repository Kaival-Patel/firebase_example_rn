import {firebase} from '@react-native-firebase/firestore';
import {Center, FlatList, Spinner, Text, View} from 'native-base';
import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
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
  const windowWidth = Dimensions.get('window').width;
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
          // startStreamingChatRoom();
          // startStreamingChatRoomMessage();
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

  React.useEffect(() => {
    streamChatRoom({chatRoomId: chatRoomId}).onSnapshot(doc => {
      setChatRoomDetails(doc.data());
    });
  }, [chatRoomId]);

  React.useEffect(() => {
    console.log('STARTING MESSAGE STREAM ON ' + chatRoomId);
    streamChatMessageRoom({chatRoomId: chatRoomId}).onSnapshot(snap => {
      updateMessageChatList(snap);
    });
  }, [chatRoomId]);

  function updateMessageChatList(snap) {
    // setChatMessages([]);
    snap.docs.forEach(doc => {
      if (chatMessages.find((e, i) => doc.id == e.id) == undefined) {
        chatMessages.push(doc);
      }
    });
    setChatMessages(chatMessages);
    chatMessages.map((e, i) => console.log(e.data().message));
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

  function getMessageDateTime(createdAt) {
    if (createdAt != null) {
      try {
        const date = new Date(createdAt.toDate()).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        return date;
      } catch (err) {
        return '';
      }
    }
    return '';
  }

  return isLoading ? (
    <View flex={1} justifyContent="center">
      <Spinner color="primary.100" />
    </View>
  ) : (
    <View style={styles.scaffold}>
      <FlatList
        inverted
        data={chatMessages}
        renderItem={({item}) => (
          <View>
            <View
              flex={1}
              flexDirection="row"
              maxWidth={windowWidth / 2}
              bg={'#8cbafa'}
              padding={2}
              alignSelf={
                item.data().sendBy == userProvider.user.uid
                  ? 'flex-end'
                  : 'flex-start'
              }
              borderBottomLeftRadius={
                item.data().sendBy == userProvider.user.uid ? 10 : 0
              }
              borderBottomRightRadius={
                item.data().sendBy == userProvider.user.uid ? 0 : 10
              }
              borderTopLeftRadius={10}
              borderTopRightRadius={10}
              margin={1}>
              <Text>{item.data().message}</Text>
            </View>
            <View
              alignSelf={
                item.data().sendBy == userProvider.user.uid
                  ? 'flex-end'
                  : 'flex-start'
              }
              marginBottom={1}
              paddingX={2}
              flexDirection={'row'}>
              {item.data().readByReceiverAt != null ? (
                <Text color={'gray.400'} marginRight={1}>
                  {'Read •'}
                </Text>
              ) : (
                <Text color={'gray.400'} marginRight={1}>
                  {'Sent •'}
                </Text>
              )}
              <Text color={'gray.400'}>
                {getMessageDateTime(item.data().createdAt)}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => item.id + '' + index}
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
