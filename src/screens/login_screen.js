import {Button, FormControl} from 'native-base';
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
import {CustomTextInput} from '../components/text_input';
import Fonts from '../global/fonts';
export const LoginScreen = ({navigation, route}) => {
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
      // setFormErrorData({...formErrorData, email: 'Email is required'});
      formErrorData = {...formErrorData, email: 'Email is required'};
      setInvalidEmail(true);
    } else {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (reg.test(formData.email) === false) {
        formErrorData = {...formErrorData, email: 'Please enter a valid email'};
        // setFormErrorData({
        //   ...formErrorData,
        //   email: 'Please enter a valid email',
        // });
        setInvalidEmail(true);
      } else {
        setInvalidEmail(false);
      }
    }
    if (formData.password == undefined || formData.password == '') {
      console.info(formErrorData);
      formErrorData={...formErrorData, password: 'Please enter password'};
      // setFormErrorData({...formErrorData, password: 'Please enter password'});
      setInValidPassword(true);
    } else if (formData.password.length < 6) {
      formErrorData = {
        ...formErrorData,
        password: 'Please provide password with minimum 6 characters',
      };
      // setFormErrorData({
      //   ...formErrorData,
      //   password: 'Please provide password with minimum 6 characters',
      // });
      setInValidPassword(true);
    }
    setFormErrorData(formErrorData);
    if(!invalidEmail && !invalidPassword){
      
    }
  };
  return (
    <ScrollView style={styles.scaffold}>
      <View>
        <Image source={LOGIN_COVER} style={styles.login_cover} />
        <Text style={styles.header}>Login</Text>
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
        <Button margin={5} bgColor="primary.100" onPress={handleLogin}>
          Login
        </Button>
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
    borderColor: '#C0C0C0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});
