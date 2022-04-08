import {firebase} from '@react-native-firebase/firestore';
import {FlatList, View} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useState} from 'react/cjs/react.production.min';
import {buildChatRoomModel, createChatRoom} from '../../backend/chat_service';
import {getAllUser, getUserDetails} from '../../backend/user_service';
import {CustomTextInput} from '../../components/text_input';
import {UserContext} from '../../hooks/context/user_context';
export default ChatRoom = ({navigation, route}) => {
  const [message, setMessage] = React.useState('');
  const [chatRoomId, setChatRoomId] = React.useState('');
  const [userDetails, setUserDetails] = React.useState({});
  const userProvider = React.useContext(UserContext);
  React.useEffect(() => {
    if (route.params.chatRoomId) {
      console.log(route.params.chatRoomId);
      setChatRoomId(route.params.chatRoomId);
    } else {
      console.log(route.params.userId);
    }
  }, chatRoomId);

  // React.useEffect(() => {
  //   getUserDetails(route.params.userId).then(value => {
  //     setUserDetails(value.data());
  //     navigation.setOptions({title:"Hello"});
  //   });
  // }, []);

  function sendChatMessage() {
    if (route.params.chatRoomId == null) {
      const chatModel = buildChatRoomModel({
        chatStartedAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastChatUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastMessage: message,
        users: [route.params.userId, userProvider.user.uid],
      });
      setMessage('');
      createChatRoom(chatModel).then(ref => {
        setChatRoomId(ref.id);
      });
    }
  }

  styles = StyleSheet.create({
    scaffold: {
      flex: 1,
      alignContent: 'space-between',
      flexDirection: 'column',
    },
  });

  return (
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
