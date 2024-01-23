import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TeacherScreen from '../screens/TeacherScreen';
import ListSelectionScreen from '../screens/ListSelectionScreen';
import TeacherTakeScreen from '../screens/TeacherTakeScreen';
import TeacherViewScreen from '../screens/TeacherViewScreen';
import TeacherRenameHotspotScreen from '../screens/TeacherRenameHotspotScreen';
import DateListScreen from '../screens/DateListScreen';

const { Navigator, Screen } = createNativeStackNavigator();

export default function TeacherStack() {
  return (
    <Navigator screenOptions={{ headerShown: false, navigationBarColor: 'rgba(0,0,0,0.01)' }}>
      <Screen name='Teacher' component={TeacherScreen} />
      <Screen name='ListSelection' component={ListSelectionScreen} />
      <Screen name='TeacherTake' component={TeacherTakeScreen} />
      <Screen name='TeacherView' component={TeacherViewScreen} />
      <Screen name='TeacherRenameHotspot' component={TeacherRenameHotspotScreen} />
      <Screen name='DateList' component={DateListScreen} />
    </Navigator>
  );
}
