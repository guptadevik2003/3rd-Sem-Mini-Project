import { SafeAreaView, StyleSheet, StatusBar, Text, Pressable } from 'react-native';

export default function ListSelectionScreen({ navigation, route }) {
  const { data, user, dest, finalDest, bypass } = route.params
  if(bypass){
    data.classId=bypass[0]
    return navigation.replace(dest, { data, user, dest: finalDest, bypass: bypass[1] })
  }
  const MapList = (value) => {
    return (
      value.userList.map((prop, key) => {
        return (
          <Pressable onPress={() => {buttonPressed(prop)}} style={styles.btnContainer}>
            <Text style={styles.btnText}>{prop}</Text>
          </Pressable>
        )
      })
    )
  }
  async function buttonPressed(elementId){
    if (user.type==='teacher'){
      data.classId = elementId
    } else {
      data.subjectId = elementId
    }
    navigation.replace(dest, { data, user, dest: finalDest })
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='white' />
      <Text style={styles.title}>SELECT A {user.type==='teacher'?'CLASS':'SUBJECT'}</Text>
      <MapList userList={user.type==='teacher'?data.classIdList:data.subjectIdList} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 34,
    paddingBottom: 25,
    marginTop: 50,
    textAlign: 'center',
    color: 'rgb(74,74,76)',
  },
  btnContainer: {
    backgroundColor: 'rgb(61,175,228)',
    borderRadius: 4,
    elevation: 5,
    marginTop: 40,
    width: 310,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'center',
    paddingVertical: 17,
  },
});
