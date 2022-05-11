/* eslint-disable @typescript-eslint/no-unused-vars */
import {Dimensions, StatusBar} from 'react-native';
import {NavigationState} from '@react-navigation/native';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

const statusBarHeight = StatusBar.currentHeight;

//根据百分比获取宽度
function wp(percentage: number) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

function formatTime(seconds: number) {
  const m = parseInt((seconds % (60 * 60)) / 60 + '', 10);
  const s = parseInt((seconds % 60) + '', 10);

  return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
}

function hp(percentage: number) {
  const value = (percentage * viewportHeight) / 100;
  return Math.round(value);
}

function getActiveRouteName(state: NavigationState) {
  let route;
  route = state.routes[state.index];
  while (route.state && route.state.index) {
    route = route.state.routes[route.state.index];
  }
  return route.name;
}

export {
  statusBarHeight,
  viewportWidth,
  viewportHeight,
  wp,
  hp,
  getActiveRouteName,
  formatTime,
};
