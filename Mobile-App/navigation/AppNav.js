import { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

import AppStack from './AppStack';
import StudentStack from './StudentStack';
import TeacherStack from './TeacherStack';

export default function AppNav() {
  const { isLoading, userToken, userData } = useContext(AuthContext)
  if(isLoading){
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      { userData === null ?
        <AppStack /> : 
        userData.type === 'student' ? <StudentStack /> : <TeacherStack />
      }
      {/* <AppStack /> */}
      {/* <StudentStack /> */}
      {/* <TeacherStack /> */}
    </NavigationContainer>
  );
}
