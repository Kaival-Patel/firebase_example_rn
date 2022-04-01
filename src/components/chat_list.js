import React from 'react';
import {FlatList, Text, View} from 'native-base';
import {storyData} from '../constants/constant';
export const ChatListComponent = () => {
  return (
    <View borderTopLeftRadius={30} borderTopRightRadius={30}>
      <FlatList
        data={storyData}
        renderItem={({item}) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};
