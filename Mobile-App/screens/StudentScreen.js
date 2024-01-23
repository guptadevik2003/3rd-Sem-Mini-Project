import { useContext, useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, Text, Image, Pressable, PermissionsAndroid } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { AxiosServer } from '../utils/AxiosServer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/Entypo';

export default function StudentScreen({ navigation }) {
  const { logout, userToken, userData } = useContext(AuthContext)
  const [studentData, setStudentData] = useState(null)
  useEffect(() => {
    AxiosServer.get('/api/student/info').then(res => { setStudentData(res.data) })
  }, [])
  async function getWifiPermission(){
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission is required for WiFi connections',
        message:
          'This app needs location permission as this is required  ' +
          'to scan for wifi networks.',
        buttonNegative: 'DENY',
        buttonPositive: 'ALLOW',
      },
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED){
      if(!studentData.success) return alert(studentData.error)
      navigation.navigate('ListSelection', { data: studentData.data, user: userData, dest: 'StudentMark' })
    } else {
      await getWifiPermission()
    }
  }
  async function viewAttendancePressed(){
    if(!studentData.success) return alert(studentData.error)
    navigation.navigate('ListSelection', { data: studentData.data, user: userData, dest: 'StudentView' })
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='white' />
      <View style={{flexDirection:'row', padding: 30}}>
        <Image source={userData.type==='student'?require('../assets/student.jpg'):require('../assets/teacher.jpg')} style={styles.userImage}/>
        <View>
          <Text style={styles.nameText}>{userData.fullName}</Text>
          <Text style={styles.subText}>{userData.type[0].toUpperCase()+userData.type.slice(1)} ({studentData?.data?studentData.data.classId:""})</Text>
        </View>
      </View>
      <View style={styles.profileInfoContainer}>
        <Icon name='id-card' color='rgb(170,170,170)' size={18}/>
        <Text style={styles.profileInfoText}>{userData.typeId}</Text>
      </View>
      <View style={styles.profileInfoContainer}>
        <Icon2 name='mail' color='rgb(170,170,170)' size={22}/>
        <Text style={styles.profileInfoText}>{userData.emailId}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Pressable onPress={async () => {await getWifiPermission()}} style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30}}>
          <Icon name='marker' color='rgb(61,175,228)' size={20} />
          <Text style={{color: 'black', padding: 20, fontWeight: 'bold', fontSize: 18}}>Mark Attendance</Text>
        </Pressable>
        <Pressable onPress={() => viewAttendancePressed()} style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 33}}>
          <Icon name='calendar-alt' color='rgb(61,175,228)' size={20} />
          <Text style={{color: 'black', padding: 20, fontWeight: 'bold', fontSize: 18}}>View Attendance</Text>
        </Pressable>
        {/* Dummy Element */}
        {/* <Pressable style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30}}>
          <Icon name='power-off' color='rgb(61,175,228)' size={20} />
          <Text style={{color: 'black', padding: 20, fontWeight: 'bold', fontSize: 18}}>Log out</Text>
        </Pressable> */}
      </View>
      <Pressable onPress={async () => {await logout()}} style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, marginBottom: 15}}>
        <Icon name='power-off' color='red' size={20} />
        <Text style={{color: 'red', padding: 20, fontWeight: 'bold', fontSize: 18}}>Log out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 25
  },
  userImage: {
    height: 80,
    width: 80,
    borderRadius: 100,
    marginLeft: -5,
    marginRight: 20,
    resizeMode: 'stretch',
  },
  nameText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 8
  },
  subText: {
    color: 'rgb(170,170,170)',
    fontWeight: '500',
    fontSize: 18
  },
  profileInfoContainer: {
    flexDirection:'row',
    paddingHorizontal: 30,
    paddingTop: 5,
    paddingBottom: 15
  },
  profileInfoText: {
    color: 'rgb(170,170,170)',
    marginLeft: 20,
    fontWeight: '500',
    fontSize: 15
  },
  buttonsContainer: {
    flex: 1,
    marginTop: 25,
    borderTopColor: 'rgb(170,170,170)',
    borderTopWidth: 1,
    borderBottomColor: 'rgb(170,170,170)',
    borderBottomWidth: 1
  },
});
