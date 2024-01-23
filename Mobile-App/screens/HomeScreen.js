import { SafeAreaView, StyleSheet, Text, StatusBar, Image, Pressable } from 'react-native';

export default function HomeScreen({ navigation }) {
  // Daily Attendance Management Network
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='white' />
      <Image style={styles.image} source={require('../assets/classes.png')} />
      <Text style={styles.title}>Welcome to DAMN.{'\n'}Manage Attendance. Run Reports.</Text>
      <Text style={styles.text}>All-in-one attendance manager in your pocket.</Text>
      <Pressable style={styles.btnContainer} onPress={() => {navigation.navigate('Login')}}>
        <Text style={styles.btnText}>Get Started</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 69,
  },
  image: {
    height: 250,
    width: 330,
    resizeMode: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    padding: 15,
    textAlign: 'center',
    color: 'rgb(74,74,76)',
    marginTop: 20,
  },
  text: {
    fontWeight: '400',
    paddingHorizontal: 40,
    textAlign: 'center',
    color: 'rgb(117,117,117)',
    fontSize: 20,
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
