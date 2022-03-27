import React from 'react';
import {View, Text} from 'native-base';
import {UserContext} from '../../hooks/context/user_context';
export const ProfileScreen = ({navigation, route}) => {
  return (
    <View>
      <UserContext.Consumer>
        {user => <Text>{JSON.stringify(user)}</Text>}
      </UserContext.Consumer>
    </View>
  );
};
