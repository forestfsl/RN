import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import Home from '@/pages/Home';
import Detail from '@/pages/Detail';
import {Platform, StyleSheet} from 'react-native';

export type RootStackParamList = {
  Home: undefined;
  Detail: {
    id: number;
  };
};
export type RootStackNavigation = NativeStackNavigationProp<RootStackParamList>;
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
            gestureEnabled: true,
            // @ts-ignore
            headerStyle: {
              ...Platform.select({
                android: {
                  elevation: 0,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
              }),
            },
          }}>
          <Stack.Screen
            options={{headerTitleAlign: 'left', headerTitle: '首页'}}
            name={'Home'}
            component={Home}
          />
          <Stack.Screen name={'Detail'} component={Detail} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Navigator;
