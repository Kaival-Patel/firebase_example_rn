import {View, Text} from 'native-base';
import React from 'react';
import { ChatListComponent } from '../../components/chat_list';
import { ChatListHeader } from '../../components/chat_list_header';
import { StoryBrowser } from '../../components/story_browser';
export const ChatList = ({navigation, route}) => {
  return (
    <View>
      <ChatListHeader navigation={navigation} route={route} />
      <StoryBrowser />
      <ChatListComponent />
    </View>
  );
};
