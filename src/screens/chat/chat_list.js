import {View, Text} from 'native-base';
import React from 'react';
import { ChatListHeader } from './chat_list_header';

export const ChatList = ({navigation, route}) => {
  return (
    <View>
      <ChatListHeader/>
    </View>
  );
};
