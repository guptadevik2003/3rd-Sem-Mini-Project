import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text, Pressable, View, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function TeacherViewScreen({ navigation, route }) {
  const { data, user, attendance } = route.params
  attendance.list.sort((a, b) =>{ return a[0]-b[0] })
  const [filter, setFilter] = useState('')
  const [filteredList, setFilteredList] = useState(attendance.list)
  async function searchButtonPress(value){
    setFilter(value)
    if(value==='') return setFilteredList(attendance.list)
    if(isNaN(value)){
      setFilteredList(attendance.list.filter(a => a[1].toLowerCase().includes(value.toLowerCase())))
    } else {
      setFilteredList(attendance.list.filter(a => a[0].includes(value)))
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='rgb(61,175,228)' />
      <Text style={styles.subtitle}>{data.subjectId} CLASS - {user.fullName.toUpperCase()}</Text>
      <Text style={styles.title}>{new Date(attendance.info.attendanceDate).toDateString()}</Text>
      <View style={styles.subContainer}>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            style={styles.textInput}
            placeholderTextColor='#aaa'
            placeholder='Search Students'
            onChangeText={searchButtonPress}
            value={filter}
          />
          <Pressable onPress={() => searchButtonPress(filter)} style={styles.icon}>
            <Icon name='search' color='#aaa' size={30} />
          </Pressable>
        </View>
        <ScrollView style={{marginBottom: 20, marginTop: 25}}>
          {filteredList.map((prop, key) => {
            return (
              <View style={[styles.cardContainer, { backgroundColor: `${prop[2]?'rgba(184,227,187,0.3)':'rgba(235,182,171,0.3)'}`, borderColor: `${prop[2]?'#5cba63':'#cb4b32'}` }]}>
                <Text style={{position: 'absolute', right: 18, fontSize: 46, fontWeight: 'bold', color: `${prop[2]?'#5cba63':'#cb4b32'}` }}>{prop[2]?'P':'A'}</Text>
                <Text style={[styles.cardText, { color: `${prop[2]?'#5cba63':'#cb4b32'}` }]}>{prop[1]}</Text>
                <Text style={styles.cardSubText}>{prop[0]}</Text>
              </View>
            )
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(61,175,228)',
    marginTop: 25
  },
  subtitle: {
    color: 'white',
    marginTop: 28,
    marginLeft: 20,
    fontSize: 19
  },
  title: {
    color: 'white',
    marginLeft: 20,
    fontSize: 28,
    fontWeight: 'bold',
  },
  subContainer: {
    backgroundColor: 'white',
    flex: 1,
    marginTop: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  textInput: {
    backgroundColor: '#ddd',
    marginTop: 30,
    marginLeft: 20,
    borderRadius: 12,
    height: 53,
    flex: 1,
    fontSize: 15,
    paddingLeft: 20,
    color: 'black'
  },
  icon: {
    padding: 11,
    marginTop: 25,
    marginRight: 12,
    marginLeft: 8,
    alignSelf: 'flex-end'
  },
  cardContainer: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 12,
    marginBottom: 10,
    paddingLeft: 15,
    borderWidth: 1.8
  },
  cardText: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 8
  },
  cardSubText: {
    color: 'grey',
    fontWeight: '500',
    paddingBottom: 8,
  },
});
