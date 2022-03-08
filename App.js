import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {View, Text} from 'react-native';
import {LoginScreen} from './src/screens/login_screen';
export default App = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      {
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{
            headerShown:false
          }} />
        </Stack.Navigator>
      }
    </NavigationContainer>
  );
};
