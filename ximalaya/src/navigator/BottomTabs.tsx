import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '@/pages/Home';
import Listen from '@/pages/Listen';
import Account from '@/pages/Account';
import Found from '@/pages/Found';
import {RootStackNavigation, RootStackParamList} from '@/navigator/index';
import {
  getFocusedRouteNameFromRoute,
  RouteProp,
  TabNavigationState,
} from '@react-navigation/native';
import HomeTabs from './HomeTabs';

export type BottomTabParamList = {
  HomeTabs: undefined;
  Listen: undefined;
  Found: undefined;
  Account: undefined;
};
const Tab = createBottomTabNavigator<BottomTabParamList>();
function getHeaderTitle(routeName: string | undefined) {
  switch (routeName) {
    case 'HomeTabs':
      return '首页';
    case 'Listen':
      return '我听';
    case 'Found':
      return '发现';
    case 'Account':
      return '账号';
    default:
      return '';
  }
}

interface IProps {
  navigation: RootStackNavigation;
  route: RouteProp<RootStackParamList, 'BottomTabs'> & {
    state?: TabNavigationState<any>;
  };
}

class BottomTabs extends React.Component<IProps, any> {
  componentDidMount() {
    const {navigation, route} = this.props;
    const routeName = getFocusedRouteNameFromRoute(route)
      ? getFocusedRouteNameFromRoute(route)
      : route.params
      ? route.params.screen
      : 'HomeTabs';
    if (routeName === 'HomeTabs') {
      navigation.setOptions({
        headerTitle: '首页',
        // headerTintColor:'#000000',
        headerTransparent: false,
      });
    } else {
      navigation.setOptions({
        headerTitle: getHeaderTitle(routeName),
        headerTransparent: false,
      });
    }
  }
  componentDidUpdate() {
    const {navigation, route} = this.props;
    const routeName = getFocusedRouteNameFromRoute(route)
      ? getFocusedRouteNameFromRoute(route)
      : route.params
      ? route.params.screen
      : 'HomeTabs';
    navigation.setOptions({
      headerTitle: getHeaderTitle(routeName),
    });
  }

  render() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#f86442',
          headerShown: false,
        }}>
        <Tab.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{tabBarLabel: '首页'}}
        />
        <Tab.Screen
          name="Listen"
          component={Listen}
          options={{tabBarLabel: '我听'}}
        />
        <Tab.Screen
          name="Found"
          component={Found}
          options={{tabBarLabel: '发现'}}
        />
        <Tab.Screen
          name="Account"
          component={Account}
          options={{tabBarLabel: '我的'}}
        />
      </Tab.Navigator>
    );
  }
}

export default BottomTabs;
