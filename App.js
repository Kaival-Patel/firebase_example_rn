import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {extendTheme, NativeBaseProvider} from 'native-base';
import React from 'react';
import {View, Text} from 'react-native';
import chatRoomAppBar from './src/components/chat_room_appbar';
import {UserProvider} from './src/hooks/context/user_context';
import {HomeScreen} from './src/screens/home/home_screen';
import {LoginScreen} from './src/screens/auth/login_screen';
import {SignupScreen} from './src/screens/auth/signup_screen';
import Fonts from './src/global/fonts';
import {AutoLoginChecker} from './src/screens/auth/auto_login_checker';
import {NewChatSearch} from './src/screens/chat/new_chat_search';
import ChatRoom from './src/screens/chat/chat_room';
import {ChatRoomAppBar} from './src/components/chat_room_appbar';
export default App = () => {
  const Stack = createStackNavigator();
  const newColorTheme = {
    primary: {
      50: '#7CB0FD',
      100: '#0165ff',
      200: '#0246AD',
    },
    config: {
      initialColorMode: 'dark',
    },
  };
  const theme = extendTheme({
    colors: newColorTheme,
    fonts: {
      heading: Fonts.product_sans_bold,
      body: Fonts.product_sans,
    },
    components: {},
    fontSizes: {
      xxs: 10,
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
      '6xl': 60,
      '7xl': 72,
      '8xl': 96,
      '9xl': 128,
    },
  });
  return (
    <NativeBaseProvider theme={theme}>
      <UserProvider>
        <NavigationContainer>
          {
            <Stack.Navigator initialRouteName="AutoLogin">
              <Stack.Screen
                name="AutoLogin"
                component={AutoLoginChecker}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignupScreen}
                options={{
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="NewChatSearch"
                component={NewChatSearch}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ChatRoom"
                component={ChatRoom}
                options={{
                  title: props => <ChatRoomAppBar />,
                }}
              />
            </Stack.Navigator>
          }
        </NavigationContainer>
      </UserProvider>
    </NativeBaseProvider>
  );
};
