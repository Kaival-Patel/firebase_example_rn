import {View, Text, Image} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import {UserContext} from '../../hooks/context/user_context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
export const ChatListHeader = () => {
  return (
    <View>
      <View style={style.appBar}>
        <View>
          <Text color="gray.500">Good Morning</Text>
          <UserContext.Consumer>
            {user => (
              <Text fontSize="lg" fontWeight="bold">
                {user.user.name}
              </Text>
            )}
          </UserContext.Consumer>
        </View>
        <View flexDirection="row" alignContent="center">
          <FontAwesome
            size={18}
            name="search"
            style={{marginHorizontal: 5, paddingTop: 5}}
          />
          <UserContext.Consumer>
            {user => (
              <Image
                marginX={5}
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
        </View>
      </View>
    </View>
  );
};
const style = StyleSheet.create({
  appBar: {
    marginHorizontal: 10,
    marginVertical: 15,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
