import {View, Text} from 'native-base';
import React from 'react';
import {ChatListComponent} from './chat_list';
import {ChatListHeader} from './chat_list_header';
import {StoryBrowser} from './story_browser';

export const ChatList = ({navigation, route}) => {
  return (
    <View>
      <ChatListHeader />
      <StoryBrowser />
      <ChatListComponent />
    </View>
  );
};
