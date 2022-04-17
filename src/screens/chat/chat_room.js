import {firebase} from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {Center, FlatList, Spinner, Text, View} from 'native-base';
import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
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
import {ChatRoomAppBar} from '../../components/chat_room_appbar';
import {CustomTextInput} from '../../components/text_input';
import {UserContext, UserProvider} from '../../hooks/context/user_context';

// class ChatRoom extends React.Component {
//   constructor(props) {
//     super(props);
//     console.log(this.context);
//     this.state = {
//       message: '',
//       chatRoomId: '',
//       chatRoomDetails: {},
//       chatMessages: [],
//       userDetails: {},
//       isLoading: true,
//       windowWidth: Dimensions.get('window').width,
//     };
//     if (this.props.route.params.chatRoomId) {
//       console.log(route.params.chatRoomId);
//       this.setState({
//         chatRoomId: this.props.route.params.chatRoomId,
//       });
//     } else {
//       console.log(this.props.route.params.userId);
//       checkPreExistInDb(this.props.route.params.userId);
//     }
//   }

//   checkPreExistInDb(userId) {
//     getUserInChatRoom({userId: userId})
//       .then(snap => {
//         snap.docs.forEach(doc => {
//           const chatSnap = doc.data();
//           if (
//             chatSnap.users.includes(userId) &&
//             chatSnap.users.includes(userProvider.user.uid)
//           ) {
//             setChatRoomId(doc.id);

//             console.log('USER CHAT ALREADY FOUND AT ' + doc.id);
//           }
//         });
//         setIsLoading(false);
//       })
//       .catch(err => {
//         setIsLoading(false);
//         console.error(err);
//       });
//   }

//   componentDidMount() {
//     console.log('Component Mounted');
//   }

//   componentWillUnmount() {
//     console.log('Component unmounted');
//   }

//   render() {
//     return (
//       <UserContext.Consumer>
//         {user => <Text>{user.user.email}</Text>}
//       </UserContext.Consumer>
//     );
//   }
// }
// export default ChatRoom;
export default ChatRoom = ({navigation, route}) => {
  const [message, setMessage] = React.useState('');
  const [chatRoomId, setChatRoomId] = React.useState('');
  const [chatRoomDetails, setChatRoomDetails] = React.useState({});
  const [chatMessages, setChatMessages] = React.useState([]);
  const [userDetails, setUserDetails] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const userProvider = React.useContext(UserContext);
  const windowWidth = Dimensions.get('window').width;

  //SET APP BAR
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: props => {
        return <ChatRoomAppBar navigation={navigation} route={route} />;
      },
    });
  }, [navigation]);

  //CHECK IF CHAT ROOM ID AVAILABLE
  React.useEffect(() => {
    if (route.params.chatRoomId) {
      console.log(route.params.chatRoomId);
      setChatRoomId(route.params.chatRoomId);
    } else {
      console.log(route.params.userId);
      checkPreExistInDb(route.params.userId);
    }
  }, []);

  //CHECK IF BOTH PARTIES CHAT EARLIER
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

  //SEND CHAT MESSAGE
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

  //STREAM CHAT ROOM DETAILS
  React.useEffect(() => {
    streamChatRoom({chatRoomId: chatRoomId}).onSnapshot(doc => {
      setChatRoomDetails(doc.data());
    });
  }, [chatRoomId]);

  //STREAM MESSAGES
  React.useEffect(() => {
    console.log('STARTING MESSAGE STREAM ON ' + chatRoomId);
    const unsubscribe = streamChatMessageRoom({
      chatRoomId: chatRoomId,
    }).onSnapshot(snap => {
      const chatArray = [];
      for (let index = 0; index < snap.docs.length; index++) {
        const element = snap.docs[index];
        chatArray.push(element);
      }
      setChatMessages(chatArray);
      chatArray.map((e, i) => console.log(e.data().message));
    });
    return () => {
      unsubscribe();
    };
  }, [chatRoomId]);

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
        return 'now';
      }
    }
    return 'now';
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
