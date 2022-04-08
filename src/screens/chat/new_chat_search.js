import React from 'react';
import {FlatList} from 'react-native';
import {Avatar, Center, Spinner, Text, View} from 'native-base';
import {SearchBar} from 'react-native-screens';
import {CustomTextInput} from '../../components/text_input';
import {getAllUser} from '../../backend/user_service';
import {storyData} from '../../constants/constant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const NewChatSearch = ({navigation, route}) => {
  const [search, setSearch] = React.useState('');
  const [loading, setIsLoading] = React.useState(true);
  const [searchedResult, setSearchedResult] = React.useState([]);
  const [dbData, setDbData] = React.useState([]);
  React.useEffect(() => {
    getAllUser().then(res => {
      setIsLoading(false);
      setDbData([]);
      res.docs.forEach(doc => {
        dbData.push(doc.data());
        setDbData(dbData);
      });
    });
  }, []);
  function handleSearch() {
    setSearchedResult([]);
    dbData.forEach(doc => {
      if (doc.name.toLowerCase().includes(search.toLowerCase())) {
        if (!searchedResult.includes(doc)) {
          searchedResult.push(doc);
          setSearchedResult(searchedResult);
        }
      }
    });
    console.log(searchedResult);
  }
  // React.useEffect(() => {
  //   setSearchedResult([]);
  //   dbData.forEach(doc => {
  //     if (doc.name.toLowerCase().includes(search.toLowerCase())) {
  //       if (!searchedResult.includes(doc)) {
  //         searchedResult.push(doc);
  //         setSearchedResult(searchedResult);
  //       }
  //     }
  //   });
  //   console.log(searchedResult);
  // }, [search]);
  return (
    <View>
      <View marginY={5}>
        <CustomTextInput
          onChangeText={value => {
            setSearchedResult([]);
            setSearch(value);
            handleSearch();
          }}
          icon="search"
          label={'Search for people using name'}
          onFocus={() => {}}
        />
      </View>
      {loading ? (
        <Center>
          <Spinner color="primary.100" />
        </Center>
      ) : (
        <FlatList
          data={search === '' ? dbData : searchedResult}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChatRoom', {
                  chatRoomId: null,
                  userId: item.uid,
                });
              }}>
              <View
                flexDirection={'row'}
                alignItems="center"
                height="65px"
                marginX={5}>
                <Avatar
                  bg="primary.50"
                  marginX="10px"
                  marginY="5px"
                  size="45px"
                  source={{uri: item.photo}}
                />
                <View>
                  <Text fontSize={'17px'}>{item.name}</Text>
                  <Text fontSize={'12px'} color="gray.400">
                    {item.email}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <View height={100}></View>
    </View>
  );
};
