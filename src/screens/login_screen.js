import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import {LOGIN_COVER} from '../assets/images/index';
import Fonts from '../global/fonts';
export const LoginScreen = ({navigation, route}) => {
  return (
    <ScrollView style={styles.scaffold}>
      <View>
        <Image source={LOGIN_COVER} style={styles.login_cover} />
        <Text style={styles.header}>Login</Text>
        <TextInput placeholder="Email ID" style={styles.textfield} />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  scaffold: {
    backgroundColor: '#fff',
  },
  login_cover: {
    height: 250,
    resizeMode: 'cover',
    width: '100%',
  },
  header: {
    fontFamily: Fonts.product_sans_bold,
    fontSize: 24,
    alignItems: 'flex-start',
    marginVertical: 10,
    marginHorizontal: 5,
    color: '#000',
  },
  textfield: {
    marginHorizontal: 10,
    marginVertical: 10,
    borderColor:"#C0C0C0",
    borderWidth:1,
    borderRadius:10,
    padding:10

  },
});
