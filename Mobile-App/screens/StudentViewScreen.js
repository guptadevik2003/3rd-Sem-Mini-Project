import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text, ScrollView, View } from 'react-native';
import { AxiosServer } from '../utils/AxiosServer';
import * as Progress from 'react-native-progress';

export default function StudentViewScreen({ navigation, route }) {
  const { data, user } = route.params
  const [attendanceData, setAttendanceData] = useState([])
  const [count, setCount] = useState(new Map())
  useEffect(() => {
    AxiosServer.post('/api/student/get-attendance-info', {
      subjectId: data.subjectId, classId: data.classId
    }).then(res => {
      if(!res.data.success){
        alert(res.data.error)
        return navigation.navigate(`Student`)
      }
      setCount(count.set('total', res.data.data.length))
      let presentCount = res.data.data.filter(a => a.presentStudentIdList.includes(data.studentId)).length
      setCount(count.set('present', presentCount))
      setAttendanceData(res.data.data)
    })
    AxiosServer.post('/api/student/get-teacher-subject', {
      subjectId: data.subjectId
    }).then(res => {
      if(!res.data.success){
        alert(res.data.error)
        return navigation.navigate(`Student`)
      }
      data.teacherData = res.data.data
    })
  }, [])
  function genNum(){
    let num = Number(count.get('present')/count.get('total')).toFixed(2)
    if(isNaN(num)) return 0;
    else return num;
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='rgb(61,175,228)' />
      <View>
        <View style={styles.profileContainer}>
          <View style={{flexDirection:'row'}}>
            <View>
              <Text style={styles.welcomeText}>{data.classId} ({data.studentId})</Text>
              <Text style={styles.nameText}>{user.fullName}</Text>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
          <Text style={{marginLeft: 18, fontWeight: 'bold', color: 'white'}}>ATTENDANCE IN {data.subjectId}</Text>
          <Text style={{marginRight: 20, fontWeight: 'semibold', color: 'white'}}>{Number(count.get('present')/count.get('total')*100).toFixed(2)} %</Text>
        </View>
        <Progress.Bar
          style={{marginLeft: 15, marginBottom: 25}}
          progress={genNum()}
          width={380}
          height={7}
          color='white'
          // animationType='timing'
        />
      </View>
      <View style={styles.subContainer}>
        <ScrollView  style={{marginBottom: 20, marginTop: 25}}>
          {attendanceData.map((prop, key) => {
            return (
              <View style={[styles.cardContainer, { backgroundColor: `${prop.presentStudentIdList.includes(data.studentId)?'rgba(184,227,187,0.3)':'rgba(235,182,171,0.3)'}`, borderColor: `${prop.presentStudentIdList.includes(data.studentId)?'#5cba63':'#cb4b32'}` }]}>
                <Text style={{position: 'absolute', right: 18, fontSize: 46, fontWeight: 'bold', color: `${prop.presentStudentIdList.includes(data.studentId)?'#5cba63':'#cb4b32'}` }}>{prop.presentStudentIdList.includes(data.studentId)?'P':'A'}</Text>
                <Text style={[styles.cardText, { color: `${prop.presentStudentIdList.includes(data.studentId)?'#5cba63':'#cb4b32'}` }]}>{new Date(prop.attendanceDate).toDateString()}</Text>
                <Text style={styles.cardSubText}>Attendance Index: {key+1}</Text>
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
  profileContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between'
  },
  userImage: {
    height: 60,
    width: 60,
    borderRadius: 100,
    marginLeft: -5,
    marginRight: 12,
    resizeMode: 'stretch',
  },
  welcomeText: {
    color: 'white',
    fontWeight: 'semibold',
    fontSize: 18
  },
  nameText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30
  },
  subContainer: {
    backgroundColor: 'white',
    flex: 1,
    marginTop: 10,
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
