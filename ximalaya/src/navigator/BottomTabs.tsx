/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Icon from '@/assets/iconfont/index';
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
import {Button} from 'react-native';
import Play from '@/pages/views/Play';

export type BottomTabParamList = {
  HomeTabs: undefined;
  Listen: undefined;
  Play: undefined;
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
    this.setOptions();
  }
  componentDidUpdate() {
    this.setOptions();
  }

  setOptions = () => {
    const {navigation, route} = this.props;
    const routeName = getFocusedRouteNameFromRoute(route)
      ? getFocusedRouteNameFromRoute(route)
      : route.params
      ? route.params.screen
      : 'HomeTabs';
    if (routeName === 'HomeTabs') {
      navigation.setOptions({
        headerTitle: '',
        headerTransparent: true,
      });
    } else {
      navigation.setOptions({
        headerTitle: getHeaderTitle(routeName),
        headerTransparent: false,
      });
    }
  };

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
          options={{
            tabBarLabel: '首页',
            tabBarIcon: ({color, size}) => (
              <Icon name="icon-shouye" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Listen"
          component={Listen}
          options={{
            tabBarLabel: '我听',
            tabBarIcon: ({color, size}) => (
              <Icon name="icon-shoucang" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Play"
          component={Play}
          options={({navigation}) => ({
            tabBarButton: () => {
              return (
                <Play
                  onPress={() => navigation.navigate('ListDetail', {id: '123'})}
                />
              );
            },
          })}
        />
        <Tab.Screen
          name="Found"
          component={Found}
          options={{
            tabBarLabel: '发现',
            tabBarIcon: ({color, size}) => (
              <Icon name="icon-faxian" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={Account}
          options={{
            tabBarLabel: '我的',
            tabBarIcon: ({color, size}) => (
              <Icon name="icon-user" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

export default BottomTabs;
