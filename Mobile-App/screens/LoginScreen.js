import { useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text, Pressable, View, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { AxiosServer } from '../utils/AxiosServer';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [emailValid, setEmailValid] = useState(false)
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  async function validateEmail(email){
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if(reg.test(email) === false){
      setEmail(email)
      setEmailValid(false)
    } else {
      setEmail(email)
      setEmailValid(true)
    }
  }
  async function pressed(){
    if(emailValid === false) {
      alert('Please enter valid Email Id.')
    } else if(password.length<8) {
      alert('Minimum password length is 8.')
    } else {
      const data = await AxiosServer.post('/api/login', { email, password }).then(res => {
        if(res.data.success) return res.data
        else {
          res.data.error ? alert(res.data.error) : alert(res.data)
          return null
        }
      }).catch(err => console.log(err))
      if(!(data === null)){
        await login(data.token, data.data)
      }
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='white' />
      {/* Login Modal */}
      <View style={styles.subContainer}>
        <Text style={styles.title}>SIGN IN TO YOUR ACCOUNT</Text>
        <Text style={styles.inputTitle}>Email</Text>
        <TextInput
          style={styles.textInput}
          placeholderTextColor='rgb(160,160,160)'
          // placeholder='EMAIL ID *'
          textContentType='emailAddress'
          onChangeText={(text) => validateEmail(text)}
          value={email}
        />
        <Text style={styles.inputTitle}>Password</Text>
        <View>
          <TextInput
            style={styles.textInput}
            placeholderTextColor='rgb(160,160,160)'
            // placeholder='PASSWORD *'
            secureTextEntry={!showPass}
            textContentType='password'
            onChangeText={setPassword}
            value={password}
          />
          <Pressable onPress={() => {setShowPass(!showPass)}} style={styles.passwordIcon}>
            <Icon name={showPass?'eye-slash':'eye'} color='rgb(120,120,120)' size={23}/>
          </Pressable>
        </View>
        <Pressable onPress={pressed} style={styles.btnContainer}>
          <Text style={styles.btnText}>SIGN IN</Text>
        </Pressable>
        <Text style={styles.forgotText}>Forgot your password?</Text>
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
    paddingBottom: 45,
    textAlign: 'center',
    color: 'rgb(74,74,76)',
  },
  inputTitle: {
    color: 'rgb(80,80,80)',
    marginBottom: 5,
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
  passwordIcon: {
    position: 'absolute',
    top: 16,
    right: 18
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
  forgotText: {
    color: 'rgb(160,160,160)',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 27,
    fontSize: 16
  },
});
