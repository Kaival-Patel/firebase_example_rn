import {Center, Spinner, View} from 'native-base';
import React from 'react';
import {useEffect} from 'react/cjs/react.production.min';
import {getCurrentUser} from '../../backend/auth_service';
import {getUserDetails} from '../../backend/user_service';
import {UserContext} from '../../hooks/context/user_context';

export const AutoLoginChecker = ({navigation, route}) => {
  //USER context
  const userProvider = React.useContext(UserContext);
  React.useEffect(() => {
    setTimeout(() => {
      let currentUser = getCurrentUser();
      if (currentUser) {
        console.log(currentUser.email);
        getUserDetails(currentUser.uid).then(snap => {
          if (snap.exists) {
            if (snap.data() != null) {
              let userData = snap.data();
              const user = {
                name: userData.name,
                email: currentUser.email,
                photo: userData.photo,
                uid: currentUser.uid,
              };
              userProvider.updateUser(user);
              navigation.replace('HomeScreen');
            }
          } else {
            navigation.replace('Login');
          }
        });
      } else {
        navigation.replace('Login');
      }
    }, 1000);
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Center>
        <Spinner color="primary.200" size="lg" />
      </Center>
    </View>
  );
};
