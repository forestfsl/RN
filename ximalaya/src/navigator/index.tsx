/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {NavigationContainer, NavigationState, RouteProp} from '@react-navigation/native';
import Icon from '@/assets/iconfont/index';
// import {
//   createNativeStackNavigator,
//   NativeStackNavigationProp,
// } from '@react-navigation/native-stack';

import {
  CardStyleInterpolators,
  createStackNavigator,
  HeaderStyleInterpolators,
  StackNavigationProp,
  TransitionPresets,
} from '@react-navigation/stack';

import {getActiveRouteName, navigationRef, statusBarHeight} from '@/utils/index';

import BottomTabs from '@/navigator/BottomTabs';
import Detail from '@/pages/Detail';
import {Platform, StatusBar, StatusBarIOS, StyleSheet} from 'react-native';
import Category from '@/pages/Category';
import Album from '@/pages/Album';
import Animated from 'react-native-reanimated';
import ListDetail from '@/pages/ListDetail/index';
import PlayView from '@/pages/views/PlayView';

export type RootStackParamList = {
  BottomTabs: {
    screen?: string;
  };
  Category: undefined;
  Album: {
    item: {
      id: string;
      title: string;
      image: string;
    };
  };
  Detail: {
    id?: number;
  };
  ListDetail: {
    id: string;
  };
};

function getAlbumOptions({
  route,
}: {
  route: RouteProp<RootStackParamList, 'Album'>;
}) {
  return {
    headerTitle: route.params.item.title,
    headerTransparent: true,
    headerTitleStyle: {
      opacity: 0,
    },
    headerBackground: () => {
      return <Animated.View style={styles.headerBackground} />;
    },
  };
}

const styles = StyleSheet.create({
  headerBackground: {
    flex: 1,
    backgroundColor: '#fff',
    opacity: 0,
  },
  headerBackImage: {
    marginVertical: 5,
    marginHorizontal: 8,
  },
});
export type RootStackNavigation = StackNavigationProp<RootStackParamList>;
let Stack = createStackNavigator<RootStackParamList>();
/*
{
    Navigator,
    Screen
}
 */

function RootStackScreen() {
  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        // headerShown:false,
        headerTitleAlign: 'center',
        ...TransitionPresets.ModalSlideFromBottomIOS,
        headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        headerStatusBarHeight: statusBarHeight,
        ...Platform.select({
          android: {
            headerStatusBarHeight: StatusBar.currentHeight,
            elevation: 0,
            borderBottomWidth: StyleSheet.hairlineWidth,
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
      <Stack.Screen
        key="Album"
        name={'Album'}
        component={Album}
        options={getAlbumOptions}
      />
      {/* <Stack.Screen name={'ListDetail'} component={ListDetail} /> */}
    </Stack.Navigator>
  );
}

export type ModalStackParamList = {
  Root: undefined;
  ListDetail: {
    id: string;
  };
};

const ModalStack = createStackNavigator<ModalStackParamList>();

export type ModalStackNavigation = StackNavigationProp<ModalStackParamList>;

function ModalStackScreen() {
  return (
    <ModalStack.Navigator
      mode="modal"
      headerMode="screen"
      screenOptions={() => ({
        ...TransitionPresets.ModalSlideFromBottomIOS,
        cardOverlayEnabled: true,
        gestureEnabled: true,
        headerTitleAlign: 'center',
        headerStatusBarHeight: statusBarHeight,
        headerBackTitleVisible: false,
      })}>
      <ModalStack.Screen
        name="Root"
        component={RootStackScreen}
        options={{headerShown: false}}
      />
      <ModalStack.Screen
        name="ListDetail"
        component={ListDetail}
        options={{
          headerTitle: '',
          headerTintColor: '#fff',
          headerTransparent: true,
          cardStyle: {backgroundColor: '#807c65'},
          headerBackImage: ({tintColor}) => (
            <Icon
              name="icon-down"
              size={30}
              color={tintColor}
              style={styles.headerBackImage}
            />
          ),
        }}
      />
    </ModalStack.Navigator>
  );
}

interface IState {
  navigationState: NavigationState | undefined;
}

class Navigator extends React.Component<IState> {
  state = {
    navigationState: undefined,
  };

  onStateChange = (state: NavigationState | undefined) => {
    this.setState({
      navigationState: state,
    });
  };
  render() {
    let activeScreenName = '';
    const {navigationState} = this.state;
    if (navigationState !== undefined) {
      activeScreenName = getActiveRouteName(navigationState);
    }
    return (
      <NavigationContainer ref={navigationRef}>
        <ModalStackScreen />
        <PlayView activeScreenName={activeScreenName} />
      </NavigationContainer>
    );
  }
}

export default Navigator;
