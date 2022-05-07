/* eslint-disable @typescript-eslint/no-unused-vars */
import {IProgram} from '@/models/album';
import {RootStackParamList} from '@/navigator/index';
import {RouteProp} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {
  NativeViewGestureHandler,
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import {SceneRendererProps, TabBar, TabView} from 'react-native-tab-view';
import Introduction from './Introduction';
import List from './List';

interface IRoute {
  key: string;
  title: string;
}

interface IState {
  routes: IRoute[];
  index: number;
}

interface ITabProps {
  route: RouteProp<RootStackParamList, 'Album'>;
  panRef: React.RefObject<PanGestureHandler>;
  tapRef: React.RefObject<TapGestureHandler>;
  nativeRef: React.RefObject<NativeViewGestureHandler>;
  onScrollDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onItemPress: (data: IProgram, index: number) => void;
}

class Tab extends React.Component<ITabProps, IState> {
  state = {
    routes: [
      {key: 'introduction', title: '简介'},
      {key: 'albums', title: '节目'},
    ],
    index: 1,
  };
  onIndexChange = (index: number) => {
    this.setState({
      index,
    });
  };
  renderScene = ({route}: {route: IRoute}) => {
    const {panRef, tapRef, nativeRef, onScrollDrag, onItemPress} = this.props;
    switch (route.key) {
      case 'introduction':
        return <Introduction />;
      case 'albums':
        return (
          <List
            panRef={panRef}
            tapRef={tapRef}
            nativeRef={nativeRef}
            onScrollDrag={onScrollDrag}
            onItemPress={onItemPress}
          />
        );
    }
  };
  renderTabBar = (props: SceneRendererProps & {navigationState: IState}) => {
    return (
      <TabBar
        {...props}
        scrollEnabled
        tabStyle={styles.tabStyle}
        labelStyle={styles.label}
        style={styles.tabbar}
        indicatorStyle={styles.indicatorStyle}
      />
    );
  };
  render() {
    return (
      <TabView
        navigationState={this.state}
        onIndexChange={this.onIndexChange}
        renderScene={this.renderScene}
        renderTabBar={this.renderTabBar}
      />
    );
  }
}

const styles = StyleSheet.create({
  tabStyle: {
    width: 80,
  },
  label: {
    color: '#eee',
    backgroundColor: '#eee',
    tintColor: '#ddd',
  },
  tabbar: {
    backgroundColor: '#fff',
    ...Platform.select({
      android: {
        elevation: 0,
        borderBottomColor: '#e3e3e3',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
    }),
  },
  indicatorStyle: {
    backgroundColor: '#eb6d48',
    borderLeftWidth: 15,
    borderRightWidth: 20,
    borderColor: '#fff',
  },
});

export default Tab;
