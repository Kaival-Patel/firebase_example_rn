import {Button, FormControl, Text} from 'native-base';
import React from 'react';
import {View, Image, StyleSheet, ScrollView, TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {LOGIN_COVER} from '../assets/images/index';
import {CustomTextInput} from '../components/text_input';
import Fonts from '../global/fonts';
export const SignupScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [invalidPassword, setInValidPassword] = React.useState(false);
  const [formErrorData, setFormErrorData] = React.useState({
    email: '',
    password: '',
  });
  const [invalidEmail, setInvalidEmail] = React.useState(false);
  const [formData, setData] = React.useState({});
  console.log(formErrorData);
  const handleLogin = () => {
    if (formData.email == undefined || formData.email == '') {
      setFormErrorData({...formErrorData, email: 'Email is required'});
      setInvalidEmail(true);
      return;
    } else {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (reg.test(formData.email) === false) {
        setFormErrorData({
          ...formErrorData,
          email: 'Please enter a valid email',
        });
        setInvalidEmail(true);
        return;
      } else {
        setInvalidEmail(false);
      }
    }
    if (formData.password == undefined || formData.password == '') {
      console.info(formErrorData);
      setFormErrorData({...formErrorData, password: 'Please enter password'});
      setInValidPassword(true);
    } else if (formData.password.length < 6) {
      formErrorData = {
        ...formErrorData,
        password: 'Please provide password with minimum 6 characters',
      };
      setFormErrorData({
        ...formErrorData,
        password: 'Please provide password with minimum 6 characters',
      });
      setInValidPassword(true);
      return;
    }
    if (!invalidEmail && !invalidPassword) {
    }
  };
  return (
    <ScrollView style={styles.scaffold}>
      <View style={{justifyContent: 'space-between'}}>
        <View>
          <Image source={LOGIN_COVER} style={styles.login_cover} />
          <Text style={styles.header}>Hello</Text>
          <Text style={styles.subtitle}>SignUp with Email and Password</Text>
          <FormControl isInvalid={invalidEmail}>
            <CustomTextInput
              onChangeText={value => {
                setData({...formData, email: value});
              }}
              icon="at"
              label={'Email'}
              onFocus={() => {}}
            />
            <FormControl.ErrorMessage
              marginLeft={5}
              w={{
                base: '90%',
                md: '90%',
              }}>
              {formErrorData.email}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isInvalid={invalidPassword} marginTop={5}>
            <CustomTextInput
              label={'Password'}
              onFocus={() => {}}
              icon="lock"
              onChangeText={value => {
                setData({...formData, password: value});
              }}
              password={true}
            />
            <FormControl.ErrorMessage marginLeft={5}>
              {formErrorData.password}
            </FormControl.ErrorMessage>
          </FormControl>
          {isLoading ? (
            <Button margin={5} bgColor="primary.100" isLoading>
              Signing Up
            </Button>
          ) : (
            <Button margin={5} bgColor="primary.100" onPress={handleLogin}>
              Signup
            </Button>
          )}
        </View>
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Text>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}>
            <Text color={'primary.100'}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  scaffold: {
    backgroundColor: '#fff',
    fontFamily: Fonts.product_sans,
  },
  login_cover: {
    height: 250,
    resizeMode: 'cover',
    width: '100%',
    marginVertical: 10,
  },
  header: {
    fontFamily: Fonts.product_sans_bold,
    fontSize: 24,
    alignItems: 'flex-start',
    marginVertical: 5,
    marginHorizontal: 5,
    color: '#000',
  },
  subtitle: {
    fontFamily: Fonts.product_sans,
    fontSize: 16,
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 5,
    marginHorizontal: 5,
    color: '#6D6D6D',
  },
  textfield: {
    marginHorizontal: 10,
    marginVertical: 10,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});
