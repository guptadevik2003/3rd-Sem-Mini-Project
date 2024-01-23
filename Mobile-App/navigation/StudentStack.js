import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StudentScreen from '../screens/StudentScreen';
import ListSelectionScreen from '../screens/ListSelectionScreen';
import StudentMarkScreen from '../screens/StudentMarkScreen';
import DateListScreen from '../screens/DateListScreen';
import StudentViewScreen from '../screens/StudentViewScreen';

const { Navigator, Screen } = createNativeStackNavigator();

export default function StudentStack() {
  return (
    <Navigator screenOptions={{ headerShown: false, navigationBarColor: 'rgba(0,0,0,0.01)' }}>
      <Screen name='Student' component={StudentScreen} />
      <Screen name='ListSelection' component={ListSelectionScreen} />
      <Screen name='StudentMark' component={StudentMarkScreen} />
      <Screen name='DateList' component={DateListScreen} />
      <Screen name='StudentView' component={StudentViewScreen} />
    </Navigator>
  );
}
