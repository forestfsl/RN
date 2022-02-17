/* eslint-disable react-native/no-inline-styles */
import Touchable from '@/components/Touchable';
import {RootState} from '@/models/index';
import {
  MaterialTopTabBar,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import LinearGradient from 'react-native-linear-gradient';
import LinearLinearGradientAnimatedGradient from 'react-native-linear-animated-gradient-transition';
import {connect, ConnectedProps} from 'react-redux';

const mapStateToProps = ({home}: RootState) => {
  console.log('xxxxxxxx');
  console.log(home.activeCarouselIndex);
  // console.log(home.carousels[home.activeCarouselIndex].colors);
  // return {
  //   undefined,
  // };
  return {
    linearColors: home.carousels
      ? home.carousels[home.activeCarouselIndex].colors
      : undefined,
  };
};

const connector = connect(mapStateToProps);
type ModelState = ConnectedProps<typeof connector>;

type IProps = MaterialTopTabBarProps & ModelState;

class TopTabBarWrapper extends React.Component<IProps> {
  get gradient() {
    const {linearColors = ['#ccc', '#e2e2e2']} = this.props;
    return (
      <LinearLinearGradientAnimatedGradient
        colors={linearColors}
        style={styles.gradient}
      />
    );
  }

  render() {
    let textStyle = styles.blackText;
    return (
      <View style={styles.container}>
        {this.gradient}
        <View style={styles.topTabBarView}>
          <View style={styles.tabbar}>
            <MaterialTopTabBar
              {...this.props}
              //   indicatorStyle={indicatorStyle}
              //   activeTintColor={activeTintColor}
              //   inactiveTintColor={inactiveTintColor}
              style={{backgroundColor: 'transparent'}}
            />
          </View>
          <Touchable style={styles.sortBtn}>
            <Text style={textStyle}>分类</Text>
          </Touchable>
        </View>

        <View style={styles.searchBar}>
          <Touchable style={styles.search}>
            <Text style={textStyle}>搜索按钮</Text>
          </Touchable>
          <Touchable style={styles.history}>
            <Text style={textStyle}>历史记录</Text>
          </Touchable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  gradient: {
    ...StyleSheet.absoluteFillObject,
    height: 260,
    paddingTop: getStatusBarHeight(),
  },
  topTabBarView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: getStatusBarHeight(),
  },
  tabbar: {
    flex: 1,
    overflow: 'hidden',
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 15,
  },
  search: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 12,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  history: {
    marginLeft: 24,
  },
  sortBtn: {
    paddingHorizontal: 8,
    borderLeftColor: '#eee',
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
  text: {
    color: '#fff',
  },
  blackText: {
    color: '#333',
  },
});

export default connector(TopTabBarWrapper);
