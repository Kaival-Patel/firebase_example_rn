import {
  View,
  Text,
  Image,
  Center,
  Box,
  Stack,
  FlatList,
  Avatar,
} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import {UserContext} from '../../hooks/context/user_context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {storyData} from '../../constants/constant';

export const StoryBrowser = () => {
  return (
    <View style={style.body}>
      <View
        height="80px"
        w="20"
        marginY={4}
        alignItems="center"
        justifyContent="center">
        <UserContext.Consumer>
          {user => <Avatar size="48px" source={{uri: user.user.photo}} />}
        </UserContext.Consumer>
        <Box
          alignSelf="center"
          bg="primary.100"
          padding={1.5}
          height={5}
          position="absolute"
          bottom={7}
          right={3}
          width={5}
          borderRadius={400}>
          <Center>
            <FontAwesome name="plus" size={8} color="#FFFFFF" />
          </Center>
        </Box>
        <Text marginY={1}>Add Story</Text>
      </View>
      <FlatList
        height="90px"
        data={storyData}
        horizontal={true}
        renderItem={({item}) => (
          <View width={50} marginX={2} marginTop={3}>
            <Avatar
              borderTop="solid"
              borderWidth="1px"
              borderColor="primary.100"
              padding="2px"
              bg="primary.50"
              marginY="5px"
              size="48px"
              source={{uri: item.photo}}
            />
            <Center>
              <Text>{item.name}</Text>
            </Center>
          </View>
        )}
      />
    </View>
  );
};

const style = StyleSheet.create({
  body: {
    flexDirection: 'row',
  },
  //   addIcon: {
  //     padding: 10,
  //     borderRadius: 100,
  //     height: 20,
  //     width: 20,
  //     alignContent: 'center',
  //     justifyContent: 'center',
  //     backgroundColor: '#4ACFAC',
  //   },
});
