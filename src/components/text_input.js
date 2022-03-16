import React from 'react';
import {useState, useContext} from 'react';
import {TextInput, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getColor, useTheme, View, TextField, Input, Icon, Center} from 'native-base';
export const CustomTextInput = ({
  label,
  icon,
  error,
  password,
  onFocus = () => {},
}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const {colors} = useTheme();
  return (
    <Center>
      <Input
      w={{
        base: '90%',
        md:'90%',
        
      }}
      InputLeftElement={
        <Icon
          as={
            <FontAwesome
              style={{
                ...style.icon,
                color: isFocused ? 'brand.200' : '#C0C0C0',
              }}
              name={icon}
            />
          }
          size={10}
          ml="2"
          color="primary.200"
        />
      }
      onFocus={() => {
        onFocus();
        setIsFocused(true);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
      borderColor={isFocused ? 'primary.100' : '#C0C0C0'}
      variant="outline"
      placeholder={label}
      fontSize={16}
    />
    </Center>
  );
};

const style = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
    fontSize: 20,
  },
});
