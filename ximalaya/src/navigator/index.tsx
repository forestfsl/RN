/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
// import {
//   createNativeStackNavigator,
//   NativeStackNavigationProp,
// } from '@react-navigation/native-stack';

import {
  CardStyleInterpolators,
  createStackNavigator,
  HeaderStyleInterpolators,
  StackNavigationProp,
} from '@react-navigation/stack';

import BottomTabs from '@/navigator/BottomTabs';
import Detail from '@/pages/Detail';
import {Platform, StatusBar, StatusBarIOS, StyleSheet} from 'react-native';
import Category from '@/pages/Category';

export type RootStackParamList = {
  BottomTabs: {
    screen?: string;
  };
  Category: undefined;
  Detail: {
    id: number;
  };
};
export type RootStackNavigation = StackNavigationProp<RootStackParamList>;
let Stack = createStackNavigator<RootStackParamList>();
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
            // headerShown:false,
            headerTitleAlign: 'center',
            headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            gestureEnabled: true,
            ...Platform.select({
              android: {
                headerStatusBarHeight: StatusBar.currentHeight,
              },
            }),
            headerBackTitleVisible: false,
            headerTintColor: '#333',
            // @ts-ignore
            headerStyle: {
              // backgroundColor: 'red',
              ...Platform.select({
                android: {
                  elevation: 0,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
              }),
            },
          }}>
          <Stack.Screen
            key="BottomTabs"
            name={'BottomTabs'}
            component={BottomTabs}
            options={({route}) => ({
              headerTitle: route.name,
              // header:() => {},
            })}
          />
          <Stack.Screen
            key="Category"
            name={'Category'}
            component={Category}
            options={({route}) => ({
              headerTitle: '分类',
            })}
          />
          <Stack.Screen name={'Detail'} component={Detail} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Navigator;
