import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {ChatList} from '../chat/chat_list';
import React from 'react';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ProfileScreen} from '../profile/profile_screen';
import {UserContext} from '../../hooks/context/user_context';
import {Image} from 'native-base';
const Tab = createBottomTabNavigator();
export const HomeScreen = () => {
  const userProvider = React.useContext(UserContext);
  React.useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .doc(userProvider.user.uid)
      .onSnapshot(doc => {
        let userData = doc.data();
        userProvider.updateUser(userData);
      });
  }, []);
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          console.log(color);
          if (route.name === 'Chats') {
            iconName = focused ? (
              <FontAwesome name="comment" size={size} color="#0165ff" />
            ) : (
              <FontAwesome name="comment" size={size} />
            );
          } else {
            iconName = focused ? (
              <UserContext.Consumer>
                {user => (
                  <Image
                    size={7}
                    resizeMode={'cover'}
                    borderRadius={100}
                    source={{
                      uri: '' + user.user.photo,
                    }}
                    alt="Alternate Text"
                  />
                )}
              </UserContext.Consumer>
            ) : (
              <UserContext.Consumer>
                {user => (
                  <Image
                    size={7}
                    style={{opacity: 0.5}}
                    resizeMode={'cover'}
                    borderRadius={100}
                    source={{
                      uri: '' + user.user.photo,
                    }}
                    alt="Alternate Text"
                  />
                )}
              </UserContext.Consumer>
            );
          }
          return iconName;
        },
      })}>
      <Tab.Screen name="Chats" component={ChatList} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
