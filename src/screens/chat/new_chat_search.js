import React from 'react';
import {Center, FlatList, Spinner, Text, View} from 'native-base';
import {SearchBar} from 'react-native-screens';
import {CustomTextInput} from '../../components/text_input';
import {getAllUser} from '../../backend/user_service';
import {storyData} from '../../constants/constant';

export const NewChatSearch = () => {
  const [search, setSearch] = React.useState('');
  const [loading, setIsLoading] = React.useState(true);
  const [searchedResult, setSearchedResult] = React.useState([]);
  const [dbData, setDbData] = React.useState([]);
  React.useEffect(() => {
    getAllUser().then(res => {
      setIsLoading(false);
      setDbData([]);
      res.docs.forEach(doc => {
        console.log(doc.data());
        dbData.push(doc.data());
        setDbData(dbData);
      });
    });
  }, []);

  React.useEffect(() => {
    dbData.forEach(doc => {
      if (doc.name.toLowerCase().includes(search.toLowerCase())) {
        console.info(doc.name);
        searchedResult.push(doc);
        setSearchedResult(searchedResult);
      }
      console.log(searchedResult.length);
    });
  }, [search]);
  return (
    <View style={{flex: 1}}>
      <View marginY={5}>
        <CustomTextInput
          onChangeText={value => {
            setSearchedResult([]);
            setSearch(value);
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
      ) : null}
      <FlatList
        data={storyData}
        renderItem={({item}) => {
          <View height={50}>
            <Text>{item.name}</Text>
          </View>;
        }}
      />
    </View>
  );
};
