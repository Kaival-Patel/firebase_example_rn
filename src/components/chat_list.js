import React from 'react';
import {Avatar, FlatList, Text, View} from 'native-base';
import {storyData} from '../constants/constant';
import {streamChatList} from '../backend/chat_service';
import {UserContext} from '../hooks/context/user_context';
import {getUserDetails} from '../backend/user_service';
export const ChatListComponent = () => {
  const userProvider = React.useContext(UserContext);
  const [chatList, setChatList] = React.useState([]);
  React.useEffect(() => {
    try {
      const unsubscribe = streamChatList({
        userId: userProvider.user.uid,
      }).onSnapshot(async snap => {
        const chatArray = [];
        for (let index = 0; index < snap.docs.length; index++) {
          const element = snap.docs[index];
          element.data().users.forEach(user => {
            if (user !== userProvider.user.uid) {
              getUserDetails(user).then(doc => {
                chatArray.push({chatData: element, user: doc.data()});
              });
            }
          });
        }
        setChatList(chatArray);
      });
      chatList.forEach(ele => console.log(ele));
      return () => {
        unsubscribe();
      };
    } catch (err) {
      console.error(err);
    }
  }, [userProvider.user.uid]);

  return (
    <View borderTopLeftRadius={30} borderTopRightRadius={30}>
      <FlatList
        data={chatList}
        keyExtractor={(item, index) => {
          item + '__' + index;
        }}
        renderItem={({item}) => (
          <Text>Hello World</Text>
          // <View
          //   flexDirection={'row'}
          //   alignItems="center"
          //   height="65px"
          //   marginX={5}>
          //   <Avatar
          //     bg="primary.50"
          //     marginX="10px"
          //     marginY="5px"
          //     size="45px"
          //     source={{uri: item.user.photo}}
          //   />
          //   <View>
          //     <Text fontSize={'17px'}>{item.user.name}</Text>
          //     <Text fontSize={'12px'} color="gray.400">
          //       {item.email}
          //     </Text>
          //   </View>
          // </View>
        )}
      />
    </View>
  );
};
