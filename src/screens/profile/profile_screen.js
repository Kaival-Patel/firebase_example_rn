import React from 'react';
import {View, Text} from 'native-base';
import {UserContext, UserProvider} from '../../hooks/context/user_context';
import {ListTile} from '../../components/list_tile';
import {logout} from '../../backend/auth_service';
export const ProfileScreen = ({navigation, route}) => {
  const userProvider = React.useContext(UserContext);
  return (
    <View>
      <ListTile
        onPress={() => {
          logout();
          userProvider.updateUser({});
          navigation.replace('Login');
        }}
        Icon={'times'}
        Subtitle="Clear Data and Logout"
        Title={'Logout'}
      />
    </View>
  );
};
