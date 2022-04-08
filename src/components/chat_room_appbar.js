import {Text, View} from 'native-base';
import React from 'react';
import {getUserDetails} from '../backend/user_service';

export function ChatRoomAppBar({navigation, route}) {
  React.useEffect(() => {
    getUserDetails(route.params).then(snap => {
      console.log(snap.data());
    });
  }, []);
  return (
    <View>
      <Text>Hello</Text>
    </View>
  );
}
