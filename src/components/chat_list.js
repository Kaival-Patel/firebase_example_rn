import React from 'react';
import {Avatar, Spinner, Text, View} from 'native-base';
import {FlatList} from 'react-native';
import {storyData} from '../constants/constant';
import {streamChatList} from '../backend/chat_service';
import {UserContext} from '../hooks/context/user_context';
import {getUserDetails} from '../backend/user_service';
export const ChatListComponent = () => {
  const userProvider = React.useContext(UserContext);
  const [chatList, setChatList] = React.useState([]);
  React.useEffect(() => {
    try {
      console.info('USER FOR CHAT =>', userProvider.user.uid);
      const chatArray = [];
      const unsubscribe = streamChatList({
        userId: userProvider.user.uid,
      }).onSnapshot(async snap => {
        console.info('INIT CHAT ARRAY');
        snap.docs.forEach(async doc => {
          const element = doc;
          await element.data().users.forEach(async user => {
            if (user !== userProvider.user.uid) {
              console.info('GETTING USER DETAILS');
              const userDetails = await getUserDetails(user);
              console.info('SETTING USER DETAILS');
              chatArray.push({chatData: element, user: userDetails.data()});
              setChatList([...chatList, chatArray]);
            }
          });
        });
        // for (let index = 0; index < snap.docs.length; index++) {
        //   const element = snap.docs[index];

        // }
        console.info('CHAT ARR LENGTH=>', chatList.length);
        // setChatList(chatArray);
      });
      chatList.forEach(ele => console.log(ele));
      // return () => {
      //   unsubscribe();
      // };
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <View borderTopLeftRadius={30} borderTopRightRadius={30} flex={1}>
      {chatList.length > 0 ? (
        <FlatList
          data={chatList}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({item, index}) => {
            console.info("=-=-=",item);
            <Text>Hello {item[index].user.name}</Text>;
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
            // </View>;
          }}
          // renderItem={({item}) => (
          //   console.warn("item", item),
          //   <Text>Hello World</Text>
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
          // )}
        />
      ) : (
        <Spinner />
      )}
    </View>
  );
};
