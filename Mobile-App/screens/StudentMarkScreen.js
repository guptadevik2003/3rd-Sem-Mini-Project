import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text, Pressable, View } from 'react-native';
import WifiManager from '@react-native-tethering/wifi';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { AxiosServer } from '../utils/AxiosServer';

export default function StudentMarkScreen({ navigation, route }) {
  const { classId, studentId, subjectId } = route.params.data
  const [wifiList, setWifiList] = useState([])
  useEffect(() => { loadWifiList() }, []) // Loading Wifi List at Screen Load
  async function loadWifiList(){
    try {
      var list = await WifiManager.getWifiNetworks(true)
    } catch(err) {
    }
    if(list) setWifiList(list.filter(w=>w.ssid!='').sort((a,b)=>a.ssid.localeCompare(b.ssid)))
  }
  async function loadWifiListwithRefresh(){
    try {
      var list = await WifiManager.getWifiNetworks(true)
    } catch(err) {
    }
    if(list) setWifiList(list.filter(w=>w.ssid!='').sort((a,b)=>a.ssid.localeCompare(b.ssid)))

    await confirmButtonPressed()
  }
  async function confirmButtonPressed(){
    const WifiSSIDList = []
    wifiList.forEach(wifi => WifiSSIDList.push(wifi.ssid))
    await AxiosServer.post('/api/student/mark-attendance', {
      classId, subjectId, studentId, hotspotSSIDList: WifiSSIDList
    }).then(res => {
      if(!res.data.success) return alert(res.data.error)
      alert('Attendance Marked Successfully!')
      navigation.navigate('Student')
    })
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='white' />
      <Text style={styles.title}>WIFI NETWORKS</Text>
      <View style={{flex: 1, width: 316}}>
        {wifiList.map((prop, key) => {
          return (
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
              <Icon name='wifi' color='#888' size={18}/>
              <Text numberOfLines={1} style={styles.text}>{prop.ssid}</Text>
            </View>

          )
        })}
        <Pressable onPress={() => loadWifiListwithRefresh()} style={styles.btnContainer}>
        <Text style={styles.btnText}>REFRESH NETWORK</Text>
      </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 34,
    padding: 15,
    textAlign: 'center',
    color: 'rgb(74,74,76)',
    marginTop: 100,
    marginBottom: 35
  },
  text: {
    fontWeight: '400',
    color: 'rgb(117,117,117)',
    fontSize: 24,
    marginLeft: 7,
    maxWidth: 300,
  },
  btnContainer: {
    backgroundColor: 'rgb(61,175,228)',
    borderRadius: 7,
    elevation: 5,
    marginTop: 60,
    marginBottom: 200,
    width: 316,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'center',
    paddingVertical: 15,
  },
});
