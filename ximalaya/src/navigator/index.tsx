import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '@/pages/Home';
import Detail from '@/pages/Detail';

type RootStackParamList = {
  Home: undefined;
  Detail: undefined;
};
let Stack = createNativeStackNavigator<RootStackParamList>();
/*
{
    Navigator,
    Screen
}
 */
class Navigator extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitleAlign: 'center',
          }}>
          <Stack.Screen options={{headerTitleAlign:'left',headerTitle:'首页'}} name={'Home'} component={Home} />
          <Stack.Screen name={'Detail'} component={Detail} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Navigator;
