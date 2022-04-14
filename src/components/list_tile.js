import {View, Text} from 'native-base';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {Colors} from 'react-native/Libraries/NewAppScreen';
export const ListTile = ({Icon, Title, Subtitle, onPress = () => {}}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View marginY={2} paddingY={2} flexDirection="row" alignItems="center">
        <FontAwesome
          size={25}
          name={Icon}
          color={Colors.black}
          style={{marginHorizontal: 15}}
        />
        <View>
          <Text fontSize={18}>{Title}</Text>
          <Text fontSize={12} color={'gray.500'}>
            {Subtitle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
