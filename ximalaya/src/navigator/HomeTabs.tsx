/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import Home from '@/pages/Home';
import {StyleSheet, View} from 'react-native';
import TopTabBarWrapper from '@/pages/views/TopTabBarWrapper';
import {RootState} from '../models';
import {connect, ConnectedProps} from 'react-redux';
import {ICategory} from '@/models/category';
import {createHomeModel} from '@/config/dva';

export type HomeParamList = {
  [key: string]: {
    namespace: string;
  };
};

const Tab = createMaterialTopTabNavigator<HomeParamList>();

const mapStateToProps = ({category}: RootState) => {
  return {
    myCategorys: category.myCategorys,
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {}

class HomeTabs extends React.Component<IProps> {
  renderTabBar = (props: MaterialTopTabBarProps) => {
    return <TopTabBarWrapper {...props} />;
  };

  renderScreen = (item: ICategory) => {
    createHomeModel(item.id);
    return (
      <Tab.Screen
        key={item.id}
        name={item.id}
        component={Home}
        options={{tabBarLabel: item.name}}
        initialParams={{
          namespace: item.id,
        }}
      />
    );
  };
  render() {
    const {myCategorys} = this.props;
    return (
      <Tab.Navigator
        lazy
        tabBar={this.renderTabBar}
        sceneContainerStyle={styles.sceneContainer}
        tabBarOptions={{
          scrollEnabled: true,
          tabStyle: {
            width: 80,
          },
          indicatorStyle: {
            height: 4,
            width: 20,
            marginLeft: 30,
            borderRadius: 2,
            backgroundColor: '#f86442',
          },
          activeTintColor: '#f86442',
          inactiveTintColor: '#333333',
        }}>
        {myCategorys.map(this.renderScreen)}
        {/* <Tab.Screen name="Home1" component={Home} />
        <Tab.Screen name="Home2" component={Home} /> */}
      </Tab.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  sceneContainer: {
    backgroundColor: 'transparent',
  },
});

export default connector(HomeTabs);
