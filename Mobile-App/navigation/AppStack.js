import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';

const { Navigator, Screen } = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Navigator screenOptions={{ headerShown: false, navigationBarColor: 'rgba(0,0,0,0.01)' }}>
      <Screen name='Home' component={HomeScreen} />
      <Screen name='Login' component={LoginScreen} />
    </Navigator>
  );
}
