import { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text, Pressable } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { AxiosServer } from '../utils/AxiosServer';

export default function TeacherTakeScreen({ navigation, route }) {
  const progressRef = useRef(null)
  const { classId, hotspotSSID, subjectId, teacherId } = route.params.data
  useEffect(() => { // Fetching teacher data on Screen Load
    AxiosServer.post('/api/teacher/take-attendance', {
      classId, subjectId, teacherId, hotspotSSID
    }).then(res => {
      if(!res.data.success) return alert(res.data.error)
      progressRef.current.play()
    })
  }, [])
  async function deleteCurrentAttendance(){
    if(!classId) return alert('Error Occurred! Retry!')
    await AxiosServer.post('/api/teacher/take-attendance/done', {
      classId, subjectId, teacherId
    }).then(res => {
      if(!res.data.success) return alert(res.data.error)
      if(res.data.exception){
        alert(res.data.exception)
        return navigation.navigate('Teacher')
      }
      progressRef.current.pause()
      navigation.replace('ListSelection', { data: route.params.data, user: route.params.user, dest: 'DateList', finalDest: 'TeacherView', bypass: [classId, res.data.data.attendanceDate] })
    })

  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='white' />
      <Text style={styles.title}>ATTENDANCE TIMER</Text>
      <Text style={styles.subTextBold}>Turn on your Mobile Hotspot</Text>
      <Text style={styles.subText}>This page will refresh automatically...</Text>
      <CircularProgress
        ref={progressRef}
        value={0}
        radius={120}
        maxValue={100}
        initialValue={100}
        progressValueColor='rgb(80,80,80)'
        activeStrokeColor='rgb(61,175,228)'
        inActiveStrokeOpacity={0.25}
        valueSuffix={'s'}
        activeStrokeWidth={15}
        inActiveStrokeWidth={15}
        duration={100000}
        startInPausedState={true}
        onAnimationComplete={() => deleteCurrentAttendance()}
      />
      <Pressable onPress={() => deleteCurrentAttendance()} style={styles.btnContainer}>
        <Text style={styles.btnText}>STOP EARLY</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 34,
    paddingBottom: 40,
    marginTop: 150,
    textAlign: 'center',
    color: 'rgb(74,74,76)',
  },
  subTextBold: {
    fontWeight: '500',
    fontSize: 22,
    paddingBottom: 4,
    textAlign: 'center',
    color: 'rgb(130,130,130)',
  },
  subText: {
    fontWeight: 'semibold',
    fontSize: 22,
    paddingBottom: 60,
    textAlign: 'center',
    color: 'rgb(130,130,130)',
  },
  btnContainer: {
    backgroundColor: 'rgb(61,175,228)',
    borderRadius: 4,
    elevation: 5,
    marginTop: 70,
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
