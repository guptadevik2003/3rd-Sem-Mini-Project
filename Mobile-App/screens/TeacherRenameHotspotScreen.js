import { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text, Pressable, View, TextInput } from 'react-native';
import { AxiosServer } from '../utils/AxiosServer';

export default function TeacherRenameHotspotScreen({ navigation, route }) {
  const [text, setText] = useState('')
  const [notify, setNotify] = useState('')
  const { teacherId } = route.params.data
  async function renameButtonPressed(){
    if(text.length<1) return alert('no_hotspotSSID')
    await AxiosServer.post('/api/teacher/rename-hotspot', {
      teacherId, hotspotSSID: text
    }).then(res => {
      if(!res.data.success) return alert(res.data.error)
      setNotify(`Changed Hotspot SSID to ${text}`)
    })
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='white' />
      <View>
        <Text style={styles.title}>RENAME HOTSPOT SSID</Text>
        <Text style={styles.inputTitle}>{notify}</Text>
        <TextInput
          style={styles.textInput}
          placeholderTextColor='rgb(160,160,160)'
          placeholder='New Hotspot SSID'
          onChangeText={setText}
          onChange={() => setNotify('')}
          value={text}
        />
        <Pressable onPress={() => renameButtonPressed()} style={styles.btnContainer}>
          <Text style={styles.btnText}>Rename</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    paddingBottom: 35,
    textAlign: 'center',
    color: 'rgb(74,74,76)',
  },
  inputTitle: {
    // color: 'rgb(80,80,80)',
    color: 'green',
    marginBottom: 15,
    fontSize: 15
  },
  textInput: {
    backgroundColor: '#e5e8ed',
    borderRadius: 4,
    height: 55,
    width: 310,
    paddingHorizontal: 20,
    marginBottom: 17,
    color: 'black'
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
