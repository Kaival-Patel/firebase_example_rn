import {Avatar, Text, View} from 'native-base';
import React from 'react';
import {useState} from 'react/cjs/react.production.min';
import {getUserDetails} from '../backend/user_service';

export function ChatRoomAppBar({navigation, route}) {
  const [userDetails, setUserDetails] = React.useState({});
  React.useEffect(() => {
    console.log(navigation);
    getUserDetails(route.params.userId).then(snap => {
      console.log(snap.data());
      setUserDetails(snap.data());
    });
  }, []);
  return (
    <View
      justifyContent={'flex-start'}
      flexDirection={'row'}
      alignItems="center"
      // height="65px"
      >
      <Avatar
        bg="primary.50"
        // marginX="10px"
        marginY="5px"
        marginRight={2}
        size="35px"
        source={{uri: userDetails.photo}}
      />
      <Text fontSize={'17px'}>{userDetails.name}</Text>
    </View>
  );
}
