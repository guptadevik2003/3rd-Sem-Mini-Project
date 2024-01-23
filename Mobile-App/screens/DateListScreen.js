import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { AxiosServer } from '../utils/AxiosServer';

export default function DateListScreen({ navigation, route }) {
  const { data, user, dest, bypass } = route.params
  const [attendanceData, setAttendanceData] = useState([])
  useEffect(() => {
    AxiosServer.post(`/api/${user.type}/get-attendance-list`, {
      subjectId: data.subjectId, teacherId: data.teacherId, classId: data.classId
    }).then(res => {
      if(!res.data.success){
        alert(res.data.error)
        return navigation.navigate(`${user.type.charAt(0).toUpperCase()}${user.type.substring(1)}`)
      }
      setAttendanceData(res.data.data)
      if(bypass){
        buttonPressed(res.data.data.filter(a => a.attendanceDate==bypass)[0]._id)
      }
    })
  }, [])
  const MapList = (value) => {
    return (
      value.userList.map((prop, key) => {
        return (
          <Pressable onPress={() => {buttonPressed(prop._id)}} style={styles.btnContainer}>
            <Text style={styles.btnText}>{new Date(prop.attendanceDate).toDateString()}</Text>
          </Pressable>
        )
      })
    )
  }
  async function buttonPressed(_id){
    await AxiosServer.post(`/api/${user.type}/get-attendance-info`, {
      id: _id
    }).then(res => {
      if(!res.data.success){
        alert(res.data.error)
        return navigation.navigate(`${user.type.charAt(0).toUpperCase()}${user.type.substring(1)}`)
      }
      if(bypass) return navigation.replace(dest, { data, user, attendance: res.data.data })
      navigation.navigate(dest, { data, user, attendance: res.data.data })
    })
  }
  if(bypass) return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <StatusBar barStyle='dark-content' backgroundColor='white' />
      <ActivityIndicator size='large' color='rgb(61,175,228)' />
    </SafeAreaView>
  )
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='white' />
      <Text style={styles.title}>SELECT A DATE</Text>
      <ScrollView style={{marginBottom: 30}}>
        <MapList userList={attendanceData} />
      </ScrollView>
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
